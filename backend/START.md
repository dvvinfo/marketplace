# 🚀 Быстрый старт

## Проверка инфраструктуры

```bash
# Проверить Docker контейнеры
docker ps

# Должны быть запущены:
# - marketplace_postgres
# - marketplace_rabbitmq
```

## Запуск микросервисов

### Терминал 1: PromoCode Service
```bash
npm run start:promo:dev
```

Ожидаемый вывод:
```
🎫 Promo Code Service is listening on RabbitMQ
```

### Терминал 2: API Gateway
```bash
npm run start:dev
```

Ожидаемый вывод:
```
🚀 Server started on http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api-docs
```

---

## ✅ Быстрая проверка

### 1. Проверить Swagger UI
Откройте: http://localhost:3000/api-docs

### 2. Тест через cURL

```bash
# Получить все промокоды (должен вернуть пустой массив или существующие промокоды)
curl http://localhost:3000/promo-codes
```

### 3. Создать тестовый промокод

```bash
curl -X POST http://localhost:3000/promo-codes \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"TEST2024\",
    \"discountType\": \"percentage\",
    \"discountValue\": 15,
    \"validFrom\": \"2024-01-01T00:00:00Z\",
    \"validUntil\": \"2024-12-31T23:59:59Z\",
    \"isActive\": true,
    \"minPurchaseAmount\": 50
  }"
```

### 4. Валидировать промокод

```bash
curl -X POST http://localhost:3000/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"TEST2024\",
    \"orderAmount\": 100
  }"
```

Ожидаемый ответ:
```json
{
  "valid": true,
  "promoCode": { ... },
  "discountAmount": 15,
  "finalAmount": 85
}
```

---

## 🔍 Мониторинг RabbitMQ

Откройте: http://localhost:15672
- **Login:** marketplace
- **Password:** marketplace

В разделе **Queues** должна быть очередь `promo_code_queue` с подключенным consumer.

---

## 🐛 Если что-то не работает

### PromoCode Service не запускается
```bash
# Проверить логи RabbitMQ
docker logs marketplace_rabbitmq

# Перезапустить RabbitMQ
docker-compose restart marketplace_rabbitmq
```

### API Gateway не может подключиться
```bash
# Убедиться, что PromoCode Service запущен
# Проверить порт 5672 не занят
netstat -ano | findstr :5672
```

### База данных недоступна
```bash
# Перезапустить PostgreSQL
docker-compose restart marketplace_postgres

# Проверить подключение
docker exec -it marketplace_postgres psql -U marketplace -d marketplace -c "SELECT 1;"
```

---

## 📊 Что происходит под капотом

```
[Client] --HTTP--> [API Gateway:3000]
                        |
                        | RabbitMQ Message
                        ▼
                   [RabbitMQ:5672]
                        |
                        ▼
                [PromoCode Service]
                        |
                        | TypeORM
                        ▼
                  [PostgreSQL:5433]
```

При каждом запросе к `/promo-codes/*`:
1. API Gateway принимает HTTP запрос
2. Отправляет сообщение в RabbitMQ
3. PromoCode Service обрабатывает сообщение
4. Возвращает ответ через RabbitMQ
5. API Gateway возвращает HTTP ответ клиенту

---

## 🎯 Следующие шаги

1. Изучите `MICROSERVICES.md` - полная документация
2. Изучите `ARCHITECTURE.md` - архитектурные диаграммы
3. Выделите другие микросервисы по аналогии с PromoCode Service
4. Настройте Event-Driven коммуникацию между сервисами

---

## 📝 Полезные команды

```bash
# Остановить все
docker-compose down

# Запустить все заново
docker-compose up -d
npm run start:promo:dev     # Терминал 1
npm run start:dev           # Терминал 2

# Посмотреть логи
docker-compose logs -f

# Очистить все и начать заново
docker-compose down -v
docker-compose up -d
npm run build
```
