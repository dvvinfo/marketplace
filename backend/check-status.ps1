Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Service Status Check" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check RabbitMQ consumers
Write-Host "1. PromoCode Service (RabbitMQ):" -ForegroundColor Yellow
$pair = "marketplace:marketplace"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$headers = @{ Authorization = "Basic $base64" }

try {
    $queue = Invoke-RestMethod -Uri "http://localhost:15672/api/queues/marketplace_vhost/promo_code_queue" -Headers $headers -ErrorAction Stop
    if ($queue.consumers -gt 0) {
        Write-Host "   STATUS: CONNECTED" -ForegroundColor Green
        Write-Host "   Consumers: $($queue.consumers)" -ForegroundColor Gray
    } else {
        Write-Host "   STATUS: NOT CONNECTED" -ForegroundColor Red
        Write-Host "   Start with: npm run start:promo:dev" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   STATUS: ERROR - Cannot check queue" -ForegroundColor Red
}

Write-Host ""

# Check API Gateway
Write-Host "2. API Gateway (HTTP):" -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   STATUS: RUNNING" -ForegroundColor Green
    Write-Host "   URL: http://localhost:3000" -ForegroundColor Gray
} catch {
    Write-Host "   STATUS: NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start with: npm run start:dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan

# Quick test if both are running
$pair = "marketplace:marketplace"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$headers = @{ Authorization = "Basic $base64" }

try {
    $queue = Invoke-RestMethod -Uri "http://localhost:15672/api/queues/marketplace_vhost/promo_code_queue" -Headers $headers -ErrorAction SilentlyContinue
    $gateway = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction SilentlyContinue
    
    if ($queue.consumers -gt 0 -and $gateway) {
        Write-Host ""
        Write-Host "All services are READY!" -ForegroundColor Green
        Write-Host "You can run tests: .\test-api.ps1" -ForegroundColor White
        Write-Host ""
    }
} catch {}
