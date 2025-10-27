#!/bin/bash

echo "Starting Marketplace Infrastructure Only..."
echo "(PostgreSQL, RabbitMQ, PgAdmin)"
echo ""

docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "Waiting for services to be ready..."
sleep 5

echo ""
echo "========================================"
echo "Infrastructure Status:"
echo "========================================"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "========================================"
echo "Available Services:"
echo "========================================"
echo "PostgreSQL:      localhost:5433"
echo "PgAdmin:         http://localhost:5050"
echo "RabbitMQ UI:     http://localhost:15672"
echo "RabbitMQ AMQP:   localhost:5672"
echo "========================================"
echo ""
echo "Now you can run backend and frontend locally:"
echo "  cd backend && ./START-ALL.sh"
echo "  cd frontend && npm run dev"
echo ""
