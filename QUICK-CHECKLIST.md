# ✅ Быстрый чеклист запуска

## 🚀 Первый запуск (5 минут)

### Шаг 1: Клонирование и установка

```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd marketplace

# Установить зависимости
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Шаг 2: Запуск инфраструктуры

```bash
# Windows
START-INFRA.bat

# Linux/Mac
./START-INFRA.sh
```

**Проверка:**
- [ ] PostgreSQL доступен на http://localhost:5050
- [ ] RabbitMQ доступен на http://localhost:15672

### Шаг 3: Запуск бэкенда

```bash
# Windows
cd backend
START-ALL.bat

# Linux/Mac
cd backend
./START-ALL.sh
```

**Проверка:**
- [ ] API Gateway на http://localhost:3001
- [ ] Swagger на http://localhost:3001/api-docs

### Шаг 4: Запуск фронтенда

```bash
# Windows
START-FRONTEND.bat

# Linux/Mac
./START-FRONTEND.sh
```

**Проверка:**
- [ ] Frontend на http://localhost:3000
- [ ] Типы сгенерированы в `frontend/types/api.d.ts`

### Шаг 5: Тестирование

1. Откройте http://localhost:3000
2. Зарегистрируйтесь
3. Добавьте товар в корзину
4. Проверьте корзину

**Готово!** 🎉

---

## 🔥 Development режим (Docker)

### Один скрипт для всего

```bash
# Windows
START-DEV.bat

# Linux/Mac
./START-DEV.sh
```

**Что запускается:**
- ✅ PostgreSQL
- ✅ RabbitMQ
- ✅ PgAdmin
- ✅ Все микросервисы (с hot-reload)
- ✅ Frontend (с hot-reload)

**Проверка:**
- [ ] Frontend: http://localhost:3000
- [ ] Backend: http://localhost:3001
- [ ] Swagger: http://localhost:3001/api-docs
- [ ] PgAdmin: http://localhost:5050
- [ ] RabbitMQ: http://localhost:15672

---

## 📝 Ежедневная разработка

### Утро (запуск)

```bash
# Вариант 1: Все в Docker (рекомендуется)
START-DEV.bat

# Вариант 2: Локально
START-INFRA.bat
cd backend && START-ALL.bat
cd frontend && npm run dev
```

### Работа

```bash
# Генерация типов после изменений API
cd frontend
npm run generate:api

# Просмотр логов
docker-compose logs -f

# Перезапуск сервиса
docker-compose restart marketplace_frontend
```

### Вечер (остановка)

```bash
# Windows
STOP-ALL.bat

# Linux/Mac
./STOP-ALL.sh
```

---

## 🐛 Troubleshooting

### Проблема: Порт занят

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Проблема: Docker не запускается

```bash
# Перезапустить Docker Desktop
# Очистить все
docker system prune -a --volumes

# Пересоздать контейнеры
docker-compose down -v
docker-compose up --build
```

### Проблема: Типы не генерируются

```bash
# Проверить что бэкенд запущен
curl http://localhost:3001/api-docs-json

# Удалить старые типы
rm frontend/types/api.d.ts

# Регенерировать
cd frontend
npm run generate:api
```

### Проблема: База данных не подключается

```bash
# Проверить PostgreSQL
docker ps | grep postgres

# Перезапустить
docker-compose restart marketplace_postgres

# Проверить логи
docker-compose logs marketplace_postgres
```

---

## 📊 Проверка работоспособности

### Backend

```bash
# API Gateway
curl http://localhost:3001

# Swagger JSON
curl http://localhost:3001/api-docs-json

# Health check (если есть)
curl http://localhost:3001/health
```

### Frontend

```bash
# Главная страница
curl http://localhost:3000

# Проверка сборки
cd frontend
npm run build
```

### Database

```bash
# Подключение
docker exec -it marketplace_postgres psql -U marketplace -d marketplace

# Проверка таблиц
\dt

# Выход
\q
```

### RabbitMQ

```bash
# Список очередей
docker exec marketplace_rabbitmq rabbitmqctl list_queues

# Management UI
open http://localhost:15672
```

---

## 🎯 Следующие шаги

### После первого запуска

- [ ] Изучить [FRONTEND-SETUP.md](./FRONTEND-SETUP.md)
- [ ] Прочитать [MICROFRONTENDS-FAQ.md](./MICROFRONTENDS-FAQ.md)
- [ ] Посмотреть [COMMANDS.md](./COMMANDS.md)
- [ ] Изучить структуру проекта

### Разработка

- [ ] Создать страницу каталога (`/products`)
- [ ] Создать страницу товара (`/products/[id]`)
- [ ] Добавить поиск
- [ ] Добавить фильтры
- [ ] Создать страницу оформления заказа

### Улучшения

- [ ] Добавить валидацию форм (Zod)
- [ ] Добавить обработку ошибок
- [ ] Добавить загрузочные состояния
- [ ] Оптимизировать изображения
- [ ] Добавить тесты

---

## 📚 Полезные команды

```bash
# Запуск
START-DEV.bat              # Development режим
START-ALL.bat              # Production режим
START-FRONTEND.bat         # Только фронтенд

# Остановка
STOP-ALL.bat               # Остановить все
STOP-DEV.bat               # Остановить dev режим

# Логи
docker-compose logs -f                          # Все сервисы
docker-compose logs -f marketplace_frontend     # Фронтенд
docker-compose logs -f marketplace_api_gateway  # API Gateway

# Генерация типов
cd frontend
npm run generate:api

# Сборка
cd frontend
npm run build

cd backend
npm run build
```

---

## 🔗 Быстрые ссылки

### Приложение
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger: http://localhost:3001/api-docs

### Инфраструктура
- PgAdmin: http://localhost:5050 (marketplace@admin.com / marketplace)
- RabbitMQ: http://localhost:15672 (marketplace / marketplace)
- PostgreSQL: localhost:5433

### Документация
- [README.md](./README.md) - Главная
- [GETTING-STARTED.md](./GETTING-STARTED.md) - Полное руководство
- [FRONTEND-SETUP.md](./FRONTEND-SETUP.md) - Настройка фронтенда
- [COMMANDS.md](./COMMANDS.md) - Шпаргалка команд

---

## ✨ Советы

1. **Используйте Docker** для разработки - проще и быстрее
2. **Генерируйте типы** после каждого изменения API
3. **Проверяйте Swagger** перед началом работы
4. **Используйте hot-reload** для быстрой разработки
5. **Читайте логи** при возникновении проблем

---

**Готово к разработке!** 🚀

Если возникли проблемы - проверьте [DOCKER.md](./DOCKER.md) или [GETTING-STARTED.md](./GETTING-STARTED.md)
