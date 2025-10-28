# Marketplace Project

Full-stack marketplace application with microservices backend and Nuxt.js frontend.

## 🎉 What's New

**Frontend is ready!** 
- ✅ Nuxt 3 frontend with TypeScript
- ✅ Auto-generated types from Swagger
- ✅ Authentication & Shopping Cart
- ✅ Detailed documentation
- ✅ Micro frontends FAQ (and why you don't need them)

**Quick links:**
- 🇷🇺 [КРАТКОЕ-РЕЗЮМЕ.md](./КРАТКОЕ-РЕЗЮМЕ.md) - Краткое резюме (на русском)
- 🇷🇺 [ОТВЕТЫ-НА-ВОПРОСЫ.md](./ОТВЕТЫ-НА-ВОПРОСЫ.md) - Подробные ответы на ваши вопросы (на русском)
- 🇷🇺 [РЕЖИМЫ-РАБОТЫ.md](./РЕЖИМЫ-РАБОТЫ.md) - Все режимы работы (Development/Production/Local)
- 📋 [WHAT-WAS-DONE.md](./WHAT-WAS-DONE.md) - Complete summary of what was done
- ⚡ [QUICK-CHECKLIST.md](./QUICK-CHECKLIST.md) - Quick start in 5 minutes

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development - optional)

### 🔥 Development Mode (Recommended)

**With Hot-Reload in Docker:**
```bash
# Windows
START-DEV.bat

# Linux/Mac
./START-DEV.sh
```

Features:
- ✅ Hot-reload for all services
- ✅ Edit code and see changes instantly
- ✅ No local Node.js setup needed

### 🚀 Production Mode

**Everything in Containers:**
```bash
# Windows
START-ALL.bat

# Linux/Mac
./START-ALL.sh
```

Features:
- ✅ Production builds
- ✅ Optimized performance

### 💻 Hybrid Mode

**Infrastructure in Docker, Code Locally:**

```bash
# Start infrastructure
START-INFRA.bat  # or ./START-INFRA.sh

# Run backend locally
cd backend && npm install && START-ALL.bat

# Run frontend locally
cd frontend && npm install && npm run dev
```

Features:
- ✅ Hot-reload
- ✅ Easy debugging

### Available Services

After starting, the following services will be available:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001
- **Swagger API Docs**: http://localhost:3001/api-docs
- **PostgreSQL**: localhost:5433
- **PgAdmin**: http://localhost:5050 (marketplace@admin.com / marketplace)
- **RabbitMQ Management**: http://localhost:15672 (marketplace / marketplace)
- **RabbitMQ AMQP**: localhost:5672

**Backend Microservices** (internal, communicate via RabbitMQ):
- Product Service
- Order Service
- User Service
- PromoCode Service
- Review Service

### Stop Everything

**Windows:**
```bash
STOP-ALL.bat
```

**Linux/Mac:**
```bash
./STOP-ALL.sh
```

### View Logs

```bash
docker-compose logs -f
```

View specific service logs:
```bash
docker-compose logs -f marketplace_frontend
```

## Documentation

### 📖 Main Guides
- **[QUICK-CHECKLIST.md](./QUICK-CHECKLIST.md)** - ⚡ Quick start checklist (5 minutes)
- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - 🚀 Complete setup guide
- **[MODES.md](./MODES.md)** - 🔥 Development modes comparison (Dev/Prod/Hybrid)
- **[DOCKER.md](./DOCKER.md)** - 🐳 Docker setup and troubleshooting
- **[COMMANDS.md](./COMMANDS.md)** - 📝 Command cheat sheet

