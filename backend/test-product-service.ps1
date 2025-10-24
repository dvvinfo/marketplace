# Test Product Service API

Write-Host "=== Testing Product Service ===" -ForegroundColor Green

# Test 1: Get all products
Write-Host "`n1. Get all products:" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/products -Method GET | ConvertTo-Json

# Test 2: Get all categories
Write-Host "`n2. Get all categories:" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/categories -Method GET | ConvertTo-Json

# Test 3: Get category tree
Write-Host "`n3. Get category tree:" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/categories/tree -Method GET | ConvertTo-Json -Depth 5

# Test 4: Search products
Write-Host "`n4. Search products (search=iphone):" -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:3000/products/search?search=iphone" -Method GET | ConvertTo-Json

# Test 5: Get product by ID
Write-Host "`n5. Get product by ID (id=1):" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/products/1 -Method GET | ConvertTo-Json

# Test 6: Get category by slug
Write-Host "`n6. Get category by slug (slug=smartphones):" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/categories/slug/smartphones -Method GET | ConvertTo-Json

Write-Host "`n=== All tests completed ===" -ForegroundColor Green
