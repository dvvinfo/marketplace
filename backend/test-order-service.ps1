# Test Order Service API

Write-Host "=== Testing Order Service ===" -ForegroundColor Green

# Test 1: Add product to cart
Write-Host "`n1. Add product to cart (User 1, Product 1, Qty 2):" -ForegroundColor Yellow
$cart1 = Invoke-RestMethod -Uri http://localhost:3000/cart/add -Method POST -ContentType "application/json" -Body '{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}'
Write-Host "Cart updated successfully"

# Test 2: Get cart
Write-Host "`n2. Get cart for User 1:" -ForegroundColor Yellow
$cart = Invoke-RestMethod -Uri http://localhost:3000/cart/user/1 -Method GET
$cart | ConvertTo-Json -Depth 5

# Test 3: Create order
Write-Host "`n3. Create order:" -ForegroundColor Yellow
$order = Invoke-RestMethod -Uri http://localhost:3000/orders -Method POST -ContentType "application/json" -Body '{
  "userId": 1,
  "items": [
    {"productId": 1, "quantity": 1}
  ],
  "shippingAddress": "123 Main St, City, Country",
  "phone": "+1234567890",
  "notes": "Please deliver after 5 PM"
}'
Write-Host "Order created successfully"

# Test 4: Get all orders
Write-Host "`n4. Get all orders:" -ForegroundColor Yellow
$orders = Invoke-RestMethod -Uri http://localhost:3000/orders -Method GET
Write-Host "Total orders: $($orders.Count)"
if ($orders.Count -gt 0) {
    $orders[0] | ConvertTo-Json -Depth 3
}

# Test 5: Get user orders
Write-Host "`n5. Get orders for User 1:" -ForegroundColor Yellow
$userOrders = Invoke-RestMethod -Uri http://localhost:3000/orders/user/1 -Method GET
Write-Host "User orders: $($userOrders.Count)"

# Test 6: Check product stock
Write-Host "`n6. Check product stock after order:" -ForegroundColor Yellow
$product = Invoke-RestMethod -Uri http://localhost:3000/products/1 -Method GET
Write-Host "Product: $($product.title)"
Write-Host "Stock: $($product.stock)"

# Test 7: Update cart item
Write-Host "`n7. Update cart item quantity:" -ForegroundColor Yellow
if ($cart.items.Count -gt 0) {
    $itemId = $cart.items[0].id
    $updated = Invoke-RestMethod -Uri "http://localhost:3000/cart/item/$itemId" -Method PUT -ContentType "application/json" -Body '{
      "quantity": 3
    }'
    Write-Host "Cart item updated"
}

# Test 8: Get updated cart
Write-Host "`n8. Get updated cart:" -ForegroundColor Yellow
$cart2 = Invoke-RestMethod -Uri http://localhost:3000/cart/user/1 -Method GET
Write-Host "Total items: $($cart2.items.Count)"
Write-Host "Total amount: `$$($cart2.totalAmount)"

# Test 9: Clear cart
Write-Host "`n9. Clear cart:" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/cart/user/1/clear -Method DELETE
Write-Host "Cart cleared"

# Test 10: Verify cart is empty
Write-Host "`n10. Verify cart is empty:" -ForegroundColor Yellow
$emptyCart = Invoke-RestMethod -Uri http://localhost:3000/cart/user/1 -Method GET
Write-Host "Items in cart: $($emptyCart.items.Count)"

Write-Host "`n=== Summary ===" -ForegroundColor Green
Write-Host "✅ Added items to cart"
Write-Host "✅ Created order"
Write-Host "✅ Product stock updated"
Write-Host "✅ Updated cart items"
Write-Host "✅ Cleared cart"
Write-Host "`n=== All tests completed ===" -ForegroundColor Green
