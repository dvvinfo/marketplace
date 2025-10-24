#!/bin/bash

echo -e "\033[0;36m=== Testing User Service ===\033[0m"

# Test 1: Register
echo -e "\n\033[0;33m1. Testing Registration...\033[0m"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@example.com",
    "password": "TestPass123",
    "nameFirst": "Test",
    "nameLast": "User"
  }')

if [ $? -eq 0 ]; then
  echo -e "\033[0;32m✓ Registration successful\033[0m"
  echo "$REGISTER_RESPONSE" | jq '.'
  USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id')
  TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken')
else
  echo -e "\033[0;31m✗ Registration failed\033[0m"
  exit 1
fi

# Test 2: Login
echo -e "\n\033[0;33m2. Testing Login...\033[0m"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@example.com",
    "password": "TestPass123"
  }')

if [ $? -eq 0 ]; then
  echo -e "\033[0;32m✓ Login successful\033[0m"
  echo "$LOGIN_RESPONSE" | jq '.'
else
  echo -e "\033[0;31m✗ Login failed\033[0m"
fi

# Test 3: Get User
echo -e "\n\033[0;33m3. Testing Get User...\033[0m"
USER_RESPONSE=$(curl -s http://localhost:3000/users/$USER_ID)

if [ $? -eq 0 ]; then
  echo -e "\033[0;32m✓ Get user successful\033[0m"
  echo "$USER_RESPONSE" | jq '.'
else
  echo -e "\033[0;31m✗ Get user failed\033[0m"
fi

echo -e "\n\033[0;36m=== All tests completed ===\033[0m"
