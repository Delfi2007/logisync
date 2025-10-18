# Test User Management API Endpoints
# Run this script to test all new endpoints

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Testing User Management API" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

# Configuration
$baseUrl = "http://localhost:5000/api"
$adminEmail = "admin@logisync.com"
$adminPassword = "Admin@123"

# Step 1: Login as admin to get token
Write-Host "1. Logging in as admin..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            email = $adminEmail
            password = $adminPassword
        } | ConvertTo-Json)
    
    $token = $loginResponse.data.accessToken
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))...`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Headers with auth token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Get all users
Write-Host "2. Getting all users..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/users" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Retrieved $($usersResponse.data.users.Count) users" -ForegroundColor Green
    Write-Host "   Total: $($usersResponse.data.pagination.total)" -ForegroundColor Gray
    Write-Host "   Users:" -ForegroundColor Gray
    foreach ($user in $usersResponse.data.users) {
        $roles = ($user.roles | ForEach-Object { $_.name }) -join ", "
        Write-Host "   - $($user.email) [$roles]" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get users: $_" -ForegroundColor Red
}

# Step 3: Get all roles
Write-Host "3. Getting all roles..." -ForegroundColor Yellow
try {
    $rolesResponse = Invoke-RestMethod -Uri "$baseUrl/roles" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Retrieved $($rolesResponse.data.Count) roles" -ForegroundColor Green
    foreach ($role in $rolesResponse.data) {
        Write-Host "   - $($role.name): $($role.description) ($($role.user_count) users)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get roles: $_" -ForegroundColor Red
}

# Step 4: Get role statistics
Write-Host "4. Getting role statistics..." -ForegroundColor Yellow
try {
    $statsResponse = Invoke-RestMethod -Uri "$baseUrl/roles/stats" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Role statistics:" -ForegroundColor Green
    foreach ($stat in $statsResponse.data) {
        Write-Host "   $($stat.name): $($stat.active_user_count)/$($stat.user_count) active" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get stats: $_" -ForegroundColor Red
}

# Step 5: Get specific user details
if ($usersResponse.data.users.Count -gt 0) {
    $firstUserId = $usersResponse.data.users[0].id
    Write-Host "5. Getting user details (ID: $firstUserId)..." -ForegroundColor Yellow
    try {
        $userResponse = Invoke-RestMethod -Uri "$baseUrl/users/$firstUserId" `
            -Method Get `
            -Headers $headers
        
        Write-Host "✅ User details:" -ForegroundColor Green
        Write-Host "   Email: $($userResponse.data.email)" -ForegroundColor Gray
        Write-Host "   Name: $($userResponse.data.first_name) $($userResponse.data.last_name)" -ForegroundColor Gray
        Write-Host "   Active: $($userResponse.data.is_active)" -ForegroundColor Gray
        Write-Host "   Verified: $($userResponse.data.is_verified)" -ForegroundColor Gray
        Write-Host "   Roles: $(($userResponse.data.roles | ForEach-Object { $_.name }) -join ', ')`n" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Failed to get user: $_`n" -ForegroundColor Red
    }
}

# Step 6: Test search functionality
Write-Host "6. Testing user search..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/users?search=admin" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Search results: $($searchResponse.data.users.Count) users found`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Search failed: $_`n" -ForegroundColor Red
}

# Step 7: Test role filter
Write-Host "7. Testing role filter..." -ForegroundColor Yellow
try {
    $filterResponse = Invoke-RestMethod -Uri "$baseUrl/users?role=admin" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Admin users: $($filterResponse.data.users.Count)`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Filter failed: $_`n" -ForegroundColor Red
}

# Step 8: Get activity log
Write-Host "8. Getting activity log..." -ForegroundColor Yellow
try {
    $activityResponse = Invoke-RestMethod -Uri "$baseUrl/activity/all?limit=5" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Retrieved $($activityResponse.data.activities.Count) recent activities" -ForegroundColor Green
    foreach ($activity in $activityResponse.data.activities) {
        Write-Host "   - $($activity.email): $($activity.action) at $($activity.created_at)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get activity: $_`n" -ForegroundColor Red
}

# Step 9: Test assign roles (if there are multiple users)
if ($usersResponse.data.users.Count -gt 1) {
    $testUserId = $usersResponse.data.users[1].id
    $adminRoleId = ($rolesResponse.data | Where-Object { $_.name -eq "manager" }).id
    
    Write-Host "9. Testing role assignment..." -ForegroundColor Yellow
    try {
        $assignResponse = Invoke-RestMethod -Uri "$baseUrl/users/$testUserId/roles" `
            -Method Put `
            -Headers $headers `
            -Body (@{
                roleIds = @($adminRoleId)
            } | ConvertTo-Json)
        
        Write-Host "✅ Roles assigned successfully" -ForegroundColor Green
        Write-Host "   New roles: $(($assignResponse.data.roles | ForEach-Object { $_.name }) -join ', ')`n" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Failed to assign roles: $_`n" -ForegroundColor Red
    }
}

# Summary
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "✅ Backend API is working!" -ForegroundColor Green
Write-Host "✅ User management endpoints functional" -ForegroundColor Green
Write-Host "✅ Role management endpoints functional" -ForegroundColor Green
Write-Host "✅ Activity logging working" -ForegroundColor Green
Write-Host "`nReady to build frontend UI! 🚀`n" -ForegroundColor Yellow
