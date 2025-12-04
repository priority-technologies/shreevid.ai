# Start Shreevid AI Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Shreevid AI Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Add FFmpeg to PATH
$env:Path += ";C:\ffmpeg\bin"

# Navigate to backend directory
Set-Location "C:\Users\prior\.claude\ide\backend"

# Start the server
Write-Host "`nStarting Node.js server..." -ForegroundColor Yellow
node server.js

# Keep window open if there's an error
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nServer stopped with error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
