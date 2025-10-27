@echo off
echo Stopping Marketplace Development Environment...
echo.

docker-compose -f docker-compose.dev.yml down

echo.
echo Development environment stopped.
echo.
