# Start Shreevid AI Frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Shreevid AI Frontend (React)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location "C:\Users\prior\.claude\ide\frontend"

# Start the development server
Write-Host "`nStarting React development server..." -ForegroundColor Yellow
npm run dev

# Keep window open if there's an error
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nServer stopped with error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
