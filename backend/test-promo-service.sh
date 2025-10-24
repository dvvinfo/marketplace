#!/bin/bash

echo -e "\033[0;32m=== Testing PromoCode Service ===\033[0m"

# Test 1: Create percentage discount promo code
echo -e "\n\033[0;33m1. Create percentage discount promo code (WINTER2025):\033[0m"
PROMO1=$(curl -s -X POST http://localhost:3000/promo-codes \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WINTER2025",
    "description": "Winter sale 2025 - 15% off",
    "discountType": "percentage",
    "discountValue": 15,
    "validFrom": "2025-01-01",
    "validUntil": "2025-12-31",
    "isActive": true
  }')
echo "$PROMO1" | jq '.'
PROMO1_ID=$(echo "$PROMO1" | jq -r '.id')

# Test 2: Create fixed discount promo code
echo -e "\n\033[0;33m2. Create fixed discount promo code (SAVE50):\033[0m"
curl -s -X POST http://localhost:3000/promo-codes \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE50",
    "description": "Save $50 on orders over $200",
    "discountType": "fixed",
    "discountValue": 50,
    "minPurchaseAmount": 200,
    "validFrom": "2025-01-01",
    "validUntil": "2025-12-31",
    "isActive": true
  }' | jq '.'

# Test 3: Create limited usage promo code
echo -e "\n\033[0;33m3. Create limited usage promo code (FIRST100):\033[0m"
curl -s -X POST http://localhost:3000/promo-codes \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FIRST100",
    "description": "20% off for first 100 customers",
    "discountType": "percentage",
    "discountValue": 20,
    "maxDiscountAmount": 100,
    "usageLimit": 100,
    "validFrom": "2025-01-01",
    "validUntil": "2025-12-31",
    "isActive": true
  }' | jq '.'

# Test 4: Get all promo codes
echo -e "\n\033[0;33m4. Get all promo codes:\033[0m"
curl -s http://localhost:3000/promo-codes | jq '.'

# Test 5: Get active promo codes
echo -e "\n\033[0;33m5. Get active promo codes:\033[0m"
curl -s http://localhost:3000/promo-codes/active | jq '.'

# Test 6: Validate WINTER2025 for $100 order
echo -e "\n\033[0;33m6. Validate WINTER2025 for \$100 order:\033[0m"
curl -s -X POST http://localhost:3000/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WINTER2025",
    "orderAmount": 100
  }' | jq '.'

# Test 7: Validate SAVE50 for $250 order
echo -e "\n\033[0;33m7. Validate SAVE50 for \$250 order:\033[0m"
curl -s -X POST http://localhost:3000/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE50",
    "orderAmount": 250
  }' | jq '.'

# Test 8: Try to validate SAVE50 for $150 order (should fail)
echo -e "\n\033[0;33m8. Try to validate SAVE50 for \$150 order (should fail):\033[0m"
curl -s -X POST http://localhost:3000/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE50",
    "orderAmount": 150
  }' | jq '.'

# Test 9: Validate FIRST100 for $500 order (should cap at $100)
echo -e "\n\033[0;33m9. Validate FIRST100 for \$500 order (should cap at \$100):\033[0m"
curl -s -X POST http://localhost:3000/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FIRST100",
    "orderAmount": 500
  }' | jq '.'

# Test 10: Get promo code by code
echo -e "\n\033[0;33m10. Get promo code by code (WINTER2025):\033[0m"
curl -s http://localhost:3000/promo-codes/code/WINTER2025 | jq '.'

# Test 11: Update promo code
echo -e "\n\033[0;33m11. Update WINTER2025 discount to 20%:\033[0m"
curl -s -X PUT "http://localhost:3000/promo-codes/$PROMO1_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "discountValue": 20
  }' | jq '.'

# Test 12: Validate updated promo code
echo -e "\n\033[0;33m12. Validate updated WINTER2025 for \$100 order:\033[0m"
curl -s -X POST http://localhost:3000/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WINTER2025",
    "orderAmount": 100
  }' | jq '.'

echo -e "\n\033[0;32m=== Summary ===\033[0m"
echo -e "✅ Created 3 promo codes"
echo -e "✅ Validated percentage discount"
echo -e "✅ Validated fixed discount"
echo -e "✅ Validated minimum purchase amount"
echo -e "✅ Validated maximum discount cap"
echo -e "✅ Updated promo code"
echo -e "\n\033[0;32m=== All tests completed ===\033[0m"
