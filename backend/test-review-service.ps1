# Review Service Test Script
Write-Host "🧪 Testing Review Service..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$headers = @{
    "Content-Type" = "application/json"
}

# Test 1: Create Review
Write-Host "📝 Test 1: Creating a review..." -ForegroundColor Yellow
$reviewData = @{
    userId = 1
    productId = 1
    rating = 5
    comment = "Excellent product! Highly recommended."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reviews" -Method Post -Body $reviewData -Headers $headers
    Write-Host "✅ Review created successfully!" -ForegroundColor Green
    Write-Host "Review ID: $($response.id)" -ForegroundColor White
    $reviewId = $response.id
    Write-Host ""
} catch {
    Write-Host "❌ Failed to create review: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Get All Reviews
Write-Host "📋 Test 2: Getting all reviews..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reviews" -Method Get
    Write-Host "✅ Retrieved $($response.Count) reviews" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get reviews: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Get Review by ID
if ($reviewId) {
    Write-Host "🔍 Test 3: Getting review by ID..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reviews/$reviewId" -Method Get
        Write-Host "✅ Review found!" -ForegroundColor Green
        Write-Host "Rating: $($response.rating)/5" -ForegroundColor White
        Write-Host "Comment: $($response.comment)" -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "❌ Failed to get review: $_" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 4: Get Reviews by Product
Write-Host "🛍️ Test 4: Getting reviews for product 1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reviews/product/1" -Method Get
    Write-Host "✅ Found $($response.Count) reviews for product 1" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get product reviews: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 5: Get Product Rating
Write-Host "⭐ Test 5: Getting product rating..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reviews/product/1/rating" -Method Get
    Write-Host "✅ Product Rating:" -ForegroundColor Green
    Write-Host "Average: $($response.averageRating)/5" -ForegroundColor White
    Write-Host "Total Reviews: $($response.totalReviews)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get product rating: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 6: Get Reviews by User
Write-Host "👤 Test 6: Getting reviews by user 1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reviews/user/1" -Method Get
    Write-Host "✅ Found $($response.Count) reviews by user 1" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get user reviews: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 7: Update Review
if ($reviewId) {
    Write-Host "✏️ Test 7: Updating review..." -ForegroundColor Yellow
    $updateData = @{
        rating = 4
        comment = "Good product, but could be better."
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reviews/$reviewId/user/1" -Method Put -Body $updateData -Headers $headers
        Write-Host "✅ Review updated successfully!" -ForegroundColor Green
        Write-Host "New Rating: $($response.rating)/5" -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "❌ Failed to update review: $_" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 8: Create Another Review
Write-Host "📝 Test 8: Creating another review..." -ForegroundColor Yellow
$reviewData2 = @{
    userId = 2
    productId = 1
    rating = 3
    comment = "Average product."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reviews" -Method Post -Body $reviewData2 -Headers $headers
    Write-Host "✅ Second review created successfully!" -ForegroundColor Green
    Write-Host "Review ID: $($response.id)" -ForegroundColor White
    $reviewId2 = $response.id
    Write-Host ""
} catch {
    Write-Host "❌ Failed to create second review: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 9: Test Duplicate Review (should fail)
Write-Host "🚫 Test 9: Testing duplicate review prevention..." -ForegroundColor Yellow
$duplicateData = @{
    userId = 1
    productId = 1
    rating = 5
    comment = "Trying to review again"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reviews" -Method Post -Body $duplicateData -Headers $headers
    Write-Host "❌ Duplicate review was created (should have failed)" -ForegroundColor Red
    Write-Host ""
} catch {
    Write-Host "✅ Duplicate review correctly prevented!" -ForegroundColor Green
    Write-Host ""
}

# Test 10: Delete Review
if ($reviewId2) {
    Write-Host "🗑️ Test 10: Deleting review..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/reviews/$reviewId2/user/2" -Method Delete
        Write-Host "✅ Review deleted successfully!" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "❌ Failed to delete review: $_" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "✨ Review Service testing completed!" -ForegroundColor Cyan
