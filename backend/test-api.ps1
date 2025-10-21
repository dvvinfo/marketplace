Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Testing PromoCode Microservice" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Get all promo codes
Write-Host "Test 1: GET /promo-codes" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/promo-codes" -Method Get -TimeoutSec 5
    Write-Host "SUCCESS! Found: $($response.Count) promo codes" -ForegroundColor Green
    if ($response.Count -gt 0) {
        Write-Host "  First code: $($response[0].code)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Create promo code
Write-Host "Test 2: POST /promo-codes (create)" -ForegroundColor Yellow
$newPromo = @{
    code = "MICROTEST2024"
    discountType = "percentage"
    discountValue = 25
    validFrom = "2024-01-01T00:00:00Z"
    validUntil = "2024-12-31T23:59:59Z"
    isActive = $true
    minPurchaseAmount = 100
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/promo-codes" -Method Post -Body $newPromo -ContentType "application/json" -TimeoutSec 5
    Write-Host "SUCCESS! Promo code created" -ForegroundColor Green
    Write-Host "  ID: $($response.id)" -ForegroundColor Gray
    Write-Host "  Code: $($response.code)" -ForegroundColor Gray
    Write-Host "  Discount: $($response.discountValue)%" -ForegroundColor Gray
} catch {
    if ($_.Exception.Message -match "409") {
        Write-Host "INFO: Promo code already exists, continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Get active promo codes
Write-Host "Test 3: GET /promo-codes/active" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/promo-codes/active" -Method Get -TimeoutSec 5
    Write-Host "SUCCESS! Active codes: $($response.Count)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get promo code by code
Write-Host "Test 4: GET /promo-codes/code/MICROTEST2024" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/promo-codes/code/MICROTEST2024" -Method Get -TimeoutSec 5
    Write-Host "SUCCESS! Promo code found" -ForegroundColor Green
    Write-Host "  Code: $($response.code)" -ForegroundColor Gray
    Write-Host "  Discount: $($response.discountValue)%" -ForegroundColor Gray
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Validate promo code
Write-Host "Test 5: POST /promo-codes/validate" -ForegroundColor Yellow
$validation = @{
    code = "MICROTEST2024"
    orderAmount = 200
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/promo-codes/validate" -Method Post -Body $validation -ContentType "application/json" -TimeoutSec 5
    if ($response.valid) {
        Write-Host "SUCCESS! Promo code is valid" -ForegroundColor Green
        Write-Host "  Order amount: $($response.orderAmount)" -ForegroundColor Gray
        Write-Host "  Discount: $($response.discountAmount)" -ForegroundColor Gray
        Write-Host "  Final amount: $($response.finalAmount)" -ForegroundColor Gray
    } else {
        Write-Host "WARNING: Promo code is invalid - $($response.message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Testing complete!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check RabbitMQ Management UI:" -ForegroundColor Cyan
Write-Host "  http://localhost:15672" -ForegroundColor White
Write-Host "  Login: marketplace / Password: marketplace" -ForegroundColor Gray
Write-Host ""
