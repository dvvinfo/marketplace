# Getting Started with Marketplace

## What You Have

A full-stack e-commerce marketplace with:

- **Backend**: 6 NestJS microservices (API Gateway + 5 services)
- **Frontend**: Nuxt.js application
- **Infrastructure**: PostgreSQL, RabbitMQ, PgAdmin

## Choose Your Setup

### 🔥 Development Mode (Docker with Hot-Reload) - RECOMMENDED

Best for: Active development with automatic code reload

```bash
# Windows
START-DEV.bat

# Linux/Mac
./START-DEV.sh
```

**Features:**

- ✅ Hot-reload for backend (all microservices)
- ✅ Hot-reload for frontend
- ✅ All in Docker - no local Node.js needed
- ✅ Just edit code and see changes instantly!

**Access:**

- Frontend: http://localhost:3000 (auto-reload)
- API Docs: http://localhost:3001/api-docs (auto-reload)
- RabbitMQ: http://localhost:15672 (marketplace/marketplace)
- PgAdmin: http://localhost:5050 (marketplace@admin.com/marketplace)

**Stop:**

```bash
# Windows
STOP-DEV.bat

# Linux/Mac
./STOP-DEV.sh
```

---

### 🚀 Production Mode (Full Docker)

Best for: Testing, production-like environment

```bash
# Windows
START-ALL.bat

# Linux/Mac
./START-ALL.sh
```

**Features:**

- ✅ Production builds
- ✅ Optimized performance
- ❌ No hot-reload (need rebuild after changes)

**Access:**

- Frontend: http://localhost:3000
- API Docs: http://localhost:3001/api-docs
- RabbitMQ: http://localhost:15672 (marketplace/marketplace)
- PgAdmin: http://localhost:5050 (marketplace@admin.com/marketplace)

**Stop:**

```bash
# Windows
STOP-ALL.bat

# Linux/Mac
./STOP-ALL.sh
```

---

### 💻 Hybrid Setup (Infrastructure in Docker, Code Locally)

Best for: When you prefer running code outside Docker

**Step 1: Start Infrastructure**

```bash
# Windows
START-INFRA.bat

# Linux/Mac
./START-INFRA.sh
```

**Step 2: Start Backend**

```bash
cd backend
npm install
START-ALL.bat  # or ./START-ALL.sh on Linux/Mac
```

**Step 3: Start Frontend**

```bash
cd frontend
npm install
npm run dev
```

**Access:**

- Frontend: http://localhost:3000
- API Docs: http://localhost:3000/api-docs
- RabbitMQ: http://localhost:15672
- PgAdmin: http://localhost:5050

---

## Project Structure

```
marketplace/
├── backend/                    # NestJS microservices
│   ├── apps/
│   │   ├── api-gateway/       # HTTP REST API (port 3001)
│   │   ├── product-service/   # Product management
│   │   ├── order-service/     # Orders and cart
│   │   ├── user-service/      # Users and auth
│   │   ├── promo-service/     # Promo codes
│   │   └── review-service/    # Reviews and ratings
│   ├── .env                   # Local development config
│   ├── .env.docker            # Docker config
│   └── docker-compose.yml     # Backend infrastructure only
│
├── frontend/                   # Nuxt.js application
│   ├── app/
│   ├── pages/
│   ├── components/
│   └── Dockerfile
│
├── docker-compose.yml          # Full stack (all services)
├── docker-compose.dev.yml      # Infrastructure only
├── START-ALL.*                 # Start everything in Docker
├── START-INFRA.*               # Start infrastructure only
├── STOP-ALL.*                  # Stop all Docker services
├── README.md                   # Main documentation
├── DOCKER.md                   # Docker guide
└── GETTING-STARTED.md          # This file
```

## Common Commands

### Docker Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f marketplace_api_gateway
docker-compose logs -f marketplace_frontend

# Check status
docker-compose ps

# Restart service
docker-compose restart marketplace_api_gateway

# Rebuild after code changes
docker-compose up -d --build marketplace_frontend

# Stop everything
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Backend Commands (Local Development)

```bash
cd backend

# Install dependencies
npm install

# Start all microservices
START-ALL.bat  # Windows
./START-ALL.sh # Linux/Mac

# Start individual service
npm run start:product:dev
npm run start:order:dev
npm run start:user:dev
npm run start:promo:dev
npm run start:review:dev
npm run start:dev  # API Gateway

# Build
npm run build

# Run tests
npm test
```

### Frontend Commands (Local Development)

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Backend Environment Variables

**Local Development** (`backend/.env`):

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
RABBITMQ_HOST=127.0.0.1
```

**Docker** (`backend/.env.docker`):

```env
POSTGRES_HOST=marketplace_postgres
POSTGRES_PORT=5432
RABBITMQ_HOST=marketplace_rabbitmq
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Troubleshooting

### Services won't start

```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Clean restart
docker-compose down -v
docker-compose up -d --build
```

### Port already in use

```bash
# Check what's using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Change port in docker-compose.yml
ports:
  - 127.0.0.1:3001:3000  # Change 3001 to another port
```

### Database connection failed

```bash
# Restart PostgreSQL
docker-compose restart marketplace_postgres

# Check PostgreSQL logs
docker-compose logs marketplace_postgres

# Test connection
docker exec -it marketplace_postgres psql -U marketplace -d marketplace -c "SELECT 1;"
```

### RabbitMQ connection failed

```bash
# Restart RabbitMQ
docker-compose restart marketplace_rabbitmq

# Check RabbitMQ logs
docker-compose logs marketplace_rabbitmq

# Access management UI
# http://localhost:15672 (marketplace/marketplace)
```

### Frontend can't connect to backend

```bash
# Check API Gateway is running
curl http://localhost:3001/api-docs

# Check frontend environment
cat frontend/.env

# Restart frontend
docker-compose restart marketplace_frontend
```

## Next Steps

1. **Explore the API**: http://localhost:3001/api-docs
2. **Read the docs**:
   - [README.md](./README.md) - Overview
   - [DOCKER.md](./DOCKER.md) - Docker details
   - [backend/README.md](./backend/README.md) - Backend docs
3. **Start developing**: Make changes and see them live!

## Need Help?

- Check [DOCKER.md](./DOCKER.md) for detailed Docker troubleshooting
- Check [backend/README.md](./backend/README.md) for backend architecture
- View logs: `docker-compose logs -f`
- Check service status: `docker-compose ps`

## Quick Reference

| What                      | Command                                          |
| ------------------------- | ------------------------------------------------ |
| Start everything (Docker) | `START-ALL.bat` or `./START-ALL.sh`              |
| Start infrastructure only | `START-INFRA.bat` or `./START-INFRA.sh`          |
| Stop everything           | `STOP-ALL.bat` or `./STOP-ALL.sh`                |
| View logs                 | `docker-compose logs -f`                         |
| Rebuild                   | `docker-compose up -d --build`                   |
| Clean restart             | `docker-compose down -v && docker-compose up -d` |

---

Happy coding! 🚀
