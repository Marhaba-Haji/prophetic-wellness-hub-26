# Auto Contact Filler PowerShell Script
# This script runs the automated contact form filler to keep Supabase database active

Write-Host "Starting Auto Contact Filler Script..." -ForegroundColor Green
Write-Host "Date: $(Get-Date)" -ForegroundColor Yellow

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir

# Change to project directory
Set-Location $projectDir

# Run the automation script
try {
    npm run auto-contact
    Write-Host "Script completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Script failed with error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Script execution finished at $(Get-Date)" -ForegroundColor Yellow
