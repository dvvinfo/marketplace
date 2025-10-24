#!/bin/bash

echo "========================================"
echo "  Запуск Marketplace Microservices"
echo "========================================"
echo ""

echo "Запуск Product Service..."
gnome-terminal -- bash -c "cd $(pwd) && npm run start:product:dev; exec bash" 2>/dev/null || \
xterm -e "cd $(pwd) && npm run start:product:dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run start:product:dev"' 2>/dev/null &

sleep 3

echo "Запуск Order Service..."
gnome-terminal -- bash -c "cd $(pwd) && npm run start:order:dev; exec bash" 2>/dev/null || \
xterm -e "cd $(pwd) && npm run start:order:dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run start:order:dev"' 2>/dev/null &

sleep 3

echo "Запуск User Service..."
gnome-terminal -- bash -c "cd $(pwd) && npm run start:user:dev; exec bash" 2>/dev/null || \
xterm -e "cd $(pwd) && npm run start:user:dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run start:user:dev"' 2>/dev/null &

sleep 3

echo "Запуск PromoCode Service..."
gnome-terminal -- bash -c "cd $(pwd) && npm run start:promo:dev; exec bash" 2>/dev/null || \
xterm -e "cd $(pwd) && npm run start:promo:dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run start:promo:dev"' 2>/dev/null &

sleep 3

echo "Запуск Review Service..."
gnome-terminal -- bash -c "cd $(pwd) && npm run start:review:dev; exec bash" 2>/dev/null || \
xterm -e "cd $(pwd) && npm run start:review:dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run start:review:dev"' 2>/dev/null &

sleep 5

echo "Запуск API Gateway..."
gnome-terminal -- bash -c "cd $(pwd) && npm run start:dev; exec bash" 2>/dev/null || \
xterm -e "cd $(pwd) && npm run start:dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run start:dev"' 2>/dev/null &

echo ""
echo "========================================"
echo "  Все сервисы запущены!"
echo "========================================"
echo ""
echo "Product Service - в отдельном окне"
echo "Order Service - в отдельном окне"
echo "User Service - в отдельном окне"
echo "PromoCode Service - в отдельном окне"
echo "Review Service - в отдельном окне"
echo "API Gateway - в отдельном окне"
echo ""
echo "Ожидание инициализации (20 секунд)..."
sleep 20

echo ""
echo "========================================"
echo "  Готово к тестированию!"
echo "========================================"
echo ""
echo "Откройте:"
echo "  - Swagger: http://localhost:3000/api-docs"
echo "  - RabbitMQ UI: http://localhost:15672"
echo "  - pgAdmin: http://localhost:5050"
echo ""
echo "Все 5 микросервисов работают!"
echo ""
