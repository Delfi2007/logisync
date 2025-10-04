# PowerShell script to test LogiSync API endpoints
# Run this with: .\test-api.ps1

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🧪 LogiSync API Test Suite" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET $baseUrl/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Success:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n─────────────────────────────────────────────────────`n"

# Test 2: Register New User
Write-Host "Test 2: Register New User" -ForegroundColor Yellow
Write-Host "POST $baseUrl/api/auth/register" -ForegroundColor Gray
$registerData = @{
    email = "newuser@test.com"
    password = "Test@123456"
    full_name = "New Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "✅ Success:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    $global:token = $response.token
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details:" -ForegroundColor Gray
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    }
}

Write-Host "`n─────────────────────────────────────────────────────`n"

# Test 3: Login with Test User
Write-Host "Test 3: Login with Test User" -ForegroundColor Yellow
Write-Host "POST $baseUrl/api/auth/login" -ForegroundColor Gray
$loginData = @{
    email = "test@logisync.com"
    password = "Test@123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✅ Success:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    $global:token = $response.token
    Write-Host "`n📝 Token saved for next requests" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details:" -ForegroundColor Gray
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    }
}

Write-Host "`n─────────────────────────────────────────────────────`n"

# Test 4: Get Current User (Protected Route)
Write-Host "Test 4: Get Current User (Protected Route)" -ForegroundColor Yellow
Write-Host "GET $baseUrl/api/auth/me" -ForegroundColor Gray

if ($global:token) {
    Write-Host "Using token: $($global:token.Substring(0,20))..." -ForegroundColor Gray
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers $headers
        Write-Host "✅ Success:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details:" -ForegroundColor Gray
            $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
        }
    }
} else {
    Write-Host "⚠️  No token available. Login first." -ForegroundColor Yellow
}

Write-Host "`n─────────────────────────────────────────────────────`n"

# Test 5: Login with Admin User
Write-Host "Test 5: Login with Admin User" -ForegroundColor Yellow
Write-Host "POST $baseUrl/api/auth/login" -ForegroundColor Gray
$adminLoginData = @{
    email = "admin@logisync.com"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminLoginData -ContentType "application/json"
    Write-Host "✅ Success:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details:" -ForegroundColor Gray
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    }
}

Write-Host "`n─────────────────────────────────────────────────────`n"

# Test 6: Invalid Login
Write-Host "Test 6: Invalid Login (Expected to Fail)" -ForegroundColor Yellow
Write-Host "POST $baseUrl/api/auth/login" -ForegroundColor Gray
$invalidLoginData = @{
    email = "test@logisync.com"
    password = "WrongPassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $invalidLoginData -ContentType "application/json"
    Write-Host "❌ Should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected invalid credentials:" -ForegroundColor Green
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3
    }
}

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✨ Test Suite Completed" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════`n" -ForegroundColor Cyan
