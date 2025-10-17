# Test Registration Endpoint
# This script tests the registration endpoint with the correct field names

$testUser = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe.test$(Get-Random -Maximum 9999)@example.com"
    password = "Test123!@#"
} | ConvertTo-Json

Write-Host "`n=== Testing Registration Endpoint ===" -ForegroundColor Cyan
Write-Host "Sending request to: http://localhost:5000/api/auth/register" -ForegroundColor Yellow
Write-Host "Request body:" -ForegroundColor Yellow
Write-Host $testUser -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $testUser
    
    Write-Host "`n✅ Registration successful!" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
    Write-Host "`nUser Details:" -ForegroundColor Cyan
    Write-Host "  ID: $($response.data.user.id)" -ForegroundColor White
    Write-Host "  Email: $($response.data.user.email)" -ForegroundColor White
    Write-Host "  Name: $($response.data.user.first_name) $($response.data.user.last_name)" -ForegroundColor White
    Write-Host "  Roles: $($response.data.user.roles | ForEach-Object { $_.name } | Join-String -Separator ', ')" -ForegroundColor White
    
    Write-Host "`nTokens:" -ForegroundColor Cyan
    Write-Host "  Access Token: $($response.data.tokens.accessToken.Substring(0,50))..." -ForegroundColor White
    Write-Host "  Refresh Token: $($response.data.tokens.refreshToken.Substring(0,50))..." -ForegroundColor White
    Write-Host "  Expires In: $($response.data.tokens.expiresIn)" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Registration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "`nServer response:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
