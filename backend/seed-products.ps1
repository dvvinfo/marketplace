# Seed Products Script
# Encoding: UTF-8 with BOM

$baseUrl = "http://localhost:3001"

Write-Host "Seeding database with test data..." -ForegroundColor Green
Write-Host ""

# Create categories
Write-Host "Creating categories..." -ForegroundColor Cyan

$categories = @(
    @{
        name = "Electronics"
        slug = "electronics"
        description = "Smartphones, laptops, tablets and other electronics"
    },
    @{
        name = "Clothing"
        slug = "clothing"
        description = "Men's and women's clothing"
    },
    @{
        name = "Books"
        slug = "books"
        description = "Fiction and technical literature"
    },
    @{
        name = "Sports"
        slug = "sports"
        description = "Sports goods and equipment"
    }
)

$createdCategories = @()

foreach ($category in $categories) {
    try {
        $body = $category | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "$baseUrl/categories" -Method POST -Body $body -ContentType "application/json"
        $createdCategories += $result
        Write-Host "  Created category: $($category.name)" -ForegroundColor Green
    }
    catch {
        Write-Host "  Category '$($category.name)' already exists or error" -ForegroundColor Yellow
    }
}

Start-Sleep -Seconds 1

# Get all categories
Write-Host ""
Write-Host "Getting categories list..." -ForegroundColor Cyan
$allCategories = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET

if ($allCategories.Count -eq 0) {
    Write-Host "  Failed to get categories!" -ForegroundColor Red
    exit 1
}

Write-Host "  Found categories: $($allCategories.Count)" -ForegroundColor Green

# Create products
Write-Host ""
Write-Host "Creating products..." -ForegroundColor Cyan

$products = @(
    # Electronics
    @{
        title = "iPhone 15 Pro"
        description = "Latest Apple smartphone with titanium body, A17 Pro chip and improved camera"
        price = 99999
        stock = 15
        categoryId = $allCategories[0].id
        image = "https://images.unsplash.com/photo-1696446702183-cbd50c6e8e0f?w=400"
    },
    @{
        title = "MacBook Pro 16"
        description = "Powerful laptop for professionals with M3 Max chip and 32GB RAM"
        price = 249999
        stock = 8
        categoryId = $allCategories[0].id
        image = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"
    },
    @{
        title = "iPad Air"
        description = "Lightweight and powerful tablet for work and entertainment"
        price = 59999
        stock = 20
        categoryId = $allCategories[0].id
        image = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"
    },
    @{
        title = "AirPods Pro"
        description = "Wireless earbuds with active noise cancellation"
        price = 24999
        stock = 30
        categoryId = $allCategories[0].id
        image = "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400"
    },
    @{
        title = "Samsung Galaxy S24"
        description = "Samsung flagship smartphone with AI features"
        price = 79999
        stock = 12
        categoryId = $allCategories[0].id
        image = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400"
    },
    
    # Clothing
    @{
        title = "Levi's 501 Jeans"
        description = "Classic straight jeans made from quality denim"
        price = 7999
        stock = 25
        categoryId = $allCategories[1].id
        image = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
    },
    @{
        title = "Nike T-Shirt"
        description = "Sports t-shirt made from breathable fabric"
        price = 2999
        stock = 50
        categoryId = $allCategories[1].id
        image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    },
    @{
        title = "The North Face Jacket"
        description = "Warm winter jacket with down filling"
        price = 19999
        stock = 10
        categoryId = $allCategories[1].id
        image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"
    },
    
    # Books
    @{
        title = "Clean Code"
        description = "Robert Martin - programmer's bible about writing quality code"
        price = 1999
        stock = 40
        categoryId = $allCategories[2].id
        image = "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400"
    },
    @{
        title = "JavaScript: The Definitive Guide"
        description = "David Flanagan - comprehensive guide to JavaScript"
        price = 2499
        stock = 35
        categoryId = $allCategories[2].id
        image = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
    },
    @{
        title = "The Master and Margarita"
        description = "Mikhail Bulgakov - classic of Russian literature"
        price = 899
        stock = 60
        categoryId = $allCategories[2].id
        image = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
    },
    
    # Sports
    @{
        title = "Dumbbells 10kg"
        description = "Pair of adjustable dumbbells for home workouts"
        price = 3999
        stock = 15
        categoryId = $allCategories[3].id
        image = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400"
    },
    @{
        title = "Yoga Mat"
        description = "Non-slip mat made from eco-friendly materials"
        price = 1499
        stock = 45
        categoryId = $allCategories[3].id
        image = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"
    },
    @{
        title = "Mountain Bike"
        description = "Mountain bike with 21 speeds and suspension"
        price = 34999
        stock = 5
        categoryId = $allCategories[3].id
        image = "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400"
    },
    @{
        title = "Nike Air Sneakers"
        description = "Running sneakers with Air cushioning"
        price = 8999
        stock = 22
        categoryId = $allCategories[3].id
        image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
    }
)

$createdProducts = @()

foreach ($product in $products) {
    try {
        $body = $product | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $body -ContentType "application/json"
        $createdProducts += $result
        Write-Host "  Created product: $($product.title) - $($product.price) RUB" -ForegroundColor Green
    }
    catch {
        Write-Host "  Error creating product: $($product.title) - $_" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "Seeding completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Statistics:" -ForegroundColor Cyan
Write-Host "  Categories: $($allCategories.Count)" -ForegroundColor White
Write-Host "  Products created: $($createdProducts.Count)" -ForegroundColor White
Write-Host ""
Write-Host "Open frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
