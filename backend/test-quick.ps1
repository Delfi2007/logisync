# Quick test - Register and test user management

$baseUrl = "http://localhost:5000/api"

# Register a test admin user
Write-Host "Registering test user..." -ForegroundColor Yellow
$token = $null
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            email = "testadmin@logisync.com"
            password = "Test@123"
            firstName = "Test"
            lastName = "Admin"
        } | ConvertTo-Json)
    
    Write-Host "✅ User registered!" -ForegroundColor Green
    $token = $registerResponse.data.accessToken
    Write-Host "Token received: $($token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "Registration failed, trying login..." -ForegroundColor Yellow
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body (@{
                email = "testadmin@logisync.com"
                password = "Test@123"
            } | ConvertTo-Json)
        
        $token = $loginResponse.data.accessToken
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "Token received: $($token.Substring(0,20))..." -ForegroundColor Gray
    } catch {
        Write-Host "❌ Failed: $_" -ForegroundColor Red
        exit 1
    }
}

if (-not $token) {
    Write-Host "❌ No token received" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test GET /api/users
Write-Host "`nTesting GET /api/users..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users" -Method Get -Headers $headers
    Write-Host "✅ Success! Found $($response.data.pagination.total) users" -ForegroundColor Green
    $response.data.users | ForEach-Object {
        Write-Host "  - $($_.email) | Active: $($_.is_active) | Roles: $(($_.roles | ForEach-Object { $_.name }) -join ', ')" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Test GET /api/roles
Write-Host "`nTesting GET /api/roles..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/roles" -Method Get -Headers $headers
    Write-Host "✅ Success! Found $($response.data.Count) roles" -ForegroundColor Green
    $response.data | ForEach-Object {
        Write-Host "  - $($_.name): $($_.description) ($($_.user_count) users)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n✅ API tests complete!`n" -ForegroundColor Green
