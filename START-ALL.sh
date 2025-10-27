#!/bin/bash

echo "Starting Marketplace Infrastructure..."
echo ""

echo "Building and starting Docker containers..."
docker-compose up -d --build

echo ""
echo "Waiting for services to be ready..."
sleep 10

echo ""
echo "========================================"
echo "Marketplace Services Status:"
echo "========================================"
docker-compose ps

echo ""
echo "========================================"
echo "Available Services:"
echo "========================================"
echo "Frontend:        http://localhost:3000"
echo "API Gateway:     http://localhost:3001"
echo "Swagger Docs:    http://localhost:3001/api-docs"
echo "PostgreSQL:      localhost:5433"
echo "PgAdmin:         http://localhost:5050"
echo "RabbitMQ UI:     http://localhost:15672"
echo "RabbitMQ AMQP:   localhost:5672"
echo "========================================"
echo ""
echo "Backend Microservices (internal):"
echo "- Product Service"
echo "- Order Service"
echo "- User Service"
echo "- PromoCode Service"
echo "- Review Service"
echo "========================================"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop all:  docker-compose down"
echo ""
