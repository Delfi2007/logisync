# Gmail SMTP Configuration Script for LogiSync
# Run this script after setting up your Gmail App Password

Write-Host "Gmail SMTP Configuration for LogiSync" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for email configuration
Write-Host "Please provide your Gmail SMTP details:" -ForegroundColor Yellow
Write-Host ""

$smtpUser = Read-Host "Enter your Gmail address"
Write-Host ""
Write-Host "Now, generate an App Password:" -ForegroundColor Green
Write-Host "   1. Visit: https://myaccount.google.com/apppasswords" -ForegroundColor Gray
Write-Host "   2. Select app: Mail" -ForegroundColor Gray
Write-Host "   3. Select device: Other (Custom name)" -ForegroundColor Gray
Write-Host "   4. Enter name: LogiSync" -ForegroundColor Gray
Write-Host "   5. Click Generate" -ForegroundColor Gray
Write-Host "   6. Copy the 16-character password" -ForegroundColor Gray
Write-Host ""

$smtpPass = Read-Host "Enter your Gmail App Password (remove spaces)"

$smtpPass = Read-Host "Enter your Gmail App Password (remove spaces)"

$smtpFrom = Read-Host "Enter 'From' name (default: LogiSync)"
if ([string]::IsNullOrWhiteSpace($smtpFrom)) {
    $smtpFrom = "LogiSync"
}

# Email configuration to append
$emailConfig = @"

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=$smtpUser
SMTP_PASS=$smtpPass
SMTP_FROM="$smtpFrom <noreply@logisync.com>"
"@

# Backup existing .env file
$envPath = ".\backend\.env"
$backupPath = ".\backend\.env.backup"

if (Test-Path $envPath) {
    Write-Host "`n📦 Creating backup of .env file..." -ForegroundColor Yellow
    Copy-Item $envPath $backupPath -Force
    Write-Host "✅ Backup created: .env.backup`n" -ForegroundColor Green
}

# Append email configuration
try {
    Add-Content -Path $envPath -Value $emailConfig
    Write-Host "✅ Email configuration added to .env file!`n" -ForegroundColor Green
    
    Write-Host "📧 Configuration Summary:" -ForegroundColor Cyan
    Write-Host "   SMTP Host: smtp.gmail.com" -ForegroundColor Gray
    Write-Host "   SMTP Port: 587" -ForegroundColor Gray
    Write-Host "   SMTP User: $smtpUser" -ForegroundColor Gray
    Write-Host "   SMTP From: $smtpFrom <noreply@logisync.com>`n" -ForegroundColor Gray
    
    Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Restart your backend server (Ctrl+C and run 'npm start')" -ForegroundColor White
    Write-Host "   2. Test by registering a new user" -ForegroundColor White
    Write-Host "   3. Check your email for verification message`n" -ForegroundColor White
    
    Write-Host "💡 Tip: If emails don't arrive:" -ForegroundColor Yellow
    Write-Host "   - Check spam folder" -ForegroundColor White
    Write-Host "   - Verify App Password is correct" -ForegroundColor White
    Write-Host "   - Check backend console for error messages`n" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error: Failed to update .env file" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