### 🎨 Frontend
- **[FRONTEND-SETUP.md](./FRONTEND-SETUP.md)** - Frontend setup and development guide
- **[FRONTEND-SUMMARY.md](./FRONTEND-SUMMARY.md)** - Quick summary of frontend architecture
- **[MICROFRONTENDS-FAQ.md](./MICROFRONTENDS-FAQ.md)** - Micro frontends explained (and why you don't need them)
- **[frontend/README.md](./frontend/README.md)** - Detailed frontend documentation
- **[frontend/SWAGGER-TYPES.md](./frontend/SWAGGER-TYPES.md)** - TypeScript types generation

### ⚙️ Backend
- **[backend/README.md](./backend/README.md)** - Backend microservices documentation
- **[backend/QUICK-START.md](./backend/QUICK-START.md)** - Backend quick start guide

### 🏗️ Architecture
- **[PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)** - Complete project structure overview
- **[ARCHITECTURE-VISUAL.md](./ARCHITECTURE-VISUAL.md)** - Visual architecture diagrams and data flow

## Project Structure

```
.
├── backend/                    # NestJS microservices
│   ├── apps/
│   │   ├── api-gateway/       # HTTP REST API + Swagger
│   │   ├── product-service/   # Products & Categories
│   │   ├── order-service/     # Orders & Cart
│   │   ├── user-service/      # Users & Auth
│   │   ├── promo-service/     # Promo Codes
│   │   └── review-service/    # Reviews & Ratings
│   └── libs/shared/           # Shared libraries
├── frontend/                   # Nuxt 3 application
│   ├── app/                   # Main app component
│   ├── components/            # Vue components
│   ├── composables/           # Composables (useApi, useAuth)
│   ├── middleware/            # Route middleware
│   ├── pages/                 # Pages (auto-routing)
│   ├── stores/                # Pinia stores
│   └── types/                 # TypeScript types (auto-generated from Swagger)
├── docker-compose.yml         # Production Docker setup
├── docker-compose.dev.yml     # Development Docker setup
├── START-ALL.*                # Start everything (production)
├── START-DEV.*                # Start everything (development with hot-reload)
├── START-FRONTEND.*           # Start frontend only
└── FRONTEND-SETUP.md          # Frontend setup guide
```

## Development

### Local Development (without Docker)

**Backend:**
```bash
cd backend
npm install

# Start infrastructure only
docker-compose up -d

# Start all microservices locally
START-ALL.bat  # or START-ALL.sh on Linux/Mac
```

**Frontend:**
```bash
cd frontend
npm install

# Generate TypeScript types from Swagger (backend must be running!)
npm run generate:api

# Start dev server
npm run dev
```

Or use the quick start script:
```bash
# Windows
START-FRONTEND.bat

# Linux/Mac
./START-FRONTEND.sh
```

### Docker Development

Everything runs in containers:
```bash
# From project root
START-ALL.bat  # or START-ALL.sh
```

### Configuration Files

- `backend/.env` - for local development (connects to localhost:5433, localhost:5672)
- `backend/.env.docker` - for Docker (connects to container names)
- `frontend/.env` - frontend configuration (optional)

## Environment Variables

### Frontend

Copy `frontend/.env.example` to `frontend/.env` and adjust as needed:

```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001

# App Configuration
NUXT_PUBLIC_APP_NAME=Marketplace
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend

See `backend/.env` for backend configuration.

## 🎨 Frontend Features

- ✅ **Nuxt 3** - Modern Vue.js framework
- ✅ **TypeScript** - Full type safety
- ✅ **Auto-generated types** from Swagger API
- ✅ **Nuxt UI** - Beautiful UI components
- ✅ **Pinia** - State management
- ✅ **Authentication** - JWT-based auth
- ✅ **Shopping Cart** - Full cart functionality
- ✅ **Responsive Design** - Mobile-friendly

### Frontend Pages

- `/` - Home page with products
- `/login` - User login
- `/register` - User registration
- `/cart` - Shopping cart
- `/products` - Product catalog (TODO)
- `/products/[id]` - Product details (TODO)
- `/checkout` - Checkout process (TODO)
- `/orders` - Order history (TODO)
- `/profile` - User profile (TODO)
- `/admin` - Admin panel (TODO)

## 🤔 Микрофронтенды (Micro Frontends)?

**Не рекомендуется** для этого проекта, потому что:

❌ **Не нужно:**
- Команда небольшая
- Единый стек технологий (Vue/Nuxt)
- Проще разрабатывать монолит
- Бэкенд уже микросервисный

✅ **Что используем вместо этого:**
- Модульная структура Nuxt
- Composables для переиспользования логики
- Pinia stores для состояния
- Компоненты для UI

**Когда стоит использовать микрофронтенды:**
- Большая команда (10+ разработчиков)
- Разные команды работают над разными модулями
- Нужны независимые релизы модулей
- Разные части используют разные фреймворки (React + Vue + Angular)
