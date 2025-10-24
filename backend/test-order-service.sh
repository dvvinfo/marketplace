#!/bin/bash

echo -e "\033[0;32m=== Testing Order Service ===\033[0m"

# Test 1: Add product to cart
echo -e "\n\033[0;33m1. Add product to cart (User 1, Product 1, Qty 2):\033[0m"
curl -s -X POST http://localhost:3000/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 1,
    "quantity": 2
  }' | jq '.'

# Test 2: Get cart
echo -e "\n\033[0;33m2. Get cart for User 1:\033[0m"
curl -s http://localhost:3000/cart/user/1 | jq '.'

# Test 3: Create order
echo -e "\n\033[0;33m3. Create order:\033[0m"
curl -s -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "items": [
      {"productId": 1, "quantity": 1}
    ],
    "shippingAddress": "123 Main St, City, Country",
    "phone": "+1234567890",
    "notes": "Please deliver after 5 PM"
  }' | jq '.'

# Test 4: Get all orders
echo -e "\n\033[0;33m4. Get all orders:\033[0m"
curl -s http://localhost:3000/orders | jq '.'

# Test 5: Get user orders
echo -e "\n\033[0;33m5. Get orders for User 1:\033[0m"
curl -s http://localhost:3000/orders/user/1 | jq '.'

# Test 6: Check product stock
echo -e "\n\033[0;33m6. Check product stock after order:\033[0m"
curl -s http://localhost:3000/products/1 | jq '.'

echo -e "\n\033[0;32m=== All tests completed ===\033[0m"
