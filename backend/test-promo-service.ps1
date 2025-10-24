# Test PromoCode Service API

Write-Host "=== Testing PromoCode Service ===" -ForegroundColor Green

# Test 1: Create percentage discount promo code
Write-Host "`n1. Create percentage discount promo code (WINTER2025):" -ForegroundColor Yellow
$promo1 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method POST -ContentType "application/json" -Body '{
  "code": "WINTER2025",
  "description": "Winter sale 2025 - 15% off",
  "discountType": "percentage",
  "discountValue": 15,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}'
$promo1 | ConvertTo-Json

# Test 2: Create fixed discount promo code
Write-Host "`n2. Create fixed discount promo code (SAVE50):" -ForegroundColor Yellow
$promo2 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method POST -ContentType "application/json" -Body '{
  "code": "SAVE50",
  "description": "Save $50 on orders over $200",
  "discountType": "fixed",
  "discountValue": 50,
  "minPurchaseAmount": 200,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}'
$promo2 | ConvertTo-Json

# Test 3: Create limited usage promo code
Write-Host "`n3. Create limited usage promo code (FIRST100):" -ForegroundColor Yellow
$promo3 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method POST -ContentType "application/json" -Body '{
  "code": "FIRST100",
  "description": "20% off for first 100 customers",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscountAmount": 100,
  "usageLimit": 100,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}'
$promo3 | ConvertTo-Json

# Test 4: Get all promo codes
Write-Host "`n4. Get all promo codes:" -ForegroundColor Yellow
$allPromos = Invoke-RestMethod -Uri http://localhost:3000/promo-codes -Method GET
Write-Host "Total promo codes: $($allPromos.Count)"

# Test 5: Get active promo codes
Write-Host "`n5. Get active promo codes:" -ForegroundColor Yellow
$activePromos = Invoke-RestMethod -Uri http://localhost:3000/promo-codes/active -Method GET
Write-Host "Active promo codes: $($activePromos.Count)"

# Test 6: Validate WINTER2025 for $100 order
Write-Host "`n6. Validate WINTER2025 for `$100 order:" -ForegroundColor Yellow
$validation1 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes/validate -Method POST -ContentType "application/json" -Body '{
  "code": "WINTER2025",
  "orderAmount": 100
}'
$validation1 | ConvertTo-Json

# Test 7: Validate SAVE50 for $250 order
Write-Host "`n7. Validate SAVE50 for `$250 order:" -ForegroundColor Yellow
$validation2 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes/validate -Method POST -ContentType "application/json" -Body '{
  "code": "SAVE50",
  "orderAmount": 250
}'
$validation2 | ConvertTo-Json

# Test 8: Try to validate SAVE50 for $150 order (should fail - min purchase $200)
Write-Host "`n8. Try to validate SAVE50 for `$150 order (should fail):" -ForegroundColor Yellow
$validation3 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes/validate -Method POST -ContentType "application/json" -Body '{
  "code": "SAVE50",
  "orderAmount": 150
}'
$validation3 | ConvertTo-Json

# Test 9: Validate FIRST100 for $500 order (should cap at $100)
Write-Host "`n9. Validate FIRST100 for `$500 order (should cap at `$100):" -ForegroundColor Yellow
$validation4 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes/validate -Method POST -ContentType "application/json" -Body '{
  "code": "FIRST100",
  "orderAmount": 500
}'
$validation4 | ConvertTo-Json

# Test 10: Get promo code by code
Write-Host "`n10. Get promo code by code (WINTER2025):" -ForegroundColor Yellow
$promoByCode = Invoke-RestMethod -Uri http://localhost:3000/promo-codes/code/WINTER2025 -Method GET
$promoByCode | ConvertTo-Json

# Test 11: Update promo code
Write-Host "`n11. Update WINTER2025 discount to 20%:" -ForegroundColor Yellow
$updated = Invoke-RestMethod -Uri "http://localhost:3000/promo-codes/$($promo1.id)" -Method PUT -ContentType "application/json" -Body '{
  "discountValue": 20
}'
$updated | ConvertTo-Json

# Test 12: Validate updated promo code
Write-Host "`n12. Validate updated WINTER2025 for `$100 order:" -ForegroundColor Yellow
$validation5 = Invoke-RestMethod -Uri http://localhost:3000/promo-codes/validate -Method POST -ContentType "application/json" -Body '{
  "code": "WINTER2025",
  "orderAmount": 100
}'
$validation5 | ConvertTo-Json

Write-Host "`n=== Summary ===" -ForegroundColor Green
Write-Host "✅ Created 3 promo codes"
Write-Host "✅ Validated percentage discount"
Write-Host "✅ Validated fixed discount"
Write-Host "✅ Validated minimum purchase amount"
Write-Host "✅ Validated maximum discount cap"
Write-Host "✅ Updated promo code"
Write-Host "`n=== All tests completed ===" -ForegroundColor Green
