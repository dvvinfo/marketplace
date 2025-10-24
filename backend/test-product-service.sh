#!/bin/bash

echo -e "\033[0;32m=== Testing Product Service ===\033[0m"

# Test 1: Get all products
echo -e "\n\033[0;33m1. Get all products:\033[0m"
curl -s http://localhost:3000/products | jq '.'

# Test 2: Get all categories
echo -e "\n\033[0;33m2. Get all categories:\033[0m"
curl -s http://localhost:3000/categories | jq '.'

# Test 3: Get category tree
echo -e "\n\033[0;33m3. Get category tree:\033[0m"
curl -s http://localhost:3000/categories/tree | jq '.'

# Test 4: Search products
echo -e "\n\033[0;33m4. Search products (search=iphone):\033[0m"
curl -s "http://localhost:3000/products/search?search=iphone" | jq '.'

# Test 5: Get product by ID
echo -e "\n\033[0;33m5. Get product by ID (id=1):\033[0m"
curl -s http://localhost:3000/products/1 | jq '.'

# Test 6: Get category by slug
echo -e "\n\033[0;33m6. Get category by slug (slug=smartphones):\033[0m"
curl -s http://localhost:3000/categories/slug/smartphones | jq '.'

echo -e "\n\033[0;32m=== All tests completed ===\033[0m"
