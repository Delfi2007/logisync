# Run API Tests
Write-Host "Starting API Tests..." -ForegroundColor Cyan
node test-api.js
Write-Host "`nTests completed. Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
