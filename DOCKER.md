# Docker Setup Guide

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Docker Network                       │
│                                                              │
│  ┌──────────────┐      ┌─────────────────────────────────┐ │
│  │   Frontend   │─────▶│       API Gateway               │ │
│  │  (Nuxt.js)   │      │       (port 3001)               │ │
│  │  port 3000   │      └─────────────────────────────────┘ │
│  └──────────────┘                     │                     │
│                                       │                     │
│                                       ▼                     │
│                              ┌─────────────┐                │
│                              │  RabbitMQ   │                │
│                              │  (AMQP)     │                │
│                              └─────────────┘                │
│                                     │                       │
│                    ┌────────────────┼────────────────┐      │
│                    ▼                ▼                ▼      │
│           ┌────────────┐   ┌────────────┐  ┌────────────┐  │
│           │  Product   │   │   Order    │  │    User    │  │
│           │  Service   │   │  Service   │  │  Service   │  │
│           └────────────┘   └────────────┘  └────────────┘  │
│                    ▼                ▼                ▼      │
│           ┌────────────┐   ┌────────────┐                  │
│           │   Promo    │   │   Review   │                  │
│           │  Service   │   │  Service   │                  │
│           └────────────┘   └────────────┘                  │
│                                     │                       │
│                                     ▼                       │
│                              ┌─────────────┐                │
│                              │ PostgreSQL  │                │
│                              │  port 5432  │                │
│                              └─────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Services

### Infrastructure

- **PostgreSQL** - Database (exposed on localhost:5433)
- **RabbitMQ** - Message broker (AMQP: 5672, Management: 15672)
- **PgAdmin** - Database management UI (port 5050)

### Backend Microservices

All microservices use the same Docker image but run different commands:

- **API Gateway** - HTTP REST API (port 3001)
- **Product Service** - Product management
- **Order Service** - Order and cart management
- **User Service** - User authentication and profiles
- **PromoCode Service** - Discount codes
- **Review Service** - Product reviews and ratings

### Frontend

- **Nuxt.js** - Frontend application (port 3000)

## Container Names

All containers in the project:

| Service           | Container Name                | Ports       |
| ----------------- | ----------------------------- | ----------- |
| Frontend          | `marketplace_frontend`        | 3000        |
| API Gateway       | `marketplace_api_gateway`     | 3001        |
| Product Service   | `marketplace_product_service` | -           |
| Order Service     | `marketplace_order_service`   | -           |
| User Service      | `marketplace_user_service`    | -           |
| PromoCode Service | `marketplace_promo_service`   | -           |
| Review Service    | `marketplace_review_service`  | -           |
| PostgreSQL        | `marketplace_postgres`        | 5433        |
| RabbitMQ          | `marketplace_rabbitmq`        | 5672, 15672 |
| PgAdmin           | `marketplace_pgadmin`         | 5050        |

**Usage examples:**

```bash
# View logs
docker-compose logs marketplace_frontend
docker-compose logs marketplace_api_gateway
docker-compose logs marketplace_product_service

# Restart service
docker-compose restart marketplace_frontend
docker-compose restart marketplace_api_gateway

# Rebuild service
docker-compose up -d --build marketplace_frontend

# Execute command in container
docker exec -it marketplace_frontend sh
docker exec -it marketplace_postgres psql -U marketplace
```

## Quick Commands

### 🔥 Development Mode (with Hot-Reload) - RECOMMENDED

```bash
# Start
START-DEV.bat      # Windows
./START-DEV.sh     # Linux/Mac

# Stop
STOP-DEV.bat       # Windows
./STOP-DEV.sh      # Linux/Mac

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

**Features:**

- ✅ Hot-reload enabled
- ✅ Changes in code automatically reload services
- ✅ Faster development workflow

### 🚀 Production Mode

```bash
# Start
START-ALL.bat      # Windows
./START-ALL.sh     # Linux/Mac

# Stop
STOP-ALL.bat       # Windows
./STOP-ALL.sh      # Linux/Mac

# View logs
docker-compose logs -f
```

**Features:**

- ✅ Production builds
- ✅ Optimized performance
- ❌ No hot-reload

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f marketplace_api_gateway
docker-compose logs -f marketplace_frontend
docker-compose logs -f marketplace_product_service
```

