@echo off
echo ========================================
echo   Запуск Marketplace Microservices
echo ========================================
echo.

echo Запуск Product Service...
start "Product Service" cmd /k "cd /d %~dp0 && npm run start:product:dev"

timeout /t 3 /nobreak

echo Запуск Order Service...
start "Order Service" cmd /k "cd /d %~dp0 && npm run start:order:dev"

timeout /t 3 /nobreak

echo Запуск User Service...
start "User Service" cmd /k "cd /d %~dp0 && npm run start:user:dev"

timeout /t 3 /nobreak

echo Запуск PromoCode Service...
start "PromoCode Service" cmd /k "cd /d %~dp0 && npm run start:promo:dev"

timeout /t 3 /nobreak

echo Запуск Review Service...
start "Review Service" cmd /k "cd /d %~dp0 && npm run start:review:dev"

timeout /t 5 /nobreak

echo Запуск API Gateway...
start "API Gateway" cmd /k "cd /d %~dp0 && npm run start:dev"

echo.
echo ========================================
echo   Все сервисы запущены!
echo ========================================
echo.
echo Product Service - в отдельном окне
echo Order Service - в отдельном окне
echo User Service - в отдельном окне
echo PromoCode Service - в отдельном окне
echo Review Service - в отдельном окне
echo API Gateway - в отдельном окне
echo.
echo Ожидание инициализации (20 секунд)...
timeout /t 20 /nobreak

echo.
echo ========================================
echo   Готово к тестированию!
echo ========================================
echo.
echo Откройте:
echo   - Swagger: http://localhost:3000/api-docs
echo   - RabbitMQ UI: http://localhost:15672
echo   - pgAdmin: http://localhost:5050
echo.
echo Все 5 микросервисов работают!
echo.
pause
