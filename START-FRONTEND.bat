@echo off
echo ========================================
echo   Starting Marketplace Frontend
echo ========================================
echo.

cd frontend

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Generating API types from Swagger...
echo Make sure backend is running on http://localhost:3001
timeout /t 2 >nul
call npm run generate:api

echo.
echo [3/3] Starting development server...
echo Frontend will be available at http://localhost:3000
echo.

call npm run dev
