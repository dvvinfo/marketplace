@echo off
echo Starting Marketplace in DEVELOPMENT mode with HOT-RELOAD...
echo.

echo Building and starting Docker containers...
docker-compose -f docker-compose.dev.yml up -d --build

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo ========================================
echo Marketplace Services Status:
echo ========================================
docker-compose -f docker-compose.dev.yml ps

echo.
echo ========================================
echo Available Services:
echo ========================================
echo Frontend:        http://localhost:3000  (HOT-RELOAD)
echo API Gateway:     http://localhost:3001  (HOT-RELOAD)
echo Swagger Docs:    http://localhost:3001/api-docs
echo PostgreSQL:      localhost:5433
echo PgAdmin:         http://localhost:5050
echo RabbitMQ UI:     http://localhost:15672
echo RabbitMQ AMQP:   localhost:5672
echo ========================================
echo.
echo Backend Microservices (HOT-RELOAD):
echo - Product Service
echo - Order Service
echo - User Service
echo - PromoCode Service
echo - Review Service
echo ========================================
echo.
echo HOT-RELOAD is ENABLED!
echo Changes in code will automatically reload services.
echo.
echo To view logs: docker-compose -f docker-compose.dev.yml logs -f
echo To stop all:  docker-compose -f docker-compose.dev.yml down
echo.
