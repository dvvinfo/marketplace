# 🚀 Шпаргалка по командам

## Быстрый старт

### Запуск всего проекта

```bash
# Windows
START-DEV.bat          # Development с hot-reload
START-ALL.bat          # Production режим
START-INFRA.bat        # Только инфраструктура (DB, RabbitMQ)

# Linux/Mac
./START-DEV.sh         # Development с hot-reload
./START-ALL.sh         # Production режим
./START-INFRA.sh       # Только инфраструктура
```

### Остановка

```bash
# Windows
STOP-ALL.bat
STOP-DEV.bat

# Linux/Mac
./STOP-ALL.sh
./STOP-DEV.sh
```

## Backend

### Запуск микросервисов (локально)

```bash
cd backend

# Все сервисы
npm run start:dev              # API Gateway
npm run start:product:dev      # Product Service
npm run start:order:dev        # Order Service
npm run start:user:dev         # User Service
npm run start:promo:dev        # PromoCode Service
npm run start:review:dev       # Review Service

# Или используйте скрипты
START-ALL.bat                  # Windows
./START-ALL.sh                 # Linux/Mac
```

### Сборка

```bash
cd backend

npm run build                  # Все сервисы
npm run build:gateway          # API Gateway
npm run build:product          # Product Service
npm run build:order            # Order Service
npm run build:user             # User Service
npm run build:promo            # PromoCode Service
npm run build:review           # Review Service
```

### Тесты

```bash
cd backend

npm test                       # Все тесты
npm run test:watch             # Watch режим
npm run test:cov               # С покрытием
```

## Frontend

### Запуск

```bash
cd frontend

# Установка зависимостей
npm install

# Генерация типов из Swagger (бэкенд должен быть запущен!)
npm run generate:api

# Запуск dev сервера
npm run dev

# Или используйте скрипт
cd ..
START-FRONTEND.bat             # Windows
./START-FRONTEND.sh            # Linux/Mac
```

### Сборка

```bash
cd frontend

npm run build                  # Production сборка
npm run preview                # Предпросмотр production сборки
npm run generate               # Статическая генерация
```

### Генерация типов

```bash
cd frontend

# Из Swagger (бэкенд должен быть запущен на :3001)
npm run generate:api
```

## Docker

### Запуск

```bash
# Development режим (с hot-reload)
docker-compose -f docker-compose.dev.yml up

# Production режим
docker-compose up

# В фоновом режиме
docker-compose up -d

# Только инфраструктура
docker-compose up marketplace_postgres marketplace_rabbitmq marketplace_pgadmin
```

### Остановка

```bash
# Остановить все контейнеры
docker-compose down

# Остановить и удалить volumes
docker-compose down -v

# Остановить dev режим
docker-compose -f docker-compose.dev.yml down
```

### Логи

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f marketplace_frontend
docker-compose logs -f marketplace_api_gateway
docker-compose logs -f marketplace_product_service

# Последние 100 строк
docker-compose logs --tail=100 marketplace_frontend
```

### Перезапуск

```bash
# Перезапустить все
docker-compose restart

# Перезапустить конкретный сервис
docker-compose restart marketplace_frontend
docker-compose restart marketplace_api_gateway
```

### Пересборка

```bash
# Пересобрать все образы
docker-compose build

# Пересобрать конкретный сервис
docker-compose build marketplace_frontend
docker-compose build marketplace_api_gateway

# Пересобрать и запустить
docker-compose up --build
```

### Очистка

```bash
# Удалить все контейнеры
docker-compose down

# Удалить контейнеры и volumes
docker-compose down -v

# Удалить неиспользуемые образы
docker image prune -a

# Полная очистка Docker
docker system prune -a --volumes
```

## База данных

### Подключение к PostgreSQL

```bash
# Через Docker
docker exec -it marketplace_postgres psql -U marketplace -d marketplace

# Локально (если установлен psql)
psql -h localhost -p 5433 -U marketplace -d marketplace
```

### Бэкап

```bash
# Создать бэкап
docker exec marketplace_postgres pg_dump -U marketplace marketplace > backup.sql

# Восстановить из бэкапа
docker exec -i marketplace_postgres psql -U marketplace marketplace < backup.sql
```

### Очистка базы

```bash
# Удалить все данные
docker-compose down -v
docker-compose up -d marketplace_postgres
```

## RabbitMQ

### Management UI

Откройте http://localhost:15672
- Username: `marketplace`
- Password: `marketplace`

### Проверка очередей

```bash
# Список очередей
docker exec marketplace_rabbitmq rabbitmqctl list_queues

# Список подключений
docker exec marketplace_rabbitmq rabbitmqctl list_connections

# Список каналов
docker exec marketplace_rabbitmq rabbitmqctl list_channels
```

## Полезные команды

### Проверка портов

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5433

# Linux/Mac
lsof -i :3000
lsof -i :3001
lsof -i :5433
```

### Проверка доступности сервисов

```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:3001

# Swagger
curl http://localhost:3001/api-docs-json

# PostgreSQL
docker exec marketplace_postgres pg_isready -U marketplace

# RabbitMQ
curl http://localhost:15672/api/overview -u marketplace:marketplace
```

### Git

```bash
# Статус
git status

# Коммит
git add .
git commit -m "feat: add new feature"

# Пуш
git push origin main

# Пулл
git pull origin main
```

## Troubleshooting

### Порт занят

```bash
# Windows - убить процесс на порту 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Docker проблемы

```bash
# Перезапустить Docker Desktop
# Windows: Restart Docker Desktop

# Очистить все
docker system prune -a --volumes

# Пересоздать контейнеры
docker-compose down -v
docker-compose up --build
```

### Node modules проблемы

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### База данных не подключается

```bash
# Проверить что PostgreSQL запущен
docker ps | grep postgres

# Перезапустить PostgreSQL
docker-compose restart marketplace_postgres

# Проверить логи
docker-compose logs marketplace_postgres
```

## Быстрые ссылки

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger**: http://localhost:3001/api-docs
- **PgAdmin**: http://localhost:5050
- **RabbitMQ**: http://localhost:15672

## Документация

- [GETTING-STARTED.md](./GETTING-STARTED.md) - Полное руководство
- [MODES.md](./MODES.md) - Режимы разработки
- [DOCKER.md](./DOCKER.md) - Docker инструкции
- [FRONTEND-SETUP.md](./FRONTEND-SETUP.md) - Настройка фронтенда
- [backend/README.md](./backend/README.md) - Backend документация
- [frontend/README.md](./frontend/README.md) - Frontend документация
- [frontend/SWAGGER-TYPES.md](./frontend/SWAGGER-TYPES.md) - Генерация типов

---

**Совет:** Добавьте этот файл в закладки для быстрого доступа к командам!
