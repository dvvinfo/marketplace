$baseUrl = "http://localhost:3001"

Write-Host "Creating test data..." -ForegroundColor Green

# Create category
Write-Host "Creating category..." -ForegroundColor Cyan
$categoryBody = '{"name":"Electronics","slug":"electronics","description":"Smartphones and gadgets"}'
try {
    $category = Invoke-RestMethod -Uri "$baseUrl/categories" -Method POST -Body $categoryBody -ContentType "application/json"
    Write-Host "Category created: $($category.name)" -ForegroundColor Green
    Write-Host "Category object: $($category | ConvertTo-Json)" -ForegroundColor Yellow
    $categoryId = $category.id
} catch {
    Write-Host "Category might already exist, getting all categories..." -ForegroundColor Yellow
    $categories = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET
    Write-Host "Categories: $($categories | ConvertTo-Json)" -ForegroundColor Yellow
    $categoryId = $categories[0].id
}

Write-Host "Using category ID: $categoryId" -ForegroundColor Cyan

# Create products
Write-Host "Creating products..." -ForegroundColor Cyan

$product1 = "{`"title`":`"iPhone 15 Pro`",`"description`":`"Latest Apple smartphone`",`"price`":99999,`"stock`":15,`"categoryId`":$categoryId,`"image`":`"https://images.unsplash.com/photo-1696446702183-cbd50c6e8e0f?w=400`"}"
$product2 = "{`"title`":`"MacBook Pro`",`"description`":`"Powerful laptop`",`"price`":249999,`"stock`":8,`"categoryId`":$categoryId,`"image`":`"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400`"}"
$product3 = "{`"title`":`"iPad Air`",`"description`":`"Lightweight tablet`",`"price`":59999,`"stock`":20,`"categoryId`":$categoryId,`"image`":`"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400`"}"

$products = @($product1, $product2, $product3)

foreach ($productBody in $products) {
    try {
        $product = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $productBody -ContentType "application/json"
        Write-Host "Product created: $($product.name)" -ForegroundColor Green
    } catch {
        Write-Host "Error creating product" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! Check http://localhost:3000" -ForegroundColor Green
