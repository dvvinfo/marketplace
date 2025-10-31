# Create test promo codes
# Run: powershell -ExecutionPolicy Bypass -File create-promo-codes.ps1

$baseUrl = "http://localhost:3001"

Write-Host "=== Creating test promo codes ===" -ForegroundColor Cyan
Write-Host ""

# Promo 1: 20% discount
Write-Host "1. Creating SALE20 (20% discount)..." -ForegroundColor Yellow
$promo1 = @{
    code = "SALE20"
    discountType = "percentage"
    discountValue = 20
    validFrom = "2025-01-01"
    validUntil = "2025-12-31"
    isActive = $true
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$baseUrl/promo-codes" -Method Post -Body $promo1 -ContentType "application/json"
    Write-Host "OK: SALE20 created (ID: $($response1.id))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""

# Promo 2: Fixed 500 discount (min 2000)
Write-Host "2. Creating SAVE500 (500 RUB discount, min 2000 RUB)..." -ForegroundColor Yellow
$promo2 = @{
    code = "SAVE500"
    discountType = "fixed"
    discountValue = 500
    minPurchaseAmount = 2000
    validFrom = "2025-01-01"
    validUntil = "2025-12-31"
    isActive = $true
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/promo-codes" -Method Post -Body $promo2 -ContentType "application/json"
    Write-Host "OK: SAVE500 created (ID: $($response2.id))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""

# Promo 3: 30% discount (max 1000)
Write-Host "3. Creating FIRST30 (30% discount, max 1000 RUB)..." -ForegroundColor Yellow
$promo3 = @{
    code = "FIRST30"
    discountType = "percentage"
    discountValue = 30
    maxDiscountAmount = 1000
    usageLimit = 100
    validFrom = "2025-01-01"
    validUntil = "2025-12-31"
    isActive = $true
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri "$baseUrl/promo-codes" -Method Post -Body $promo3 -ContentType "application/json"
    Write-Host "OK: FIRST30 created (ID: $($response3.id))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""

# Promo 4: 10% discount
Write-Host "4. Creating WELCOME10 (10% discount)..." -ForegroundColor Yellow
$promo4 = @{
    code = "WELCOME10"
    discountType = "percentage"
    discountValue = 10
    validFrom = "2025-01-01"
    validUntil = "2025-12-31"
    isActive = $true
} | ConvertTo-Json

try {
    $response4 = Invoke-RestMethod -Uri "$baseUrl/promo-codes" -Method Post -Body $promo4 -ContentType "application/json"
    Write-Host "OK: WELCOME10 created (ID: $($response4.id))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available promo codes:" -ForegroundColor White
Write-Host "  - SALE20     : 20% discount" -ForegroundColor Green
Write-Host "  - SAVE500    : 500 RUB discount (min 2000 RUB)" -ForegroundColor Green
Write-Host "  - FIRST30    : 30% discount (max 1000 RUB)" -ForegroundColor Green
Write-Host "  - WELCOME10  : 10% discount" -ForegroundColor Green
Write-Host ""
