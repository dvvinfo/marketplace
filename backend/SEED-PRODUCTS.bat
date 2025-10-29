@echo off
echo.
echo ========================================
echo   Заполнение базы данных товарами
echo ========================================
echo.

cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -File "seed-products.ps1"

echo.
pause