### Rebuild Services

```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build marketplace_api_gateway
docker-compose up -d --build marketplace_frontend
```

### Check Status

```bash
docker-compose ps
```

### Restart Service

```bash
docker-compose restart marketplace_api_gateway
docker-compose restart marketplace_frontend
```

## Environment Variables

### Backend (.env.docker)

Used by all backend microservices in Docker:

```env
POSTGRES_HOST=marketplace_postgres
POSTGRES_PORT=5432
POSTGRES_USERNAME=marketplace
POSTGRES_PASSWORD=marketplace
POSTGRES_DATABASE=marketplace

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

RABBITMQ_HOST=marketplace_rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=marketplace
RABBITMQ_PASSWORD=marketplace
RABBITMQ_VHOST=marketplace_vhost
```

### Frontend

Environment variables are set in docker-compose.yml:

```yaml
environment:
  - NODE_ENV=production
  - NUXT_PUBLIC_API_BASE_URL=http://marketplace_api_gateway:3001
```

## Networking

All services are on the `marketplace` Docker network:

- Services communicate using container names (e.g., `marketplace_postgres`)
- Only frontend (3000) and API Gateway (3001) are exposed to host
- Database and RabbitMQ management UIs are also exposed for debugging

## Volumes

### Persistent Data

- `postgres` - PostgreSQL data
- `pgadmin` - PgAdmin configuration
- `rabbitmq` - RabbitMQ data

### Bind Mounts

- `./backend/uploads:/app/uploads` - Product images (Product Service)

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Remove all containers and start fresh
docker-compose down
docker-compose up -d --build
```

### Database connection issues

```bash
# Check if PostgreSQL is running
docker-compose ps marketplace_postgres

# Test connection
docker exec -it marketplace_postgres psql -U marketplace -d marketplace -c "SELECT 1;"

# Restart PostgreSQL
docker-compose restart marketplace_postgres
```

### RabbitMQ connection issues

```bash
# Check RabbitMQ status
docker-compose ps marketplace_rabbitmq

# View RabbitMQ logs
docker-compose logs marketplace_rabbitmq

# Access management UI
# http://localhost:15672 (marketplace/marketplace)

# Restart RabbitMQ
docker-compose restart marketplace_rabbitmq
```

### Frontend can't connect to backend

```bash
# Check API Gateway logs
docker-compose logs marketplace_api_gateway

# Verify API Gateway is running
docker-compose ps marketplace_api_gateway

# Test API from host
curl http://localhost:3001/api-docs
```

### Rebuild after code changes

```bash
# Backend changes
docker-compose up -d --build marketplace_api_gateway
docker-compose up -d --build marketplace_product_service
# ... other services

# Frontend changes
docker-compose up -d --build marketplace_frontend
```

## Development Workflow

### Option 1: Full Docker (Recommended for Production-like Testing)

```bash
START-ALL.bat
# All services run in Docker
# Make code changes and rebuild specific services
```

### Option 2: Hybrid (Recommended for Development)

```bash
# Start only infrastructure
cd backend
docker-compose up -d

# Run backend services locally
cd backend
START-ALL.bat

# Run frontend locally
cd frontend
npm run dev
```

This gives you:

- Fast hot-reload for development
- Easy debugging
- Production-like infrastructure (PostgreSQL, RabbitMQ)

## Ports Reference

| Service             | Internal Port | External Port | URL                            |
| ------------------- | ------------- | ------------- | ------------------------------ |
| Frontend            | 3000          | 3000          | http://localhost:3000          |
| API Gateway         | 3001          | 3001          | http://localhost:3001          |
| Swagger Docs        | 3001          | 3001          | http://localhost:3001/api-docs |
| PostgreSQL          | 5432          | 5433          | localhost:5433                 |
| PgAdmin             | 80            | 5050          | http://localhost:5050          |
| RabbitMQ AMQP       | 5672          | 5672          | localhost:5672                 |
| RabbitMQ Management | 15672         | 15672         | http://localhost:15672         |

## Clean Up

### Remove all containers and volumes

```bash
docker-compose down -v
```

### Remove all images

```bash
docker-compose down --rmi all
```

### Complete cleanup

```bash
docker-compose down -v --rmi all
docker system prune -a
```
