#!/usr/bin/env pwsh

Write-Host "=== Testing Change Password Functionality ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$testEmail = "testpassword_$(Get-Random)@example.com"
$oldPassword = "oldpassword123"
$newPassword = "newpassword456"

# 1. Register new user
Write-Host "1. Registering new user..." -ForegroundColor Yellow
$registerBody = @{
    email = $testEmail
    password = $oldPassword
    nameFirst = "Test"
    nameLast = "Password"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.user.id)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Registration failed: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# 2. Login to get token
Write-Host ""
Write-Host "2. Logging in to get JWT token..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $oldPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.accessToken
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# 3. Change password
Write-Host ""
Write-Host "3. Changing password..." -ForegroundColor Yellow
$changePasswordBody = @{
    oldPassword = $oldPassword
    newPassword = $newPassword
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $changeResponse = Invoke-RestMethod -Uri "$baseUrl/auth/change-password" -Method Post -Body $changePasswordBody -Headers $headers
    Write-Host "✓ Password changed successfully" -ForegroundColor Green
    Write-Host "Message: $($changeResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Password change failed: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# 4. Try login with old password (should fail)
Write-Host ""
Write-Host "4. Testing old password (should fail)..." -ForegroundColor Yellow
$oldLoginBody = @{
    email = $testEmail
    password = $oldPassword
} | ConvertTo-Json

try {
    $oldLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $oldLoginBody -ContentType "application/json"
    Write-Host "✗ Old password still works (UNEXPECTED)" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "✓ Old password rejected (as expected)" -ForegroundColor Green
}

Start-Sleep -Seconds 1

# 5. Try login with new password (should succeed)
Write-Host ""
Write-Host "5. Testing new password (should succeed)..." -ForegroundColor Yellow
$newLoginBody = @{
    email = $testEmail
    password = $newPassword
} | ConvertTo-Json

try {
    $newLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $newLoginBody -ContentType "application/json"
    Write-Host "✓ New password works correctly" -ForegroundColor Green
    Write-Host "New Token: $($newLoginResponse.accessToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ New password login failed: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# 6. Test wrong old password
Write-Host ""
Write-Host "6. Testing wrong old password (should fail)..." -ForegroundColor Yellow
$wrongPasswordBody = @{
    oldPassword = "wrongpassword"
    newPassword = "anotherpassword"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $($newLoginResponse.accessToken)"
    "Content-Type" = "application/json"
}

try {
    $wrongResponse = Invoke-RestMethod -Uri "$baseUrl/auth/change-password" -Method Post -Body $wrongPasswordBody -Headers $headers
    Write-Host "✗ Wrong old password accepted (UNEXPECTED)" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "✓ Wrong old password rejected (as expected)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== All Tests Passed! ===" -ForegroundColor Green
Write-Host ""
