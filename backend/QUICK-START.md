# 🚀 Быстрый старт - Микросервисы

## Запуск (одна команда)

**Windows:**

```bash
START-ALL.bat
```

**Linux/Mac:**

```bash
chmod +x START-ALL.sh
./START-ALL.sh
```

Это запустит все 5 микросервисов + API Gateway в отдельных окнах.

---

## Проверка статуса

```powershell
.\check-status.ps1
```

Должно показать:

```
1. Product Service: STATUS: CONNECTED ✅
2. Order Service: STATUS: CONNECTED ✅
3. User Service: STATUS: CONNECTED ✅
4. PromoCode Service: STATUS: CONNECTED ✅
5. Review Service: STATUS: CONNECTED ✅
6. API Gateway: STATUS: RUNNING ✅
```

---

## Тестирование

```powershell
.\test-api.ps1
```

Или откройте Swagger: http://localhost:3000/api-docs

---

## Полезные ссылки

- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api-docs
- **RabbitMQ UI:** http://localhost:15672 (marketplace/marketplace)
- **PostgreSQL:** localhost:5433 (marketplace/marketplace)

---

## Подробная документация

- **[docs/README-MICROSERVICES.md](./docs/README-MICROSERVICES.md)** - полная документация по микросервисам
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - архитектурные диаграммы

---

## Команды NPM

```bash
# Запуск микросервисов
npm run start:product:dev   # Product Service
npm run start:order:dev     # Order Service
npm run start:user:dev      # User Service
npm run start:promo:dev     # PromoCode Service
npm run start:review:dev    # Review Service
npm run start:dev           # API Gateway

# Сборка
npm run build:product       # Product Service
npm run build:order         # Order Service
npm run build:user          # User Service
npm run build:promo         # PromoCode Service
npm run build:review        # Review Service
npm run build:gateway       # API Gateway

# Остановка
Ctrl+C в каждом окне
```

---

## Устранение проблем

### Сервисы не запускаются

```bash
docker-compose down
docker-compose up -d
```

### Очистить RabbitMQ

```bash
docker exec marketplace_rabbitmq rabbitmqctl purge_queue promo_code_queue -p marketplace_vhost
```

### Порт занят

```bash
# Найти процесс
netstat -ano | findstr :3000

# Убить процесс
taskkill /PID <PID> /F
```
