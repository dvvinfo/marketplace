# 🚀 Быстрый старт - Микросервисы

## Запуск (одна команда)

Двойной клик на: **START-ALL.bat**

Или в терминале:
```bash
# PowerShell/CMD
START-ALL.bat

# Или вручную в 2 окнах:
# Окно 1: npm run start:promo:dev
# Окно 2: npm run start:dev
```

---

## Проверка статуса

```powershell
.\check-status.ps1
```

Должно показать:
```
1. PromoCode Service: STATUS: CONNECTED ✅
2. API Gateway: STATUS: RUNNING ✅
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

- **MICROSERVICES.md** - полная документация
- **ARCHITECTURE.md** - архитектурные диаграммы
- **START.md** - детальные инструкции

---

## Команды NPM

```bash
# Запуск
npm run start:promo:dev    # PromoCode Service
npm run start:dev           # API Gateway

# Сборка
npm run build:promo         # PromoCode Service
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
