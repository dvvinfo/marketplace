# Test User Service

Write-Host "=== Testing User Service ===" -ForegroundColor Cyan

# Test 1: Register
Write-Host "`n1. Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
  email = "test.user@example.com"
  password = "TestPass123"
  nameFirst = "Test"
  nameLast = "User"
} | ConvertTo-Json

try {
  $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
  Write-Host "✓ Registration successful" -ForegroundColor Green
  Write-Host "User ID: $($registerResponse.user.id)"
  Write-Host "Email: $($registerResponse.user.email)"
  $userId = $registerResponse.user.id
  $token = $registerResponse.accessToken
} catch {
  Write-Host "✗ Registration failed: $_" -ForegroundColor Red
  exit 1
}

# Test 2: Login
Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
  email = "test.user@example.com"
  password = "TestPass123"
} | ConvertTo-Json

try {
  $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
  Write-Host "✓ Login successful" -ForegroundColor Green
  Write-Host "Token: $($loginResponse.accessToken.Substring(0,20))..."
} catch {
  Write-Host "✗ Login failed: $_" -ForegroundColor Red
}

# Test 3: Get User
Write-Host "`n3. Testing Get User..." -ForegroundColor Yellow
try {
  $user = Invoke-RestMethod -Uri "http://localhost:3000/users/$userId" -Method GET
  Write-Host "✓ Get user successful" -ForegroundColor Green
  Write-Host "Name: $($user.nameFirst) $($user.nameLast)"
} catch {
  Write-Host "✗ Get user failed: $_" -ForegroundColor Red
}

# Test 4: Get All Users
Write-Host "`n4. Testing Get All Users..." -ForegroundColor Yellow
try {
  $users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET
  Write-Host "✓ Get all users successful" -ForegroundColor Green
  Write-Host "Total users: $($users.Count)"
} catch {
  Write-Host "✗ Get all users failed: $_" -ForegroundColor Red
}

# Test 5: Create Address
Write-Host "`n5. Testing Create Address..." -ForegroundColor Yellow
$addressBody = @{
  userId = $userId
  fullName = "Test User"
  phone = "+1234567890"
  country = "USA"
  city = "New York"
  state = "NY"
  postalCode = "10001"
  addressLine1 = "123 Test Street"
  addressLine2 = "Apt 45"
  isDefault = $true
} | ConvertTo-Json

try {
  $address = Invoke-RestMethod -Uri "http://localhost:3000/addresses" -Method POST -Body $addressBody -ContentType "application/json"
  Write-Host "✓ Create address successful" -ForegroundColor Green
  Write-Host "Address ID: $($address.id)"
  Write-Host "Address: $($address.addressLine1), $($address.city)"
  $addressId = $address.id
} catch {
  Write-Host "✗ Create address failed: $_" -ForegroundColor Red
  Write-Host "Error details: $($_.Exception.Message)"
}

# Test 6: Get User Addresses
Write-Host "`n6. Testing Get User Addresses..." -ForegroundColor Yellow
try {
  $addresses = Invoke-RestMethod -Uri "http://localhost:3000/addresses/user/$userId" -Method GET
  Write-Host "✓ Get user addresses successful" -ForegroundColor Green
  Write-Host "Total addresses: $($addresses.Count)"
} catch {
  Write-Host "✗ Get user addresses failed: $_" -ForegroundColor Red
}

Write-Host "`n=== User Service Tests Complete ===" -ForegroundColor Cyan
