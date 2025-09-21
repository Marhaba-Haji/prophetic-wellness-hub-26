# Automated Supabase Edge Functions Deployment Script
param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectRef = "zywvlznelzpoixnrzwqk"
)

Write-Host "Starting Supabase Edge Functions deployment..." -ForegroundColor Green

# Check if Docker is running
$docker = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
if ($null -eq $docker) {
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Waiting for Docker to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

# Update Supabase CLI
Write-Host "Updating Supabase CLI..." -ForegroundColor Yellow
scoop update supabase

# Ensure we're logged in to Supabase
Write-Host "Checking Supabase login..." -ForegroundColor Yellow
try {
    supabase functions list --project-ref $ProjectRef 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Not logged in to Supabase. Please run 'supabase login' first." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Not logged in to Supabase. Please run 'supabase login' first." -ForegroundColor Red
    exit 1
}

# Link project if not already linked
Write-Host "Linking Supabase project..." -ForegroundColor Yellow
supabase link --project-ref $ProjectRef

# Deploy the Edge Function
Write-Host "Deploying Edge Function..." -ForegroundColor Yellow
supabase functions deploy capture-razorpay-payment --project-ref $ProjectRef

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your function is available at: https://$ProjectRef.supabase.co/functions/v1/capture-razorpay-payment" -ForegroundColor Cyan
} else {
    Write-Host "Deployment failed. Please check the error messages above." -ForegroundColor Red
}
