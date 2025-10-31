@echo off
chcp 65001 >nul
echo ========================================
echo   Создание тестовых промокодов
echo ========================================
echo.

set BASE_URL=http://localhost:3001

echo [1/4] Создание промокода SALE20 (скидка 20%%)...
curl -X POST "%BASE_URL%/promo-codes" ^
  -H "Content-Type: application/json" ^
  -d "{\"code\":\"SALE20\",\"discountType\":\"percentage\",\"discountValue\":20,\"validFrom\":\"2025-01-01\",\"validUntil\":\"2025-12-31\",\"isActive\":true}"
echo.
echo.

echo [2/4] Создание промокода SAVE500 (скидка 500 руб от 2000 руб)...
curl -X POST "%BASE_URL%/promo-codes" ^
  -H "Content-Type: application/json" ^
  -d "{\"code\":\"SAVE500\",\"discountType\":\"fixed\",\"discountValue\":500,\"minPurchaseAmount\":2000,\"validFrom\":\"2025-01-01\",\"validUntil\":\"2025-12-31\",\"isActive\":true}"
echo.
echo.

echo [3/4] Создание промокода FIRST30 (скидка 30%%, макс. 1000 руб)...
curl -X POST "%BASE_URL%/promo-codes" ^
  -H "Content-Type: application/json" ^
  -d "{\"code\":\"FIRST30\",\"discountType\":\"percentage\",\"discountValue\":30,\"maxDiscountAmount\":1000,\"usageLimit\":100,\"validFrom\":\"2025-01-01\",\"validUntil\":\"2025-12-31\",\"isActive\":true}"
echo.
echo.

echo [4/4] Создание промокода WELCOME10 (скидка 10%%)...
curl -X POST "%BASE_URL%/promo-codes" ^
  -H "Content-Type: application/json" ^
  -d "{\"code\":\"WELCOME10\",\"discountType\":\"percentage\",\"discountValue\":10,\"validFrom\":\"2025-01-01\",\"validUntil\":\"2025-12-31\",\"isActive\":true}"
echo.
echo.

echo ========================================
echo   Готово!
echo ========================================
echo.
echo Доступные промокоды для тестирования:
echo   - SALE20     : Скидка 20%%
echo   - SAVE500    : Скидка 500 руб (от 2000 руб)
echo   - FIRST30    : Скидка 30%% (макс. 1000 руб)
echo   - WELCOME10  : Скидка 10%%
echo.

pause
