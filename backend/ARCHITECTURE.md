# 🏗️ Архитектура Marketplace - Микросервисы

## Текущая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│                    (Browser / Mobile)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway :3000                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • HTTP Endpoints                                   │     │
│  │  • Authentication/Authorization                     │     │
│  │  • Request Validation                              │     │
│  │  • Swagger Documentation                           │     │
│  │  • RabbitMQ Client (sends messages)                │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ RabbitMQ (AMQP)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                RabbitMQ Message Broker                       │
│               :5672 (AMQP) | :15672 (UI)                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Queues:                                            │     │
│  │   • promo_code_queue                               │     │
│  │   • order_queue         (planned)                  │     │
│  │   • product_queue       (planned)                  │     │
│  │   • user_queue          (planned)                  │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌──────────────────┐        ┌──────────────────┐
│  PromoCode       │        │   Future         │
│  Microservice    │        │   Services...    │
│                  │        │                  │
│  • Controller    │        │  • Product       │
│  • Service       │        │  • Order         │
│  • Entity        │        │  • User          │
│  • PostgreSQL    │        │  • Review        │
│  • RabbitMQ      │        │  • Analytics     │
└────────┬─────────┘        └──────────────────┘
         │
         │ TypeORM
         ▼
┌──────────────────┐
│   PostgreSQL     │
│      :5433       │
│                  │
│  • promo_codes   │
│  • products      │
│  • users         │
│  • orders        │
│  • ...           │
└──────────────────┘
```

---

## Поток данных (Request Flow)

### Пример: Валидация промокода

```
1. Client → API Gateway
   POST /promo-codes/validate
   { "code": "SUMMER2024", "orderAmount": 100 }

2. API Gateway → RabbitMQ
   Pattern: "validate_promo_code"
   Queue: "promo_code_queue"
   Payload: { "code": "SUMMER2024", "orderAmount": 100 }

3. RabbitMQ → PromoCode Service
   Сообщение доставлено в микросервис

4. PromoCode Service
   • Получает сообщение
   • Валидирует промокод в БД
   • Вычисляет скидку
   • Отправляет ответ обратно

5. PromoCode Service → RabbitMQ → API Gateway
   Response: {
     "success": true,
     "data": {
       "valid": true,
       "discountAmount": 20,
       "finalAmount": 80,
       "promoCode": { ... }
     }
   }

6. API Gateway → Client
   HTTP 200 OK
   { "valid": true, "discountAmount": 20, ... }
```

---

## Message Patterns

### PromoCode Service

| Pattern | Описание | Payload | Response |
|---------|----------|---------|----------|
| `get_all_promo_codes` | Все промокоды | `{}` | `PromoCode[]` |
| `get_active_promo_codes` | Активные промокоды | `{}` | `PromoCode[]` |
| `get_promo_code` | По ID | `number` | `PromoCode` |
| `get_promo_code_by_code` | По коду | `string` | `PromoCode` |
| `validate_promo_code` | Валидация | `ValidatePromoCodeDto` | `ValidationResult` |
| `create_promo_code` | Создать | `CreatePromoCodeDto` | `PromoCode` |
| `update_promo_code` | Обновить | `{ id, data }` | `PromoCode` |
| `delete_promo_code` | Удалить | `number` | `void` |

---

## Shared Library (@app/shared)

Общие ресурсы для всех сервисов:

```typescript
libs/shared/
├── src/
│   ├── constants/
│   │   └── index.ts           // RABBITMQ_QUEUES, RABBITMQ_PATTERNS
│   ├── types/
│   │   └── index.ts           // UserRole, E_OrderStatus, etc.
│   ├── interfaces/
│   │   └── index.ts           // ServiceResponse, RabbitMQConfig
│   └── config/
│       └── rabbitmq.config.ts // getRabbitMQConfig()
```

### Использование:

```typescript
import { 
  RABBITMQ_PATTERNS, 
  RABBITMQ_QUEUES,
  getRabbitMQConfig,
  UserRole 
} from '@app/shared';
```

---

## Преимущества микросервисной архитектуры

### ✅ Масштабируемость
- Каждый сервис масштабируется независимо
- PromoCode Service можно запустить в 3 копиях, а Product Service в 5

### ✅ Изоляция
- Падение одного сервиса не роняет всю систему
- Независимое развертывание

### ✅ Технологическая гибкость
- Разные БД для разных сервисов
- Разные языки программирования (в будущем)

### ✅ Разработка в команде
- Разные команды работают над разными сервисами
- Меньше конфликтов в Git

### ✅ Тестирование
- Легче тестировать изолированно
- Unit/Integration тесты для каждого сервиса

---

## Недостатки и решения

### ⚠️ Сложность инфраструктуры
**Решение:** Docker Compose для локальной разработки, Kubernetes для продакшена

### ⚠️ Распределенные транзакции
**Решение:** Saga Pattern, Event Sourcing

### ⚠️ Мониторинг
**Решение:** ELK Stack (Elasticsearch, Logstash, Kibana), Prometheus + Grafana

### ⚠️ Дебаггинг
**Решение:** Distributed Tracing (Jaeger, Zipkin)

---

## Дальнейшее развитие

### Phase 2: Выделение основных сервисов
- [ ] Product Service (каталог товаров)
- [ ] Order Service (заказы и корзина)
- [ ] User Service (пользователи и авторизация)

### Phase 3: Event-Driven коммуникация
- [ ] Order Created → Notification Service (email)
- [ ] Order Created → Warehouse Service (резерв товаров)
- [ ] Order Completed → Analytics Service

### Phase 4: Дополнительные сервисы
- [ ] Notification Service (email, SMS, push)
- [ ] File Upload Service (S3)
- [ ] Search Service (Elasticsearch)
- [ ] Recommendation Service (ML)

### Phase 5: Production Ready
- [ ] Docker images для каждого сервиса
- [ ] Kubernetes манифесты
- [ ] CI/CD pipelines
- [ ] Мониторинг и алерты
- [ ] Load balancing
- [ ] API Rate limiting

---

## Технологический стек

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Message Broker:** RabbitMQ
- **ORM:** TypeORM
- **Validation:** class-validator

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Docker Compose (dev), Kubernetes (prod)
- **API Documentation:** Swagger/OpenAPI

### Monitoring (планируется)
- **Logs:** ELK Stack
- **Metrics:** Prometheus + Grafana
- **Tracing:** Jaeger

---

## Безопасность

### API Gateway
- JWT Authentication
- Rate Limiting
- Request Validation
- CORS Configuration

### Microservices
- Internal network (не доступны извне)
- RabbitMQ с авторизацией
- PostgreSQL с изолированными пользователями

### Best Practices
- Не хранить секреты в коде
- Использовать .env для конфигурации
- Регулярные обновления зависимостей
- Security audits (npm audit)
