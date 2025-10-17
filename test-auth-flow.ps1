# Complete Authentication Flow Test
# Tests registration, login, and protected endpoint access

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  LogiSync - Authentication Flow Test              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000/api"
$randomId = Get-Random -Maximum 9999
$testEmail = "testuser$randomId@example.com"

# Test 1: Registration
Write-Host "📝 Test 1: User Registration" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$registerData = @{
    firstName = "Test"
    lastName = "User$randomId"
    email = $testEmail
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerData
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "   User: $($registerResponse.data.user.first_name) $($registerResponse.data.user.last_name)" -ForegroundColor White
    Write-Host "   Email: $($registerResponse.data.user.email)" -ForegroundColor White
    Write-Host "   User ID: $($registerResponse.data.user.id)" -ForegroundColor White
    
    $userId = $registerResponse.data.user.id
    $accessToken = $registerResponse.data.tokens.accessToken
    $refreshToken = $registerResponse.data.tokens.refreshToken
    
    Write-Host "   Access Token: $($accessToken.Substring(0,30))..." -ForegroundColor Gray
    Write-Host "   Refresh Token: $($refreshToken.Substring(0,30))..." -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 2: Login
Write-Host "`n📝 Test 2: User Login" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$loginData = @{
    email = $testEmail
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginData
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.data.user.first_name) $($loginResponse.data.user.last_name)" -ForegroundColor White
    Write-Host "   Email: $($loginResponse.data.user.email)" -ForegroundColor White
    
    $accessToken = $loginResponse.data.tokens.accessToken
    $refreshToken = $loginResponse.data.tokens.refreshToken
    
    Write-Host "   New Access Token: $($accessToken.Substring(0,30))..." -ForegroundColor Gray
    Write-Host "   New Refresh Token: $($refreshToken.Substring(0,30))..." -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 3: Access Protected Endpoint (Profile)
Write-Host "`n📝 Test 3: Access Protected Endpoint (Profile)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/profile" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Profile access successful!" -ForegroundColor Green
    Write-Host "   User ID: $($profileResponse.data.id)" -ForegroundColor White
    Write-Host "   Name: $($profileResponse.data.first_name) $($profileResponse.data.last_name)" -ForegroundColor White
    Write-Host "   Email: $($profileResponse.data.email)" -ForegroundColor White
    Write-Host "   Active: $($profileResponse.data.is_active)" -ForegroundColor White
    Write-Host "   Verified: $($profileResponse.data.is_verified)" -ForegroundColor White
    
    if ($profileResponse.data.roles -and $profileResponse.data.roles.Count -gt 0) {
        Write-Host "   Roles:" -ForegroundColor White
        foreach ($role in $profileResponse.data.roles) {
            Write-Host "     - $($role.name): $($role.description)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "❌ Profile access failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 4: Access Dashboard (Protected Route)
Write-Host "`n📝 Test 4: Access Dashboard Endpoint" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $dashboardResponse = Invoke-RestMethod -Uri "$baseUrl/dashboard" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Dashboard access successful!" -ForegroundColor Green
    Write-Host "   Total Products: $($dashboardResponse.data.totalProducts)" -ForegroundColor White
    Write-Host "   Total Customers: $($dashboardResponse.data.totalCustomers)" -ForegroundColor White
    Write-Host "   Total Orders: $($dashboardResponse.data.totalOrders)" -ForegroundColor White
    Write-Host "   Low Stock Items: $($dashboardResponse.data.lowStockItems)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Dashboard access failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This is expected if you have RBAC restrictions" -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# Test 5: Refresh Token
Write-Host "`n📝 Test 5: Token Refresh" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$refreshData = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $refreshResponse = Invoke-RestMethod -Uri "$baseUrl/auth/refresh-token" `
        -Method POST `
        -ContentType "application/json" `
        -Body $refreshData
    
    Write-Host "✅ Token refresh successful!" -ForegroundColor Green
    
    $newAccessToken = $refreshResponse.data.tokens.accessToken
    $newRefreshToken = $refreshResponse.data.tokens.refreshToken
    
    Write-Host "   New Access Token: $($newAccessToken.Substring(0,30))..." -ForegroundColor Gray
    Write-Host "   New Refresh Token: $($newRefreshToken.Substring(0,30))..." -ForegroundColor Gray
    Write-Host "   Expires In: $($refreshResponse.data.tokens.expiresIn)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Token refresh failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 6: Logout
Write-Host "`n📝 Test 6: Logout" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$logoutData = @{
    refreshToken = $newRefreshToken
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $newAccessToken"
    }
    
    $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/auth/logout" `
        -Method POST `
        -ContentType "application/json" `
        -Headers $headers `
        -Body $logoutData
    
    Write-Host "✅ Logout successful!" -ForegroundColor Green
    Write-Host "   Message: $($logoutResponse.message)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Verify Token is Invalid After Logout
Write-Host "`n📝 Test 7: Verify Token Invalidation" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

try {
    $headers = @{
        "Authorization" = "Bearer $newAccessToken"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/profile" `
        -Method GET `
        -Headers $headers
    
    Write-Host "⚠️  Token still valid (unexpected)" -ForegroundColor Yellow
    
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Token properly invalidated!" -ForegroundColor Green
        Write-Host "   Got expected 401 Unauthorized" -ForegroundColor White
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Test Summary                                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "✅ All authentication tests completed!" -ForegroundColor Green
Write-Host "`nTest User Credentials:" -ForegroundColor Yellow
Write-Host "  Email: $testEmail" -ForegroundColor White
Write-Host "  Password: Test123!@#" -ForegroundColor White
Write-Host "  User ID: $userId" -ForegroundColor White
Write-Host "`n🚀 You can now use these credentials to test the frontend!" -ForegroundColor Cyan
Write-Host ""
