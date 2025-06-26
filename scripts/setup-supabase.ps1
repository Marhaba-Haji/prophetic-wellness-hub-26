# Supabase CLI Setup Script
# This script helps install and configure Supabase CLI for your project

Write-Host "Supabase CLI Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Check if Supabase CLI is already installed
Write-Host "Checking if Supabase CLI is installed..." -ForegroundColor Yellow
try {
    $version = supabase --version
    Write-Host "Supabase CLI is already installed: $version" -ForegroundColor Green
} catch {
    Write-Host "Supabase CLI not found. Installing..." -ForegroundColor Yellow
    
    # Try different installation methods
    
    # Method 1: Try Scoop
    try {
        Write-Host "Attempting to install via Scoop..." -ForegroundColor Yellow
        scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
        scoop install supabase
        Write-Host "Successfully installed via Scoop!" -ForegroundColor Green
    } catch {
        Write-Host "Scoop installation failed, trying direct download..." -ForegroundColor Yellow
        
        # Method 2: Direct download
        try {
            $downloadUrl = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.exe"
            $localPath = "$env:USERPROFILE\supabase.exe"
            
            Write-Host "Downloading Supabase CLI..." -ForegroundColor Yellow
            Invoke-WebRequest -Uri $downloadUrl -OutFile $localPath
            
            # Add to PATH temporarily
            $env:PATH += ";$env:USERPROFILE"
            
            # Test installation
            $testVersion = & $localPath --version
            Write-Host "Successfully installed: $testVersion" -ForegroundColor Green
            
            Write-Host "`nIMPORTANT: Add this to your PowerShell profile to make it permanent:" -ForegroundColor Yellow
            Write-Host "`$env:PATH += `";$env:USERPROFILE`"" -ForegroundColor White
            
        } catch {
            Write-Host "Direct download failed. Please install manually:" -ForegroundColor Red
            Write-Host "1. Visit: https://github.com/supabase/cli/releases" -ForegroundColor White
            Write-Host "2. Download supabase_windows_amd64.exe" -ForegroundColor White
            Write-Host "3. Rename to supabase.exe and add to your PATH" -ForegroundColor White
            exit 1
        }
    }
}

# Check if we can access Supabase CLI
try {
    $version = supabase --version
    Write-Host "Supabase CLI is ready: $version" -ForegroundColor Green
} catch {
    Write-Host "Supabase CLI is not accessible. Please restart your terminal or add to PATH." -ForegroundColor Red
    exit 1
}

# Check project configuration
Write-Host "`nChecking project configuration..." -ForegroundColor Yellow

if (Test-Path "supabase/config.toml") {
    Write-Host "Project config found: supabase/config.toml" -ForegroundColor Green
    
    # Read project ID
    $configContent = Get-Content "supabase/config.toml"
    $projectId = ($configContent | Select-String "project_id = ").ToString().Split("=")[1].Trim().Trim('"')
    Write-Host "Project ID: $projectId" -ForegroundColor Cyan
} else {
    Write-Host "No project config found. You'll need to link to your project." -ForegroundColor Yellow
}

# Check migrations
if (Test-Path "supabase/migrations") {
    $migrationCount = (Get-ChildItem "supabase/migrations" -Filter "*.sql").Count
    Write-Host "Found $migrationCount migration files" -ForegroundColor Green
} else {
    Write-Host "No migrations directory found" -ForegroundColor Yellow
}

Write-Host "`nSetup completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Login to Supabase: supabase login" -ForegroundColor White
Write-Host "2. Link to your project: supabase link --project-ref YOUR_PROJECT_ID" -ForegroundColor White
Write-Host "3. Check status: supabase status" -ForegroundColor White 