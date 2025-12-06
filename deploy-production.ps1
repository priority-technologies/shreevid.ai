# Production Deployment Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   SHREEVID.AI - PRODUCTION DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "📦 Building Frontend..." -ForegroundColor Yellow
Set-Location c:\Users\prior\.claude\ide\frontend
$env:VITE_API_BASE_URL="https://shreevid-backend-709824347872.us-central1.run.app/api"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully`n" -ForegroundColor Green

# 2. Deploy Frontend to GCS
Write-Host "☁️  Deploying Frontend to GCS..." -ForegroundColor Yellow
Set-Location c:\Users\prior\.claude\ide\frontend\dist
gcloud storage rsync . gs://shreevid-frontend-prod --recursive --delete-unmatched-destination-objects
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend deployed to GCS`n" -ForegroundColor Green

# 3. Invalidate CDN Cache
Write-Host "🔄 Invalidating CDN Cache..." -ForegroundColor Yellow
gcloud compute url-maps invalidate-cdn-cache shreevid-frontend-map --path "/*" --async
Write-Host "✅ CDN cache invalidation initiated`n" -ForegroundColor Green

# 4. Deploy Backend to Cloud Run
Write-Host "🚀 Deploying Backend to Cloud Run..." -ForegroundColor Yellow
Set-Location c:\Users\prior\.claude\ide\backend
gcloud run deploy shreevid-backend `
    --source . `
    --region us-central1 `
    --platform managed `
    --allow-unauthenticated `
    --memory 512Mi `
    --cpu 1 `
    --timeout 300 `
    --max-instances 10 `
    --project shreevid-ai-prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend deployed to Cloud Run`n" -ForegroundColor Green

# 5. Verify Deployment
Write-Host "🔍 Verifying Deployment..." -ForegroundColor Yellow
$backendUrl = "https://shreevid-backend-709824347872.us-central1.run.app/api/test/health"
try {
    $health = Invoke-RestMethod -Uri $backendUrl
    Write-Host "✅ Backend Health Check: OK" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Backend health check failed (may need time to start)" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Frontend: https://shreevid.prioritytechnologiess.com" -ForegroundColor White
Write-Host "Backend:  https://shreevid-backend-709824347872.us-central1.run.app`n" -ForegroundColor White
