# 🛒 E-commerce Marketplace

<p align="center">
  <strong>Microservices-based e-commerce platform built with NestJS, RabbitMQ, and PostgreSQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" alt="RabbitMQ" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📋 Description

E-commerce Marketplace built with microservices architecture using NestJS, RabbitMQ, and PostgreSQL. The system consists of 5 independent microservices communicating through message broker, providing scalability, fault tolerance, and independent deployment capabilities.

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start infrastructure (Docker)

```bash
docker-compose up -d
```

This will start:

- PostgreSQL (port 5433)
- RabbitMQ (port 5672, Management UI: 15672)
- pgAdmin (port 5050)

### 3. Start all microservices

**Windows:**

```bash
START-ALL.bat
```

**Linux/Mac:**

```bash
chmod +x START-ALL.sh
./START-ALL.sh
```

**Or manually (6 terminals):**

```bash
npm run start:product:dev   # Product Service
npm run start:order:dev     # Order Service
npm run start:user:dev      # User Service
npm run start:promo:dev     # PromoCode Service
npm run start:review:dev    # Review Service
npm run start:dev           # API Gateway
```

### 4. Open Swagger UI

http://localhost:3000/api-docs

## 🏗️ Microservices

- ✅ **Product Service** - Products, categories, product views
- ✅ **Order Service** - Orders and shopping cart
- ✅ **User Service** - Users, authentication, addresses
- ✅ **PromoCode Service** - Promo codes and discounts
- ✅ **Review Service** - Product reviews and ratings
- ✅ **API Gateway** - HTTP REST API with Swagger

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Message Broker:** RabbitMQ
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **API Documentation:** Swagger/OpenAPI
- **Authentication:** JWT
- **Containerization:** Docker

## 📚 Documentation

- **[QUICK-START.md](./QUICK-START.md)** - Quick start guide (one command)
- **[docs/README-MICROSERVICES.md](./docs/README-MICROSERVICES.md)** - Complete microservices documentation
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Architecture diagrams

### Service-specific documentation

- [docs/services/PRODUCT-SERVICE-README.md](./docs/services/PRODUCT-SERVICE-README.md)
- [docs/services/ORDER-SERVICE-README.md](./docs/services/ORDER-SERVICE-README.md)
- [docs/services/USER-SERVICE-README.md](./docs/services/USER-SERVICE-README.md)
- [docs/services/PROMO-SERVICE-README.md](./docs/services/PROMO-SERVICE-README.md)
- [docs/services/REVIEW-SERVICE-README.md](./docs/services/REVIEW-SERVICE-README.md)

## 🧪 Run tests

**Windows:**

```bash
.\test-product-service.ps1
.\test-order-service.ps1
.\test-user-service.ps1
.\test-promo-service.ps1
.\test-review-service.ps1
```

**Linux/Mac:**

```bash
./test-product-service.sh
./test-order-service.sh
./test-user-service.sh
./test-promo-service.sh
./test-review-service.sh
```

## 🔗 Useful Links

- **API Gateway:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api-docs
- **RabbitMQ Management:** http://localhost:15672 (marketplace/marketplace)
- **pgAdmin:** http://localhost:5050 (marketplace@admin.com/marketplace)

## 📖 Project Structure

```
backend/
├── apps/
│   ├── api-gateway/          # HTTP REST API Gateway
│   ├── product-service/      # Product microservice
│   ├── order-service/        # Order microservice
│   ├── user-service/         # User microservice
│   ├── promo-service/        # PromoCode microservice
│   └── review-service/       # Review microservice
├── libs/
│   └── shared/              # Shared libraries (configs, types, constants)
├── docker-compose.yml        # Infrastructure setup
├── START-ALL.bat            # Windows startup script
├── START-ALL.sh             # Linux/Mac startup script
└── *.md                     # Documentation
```

## 🎯 Features

### Product Management

- Product catalog with categories
- Hierarchical category structure
- Product search and filtering
- Stock management
- Product view tracking

### Order Management

- Shopping cart functionality
- Order creation and tracking
- Order status management
- Stock synchronization

### User Management

- User registration and authentication
- JWT-based authorization
- User profile management
- Multiple delivery addresses

### Promo Codes

- Percentage and fixed discounts
- Usage limits and expiration dates
- Minimum purchase requirements
- Maximum discount caps

### Reviews & Ratings

- Product reviews with ratings (1-5 stars)
- Average rating calculation
- User review history
- Duplicate review prevention

## 🏛️ Architecture

The system uses microservices architecture with the following components:

```
Client → API Gateway → RabbitMQ → Microservices → PostgreSQL
```

- **API Gateway** receives HTTP requests and converts them to RabbitMQ messages
- **RabbitMQ** handles message routing between services
- **Microservices** process messages independently
- **PostgreSQL** stores all data (shared database for simplicity)

Each microservice:

- Has its own queue in RabbitMQ
- Can be scaled independently
- Fails independently without affecting others
- Can be deployed separately

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
# PostgreSQL
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_USERNAME=marketplace
POSTGRES_PASSWORD=marketplace
POSTGRES_DATABASE=marketplace

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# RabbitMQ
RABBITMQ_HOST=127.0.0.1
RABBITMQ_PORT=5672
RABBITMQ_USER=marketplace
RABBITMQ_PASSWORD=marketplace
RABBITMQ_VHOST=marketplace_vhost
```

## 🐛 Troubleshooting

### Services not starting

```bash
# Check Docker containers
docker ps

# Restart RabbitMQ
docker-compose restart marketplace_rabbitmq

# Restart PostgreSQL
docker-compose restart marketplace_postgres

# Check logs
docker-compose logs -f
```

### RabbitMQ connection issues

1. Open http://localhost:15672
2. Check that all queues exist:
   - `product_queue`
   - `order_queue`
   - `user_queue`
   - `promo_code_queue`
   - `review_queue`
3. Verify microservices are connected (Connections tab)

### Database connection issues

```bash
# Test PostgreSQL connection
docker exec -it marketplace_postgres psql -U marketplace -d marketplace -c "SELECT 1;"

# Restart PostgreSQL
docker-compose restart marketplace_postgres
```

## 🚦 Development

### Build all services

```bash
npm run build
```

### Build specific service

```bash
npm run build:gateway
npm run build:product
npm run build:order
npm run build:user
npm run build:promo
npm run build:review
```

### Production mode

```bash
npm run start:prod           # API Gateway
npm run start:product:prod   # Product Service
npm run start:order:prod     # Order Service
npm run start:user:prod      # User Service
npm run start:promo:prod     # PromoCode Service
npm run start:review:prod    # Review Service
```

## 📊 Status

**Current Status:** ✅ All 5 microservices are ready and working!

**Last Updated:** October 24, 2025

**Completion:** 5/5 microservices (100%)

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using [NestJS](https://nestjs.com/)
