# LogiSync Backend - Automated Setup Script
# Run this script to set up the backend automatically

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 LogiSync Backend - Automated Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Node.js is installed
Write-Host "📦 Step 1: Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Step 2: Check if PostgreSQL is installed
Write-Host ""
Write-Host "📦 Step 2: Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL is installed: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL not found in PATH" -ForegroundColor Yellow
    Write-Host "   Please install PostgreSQL from https://www.postgresql.org/download/" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Step 3: Install npm dependencies
Write-Host ""
Write-Host "📦 Step 3: Installing npm dependencies..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Gray

if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ package.json not found! Are you in the backend directory?" -ForegroundColor Red
    exit 1
}

# Step 4: Set up environment file
Write-Host ""
Write-Host "⚙️  Step 4: Setting up environment configuration..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Please edit .env file and set your PostgreSQL password!" -ForegroundColor Yellow
        Write-Host "   File location: $(Get-Location)\.env" -ForegroundColor Yellow
        Write-Host ""
        
        $editNow = Read-Host "Would you like to edit .env now? (y/n)"
        if ($editNow -eq 'y') {
            notepad .env
            Write-Host "   Waiting for you to save and close the file..." -ForegroundColor Gray
            Read-Host "Press Enter when you're done editing .env"
        } else {
            Write-Host "   Remember to edit .env before running the server!" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ .env.example not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Step 5: Create database
Write-Host ""
Write-Host "🗄️  Step 5: Setting up PostgreSQL database..." -ForegroundColor Yellow
Write-Host "   You will be prompted for your PostgreSQL password" -ForegroundColor Gray

$dbName = "logisync_dev"
$createDb = Read-Host "Create database '$dbName'? (y/n)"

if ($createDb -eq 'y') {
    Write-Host "   Please enter your PostgreSQL password when prompted..." -ForegroundColor Gray
    
    $checkDb = psql -U postgres -lqt 2>&1 | Select-String -Pattern $dbName
    
    if ($checkDb) {
        Write-Host "⚠️  Database '$dbName' already exists" -ForegroundColor Yellow
        $recreate = Read-Host "Drop and recreate database? (y/n)"
        
        if ($recreate -eq 'y') {
            psql -U postgres -c "DROP DATABASE IF EXISTS $dbName;"
            psql -U postgres -c "CREATE DATABASE $dbName;"
            Write-Host "✅ Database recreated" -ForegroundColor Green
        }
    } else {
        psql -U postgres -c "CREATE DATABASE $dbName;"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database '$dbName' created" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to create database" -ForegroundColor Red
            Write-Host "   You can create it manually: psql -U postgres -c 'CREATE DATABASE $dbName;'" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⏭️  Skipping database creation" -ForegroundColor Yellow
}

# Step 6: Run migrations
Write-Host ""
Write-Host "🔄 Step 6: Running database migrations..." -ForegroundColor Yellow
$runMigrations = Read-Host "Run migrations now? This will create all tables (y/n)"

if ($runMigrations -eq 'y') {
    npm run migrate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migrations completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Migrations failed" -ForegroundColor Red
        Write-Host "   Check your database connection in .env file" -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping migrations" -ForegroundColor Yellow
    Write-Host "   Run manually later with: npm run migrate" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Make sure .env is configured with your PostgreSQL password"
Write-Host "   2. Start the server: npm run dev"
Write-Host "   3. Test the API: curl http://localhost:5000/health"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - TESTING_GUIDE.md - Complete testing instructions"
Write-Host "   - SETUP_GUIDE.md - Detailed setup guide"
Write-Host "   - README.md - Quick reference"
Write-Host ""
Write-Host "🔑 Default Test Accounts:" -ForegroundColor Yellow
Write-Host "   Admin: admin@logisync.com / Admin@123"
Write-Host "   User:  test@logisync.com / Test@123"
Write-Host ""

$startServer = Read-Host "Would you like to start the server now? (y/n)"
if ($startServer -eq 'y') {
    Write-Host ""
    Write-Host "🚀 Starting LogiSync Backend Server..." -ForegroundColor Cyan
    Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    npm run dev
} else {
    Write-Host ""
    Write-Host "Ready to start! Run: npm run dev" -ForegroundColor Green
    Write-Host ""
}
