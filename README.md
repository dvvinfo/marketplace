# Marketplace Project

Full-stack marketplace application with microservices backend and Nuxt.js frontend.

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

- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - 🚀 Start here! Complete setup guide
- **[MODES.md](./MODES.md)** - 🔥 Development modes comparison (Dev/Prod/Hybrid)
- **[DOCKER.md](./DOCKER.md)** - Docker setup and troubleshooting
- **[backend/README.md](./backend/README.md)** - Backend microservices documentation
- **[backend/QUICK-START.md](./backend/QUICK-START.md)** - Backend quick start guide

## Project Structure

```
.
├── backend/          # NestJS microservices
├── frontend/         # Nuxt.js application
├── docker-compose.yml
├── DOCKER.md         # Docker guide
└── START-ALL.*       # Startup scripts
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
npm run dev
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
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=production
```

### Backend

See `backend/.env` for backend configuration.
