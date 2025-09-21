# Automated Supabase Edge Function Deployment Script
# Ensure Docker is running and you are logged in to Supabase CLI

# Optional: Start Docker Desktop (if not already running)
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait for Docker to be ready (optional, adjust as needed)
Start-Sleep -Seconds 20

# Deploy the function
supabase functions deploy capture-razorpay-payment

# Check deployment status
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful."
} else {
    Write-Host "Deployment failed. Check permissions and Docker status."
}
