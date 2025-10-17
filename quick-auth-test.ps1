# Simple Authentication Test
Write-Host "`n=== LogiSync Authentication Test ===" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000/api"
$testEmail = "quicktest$(Get-Random -Maximum 9999)@example.com"
$testPass = "Test123!@#"

# Test 1: Registration
Write-Host "`n[1/4] Testing Registration..." -ForegroundColor Yellow
$regBody = @{
    firstName = "Quick"
    lastName = "Test"
    email = $testEmail
    password = $testPass
} | ConvertTo-Json

try {
    $reg = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $regBody
    Write-Host "    ✅ Registration successful" -ForegroundColor Green
    Write-Host "    User ID: $($reg.data.user.id)" -ForegroundColor White
    $accessToken = $reg.data.tokens.accessToken
    $refreshToken = $reg.data.tokens.refreshToken
} catch {
    Write-Host "    ❌ Registration failed" -ForegroundColor Red
    exit 1
}

# Test 2: Login
Write-Host "`n[2/4] Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPass
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "    ✅ Login successful" -ForegroundColor Green
    $accessToken = $login.data.tokens.accessToken
    $refreshToken = $login.data.tokens.refreshToken
} catch {
    Write-Host "    ❌ Login failed" -ForegroundColor Red
    exit 1
}

# Test 3: Protected Endpoint
Write-Host "`n[3/4] Testing Protected Endpoint..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $accessToken" }

try {
    $profileData = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $headers
    Write-Host "    ✅ Profile access successful" -ForegroundColor Green
    Write-Host "    Name: $($profileData.data.first_name) $($profileData.data.last_name)" -ForegroundColor White
} catch {
    Write-Host "    ❌ Profile access failed" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails.Message) {
        Write-Host "    Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    exit 1
}

# Test 4: Token Refresh
Write-Host "`n[4/4] Testing Token Refresh..." -ForegroundColor Yellow
$refreshBody = @{ refreshToken = $refreshToken } | ConvertTo-Json

try {
    $refresh = Invoke-RestMethod -Uri "$baseUrl/auth/refresh-token" -Method POST -ContentType "application/json" -Body $refreshBody
    Write-Host "    ✅ Token refresh successful" -ForegroundColor Green
} catch {
    Write-Host "    ❌ Token refresh failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== All Tests Passed! ===" -ForegroundColor Green
Write-Host "`nTest Credentials:" -ForegroundColor Cyan
Write-Host "  Email: $testEmail" -ForegroundColor White
Write-Host "  Password: $testPass" -ForegroundColor White
Write-Host "`n✨ Frontend should now work correctly!" -ForegroundColor Cyan
Write-Host ""
