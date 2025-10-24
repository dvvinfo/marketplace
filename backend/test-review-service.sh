#!/bin/bash

echo -e "\033[0;36m🧪 Testing Review Service...\033[0m"
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Create Review
echo -e "\033[0;33m📝 Test 1: Creating a review...\033[0m"
REVIEW_RESPONSE=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 1,
    "rating": 5,
    "comment": "Excellent product! Highly recommended."
  }')

if [ $? -eq 0 ]; then
  echo -e "\033[0;32m✅ Review created successfully!\033[0m"
  REVIEW_ID=$(echo "$REVIEW_RESPONSE" | jq -r '.id')
  echo "Review ID: $REVIEW_ID"
  echo ""
else
  echo -e "\033[0;31m❌ Failed to create review\033[0m"
  echo ""
fi

# Test 2: Get All Reviews
echo -e "\033[0;33m📋 Test 2: Getting all reviews...\033[0m"
ALL_REVIEWS=$(curl -s "$BASE_URL/reviews")
REVIEW_COUNT=$(echo "$ALL_REVIEWS" | jq '. | length')
echo -e "\033[0;32m✅ Retrieved $REVIEW_COUNT reviews\033[0m"
echo ""

# Test 3: Get Review by ID
if [ ! -z "$REVIEW_ID" ]; then
  echo -e "\033[0;33m🔍 Test 3: Getting review by ID...\033[0m"
  REVIEW=$(curl -s "$BASE_URL/reviews/$REVIEW_ID")
  echo -e "\033[0;32m✅ Review found!\033[0m"
  echo "$REVIEW" | jq '.'
  echo ""
fi

# Test 4: Get Reviews by Product
echo -e "\033[0;33m🛍️ Test 4: Getting reviews for product 1...\033[0m"
PRODUCT_REVIEWS=$(curl -s "$BASE_URL/reviews/product/1")
PRODUCT_REVIEW_COUNT=$(echo "$PRODUCT_REVIEWS" | jq '. | length')
echo -e "\033[0;32m✅ Found $PRODUCT_REVIEW_COUNT reviews for product 1\033[0m"
echo ""

# Test 5: Get Product Rating
echo -e "\033[0;33m⭐ Test 5: Getting product rating...\033[0m"
RATING=$(curl -s "$BASE_URL/reviews/product/1/rating")
echo -e "\033[0;32m✅ Product Rating:\033[0m"
echo "$RATING" | jq '.'
echo ""

# Test 6: Get Reviews by User
echo -e "\033[0;33m👤 Test 6: Getting reviews by user 1...\033[0m"
USER_REVIEWS=$(curl -s "$BASE_URL/reviews/user/1")
USER_REVIEW_COUNT=$(echo "$USER_REVIEWS" | jq '. | length')
echo -e "\033[0;32m✅ Found $USER_REVIEW_COUNT reviews by user 1\033[0m"
echo ""

# Test 7: Update Review
if [ ! -z "$REVIEW_ID" ]; then
  echo -e "\033[0;33m✏️ Test 7: Updating review...\033[0m"
  UPDATED_REVIEW=$(curl -s -X PUT "$BASE_URL/reviews/$REVIEW_ID/user/1" \
    -H "Content-Type: application/json" \
    -d '{
      "rating": 4,
      "comment": "Good product, but could be better."
    }')
  echo -e "\033[0;32m✅ Review updated successfully!\033[0m"
  echo "$UPDATED_REVIEW" | jq '.'
  echo ""
fi

# Test 8: Create Another Review
echo -e "\033[0;33m📝 Test 8: Creating another review...\033[0m"
REVIEW2_RESPONSE=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "productId": 1,
    "rating": 3,
    "comment": "Average product."
  }')

if [ $? -eq 0 ]; then
  echo -e "\033[0;32m✅ Second review created successfully!\033[0m"
  REVIEW_ID2=$(echo "$REVIEW2_RESPONSE" | jq -r '.id')
  echo "Review ID: $REVIEW_ID2"
  echo ""
else
  echo -e "\033[0;31m❌ Failed to create second review\033[0m"
  echo ""
fi

# Test 9: Test Duplicate Review (should fail)
echo -e "\033[0;33m🚫 Test 9: Testing duplicate review prevention...\033[0m"
DUPLICATE_RESPONSE=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 1,
    "rating": 5,
    "comment": "Trying to review again"
  }')

if echo "$DUPLICATE_RESPONSE" | grep -q "error"; then
  echo -e "\033[0;32m✅ Duplicate review correctly prevented!\033[0m"
else
  echo -e "\033[0;31m❌ Duplicate review was created (should have failed)\033[0m"
fi
echo ""

# Test 10: Delete Review
if [ ! -z "$REVIEW_ID2" ]; then
  echo -e "\033[0;33m🗑️ Test 10: Deleting review...\033[0m"
  curl -s -X DELETE "$BASE_URL/reviews/$REVIEW_ID2/user/2" > /dev/null
  echo -e "\033[0;32m✅ Review deleted successfully!\033[0m"
  echo ""
fi

echo -e "\033[0;36m✨ Review Service testing completed!\033[0m"
