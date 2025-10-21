@echo off
echo ========================================
echo   Запуск Marketplace Microservices
echo ========================================
echo.

echo Запуск PromoCode Service...
start "PromoCode Service" cmd /k "cd /d %~dp0 && npm run start:promo:dev"

timeout /t 10 /nobreak

echo Запуск API Gateway...
start "API Gateway" cmd /k "cd /d %~dp0 && npm run start:dev"

echo.
echo ========================================
echo   Сервисы запущены!
echo ========================================
echo.
echo PromoCode Service - в отдельном окне
echo API Gateway - в отдельном окне
echo.
echo Ожидание инициализации (15 секунд)...
timeout /t 15 /nobreak

echo.
echo ========================================
echo   Готово к тестированию!
echo ========================================
echo.
echo Откройте:
echo   - Swagger: http://localhost:3000/api-docs
echo   - RabbitMQ UI: http://localhost:15672
echo.
echo Запустите тесты: test-promo-service.ps1
echo.
pause
