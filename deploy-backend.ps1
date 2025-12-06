# Shreevid AI - Backend Deployment to Google Cloud Run
# This script deploys the backend service

Write-Host "🚀 Deploying Shreevid AI Backend to Cloud Run..." -ForegroundColor Cyan
Write-Host ""

# Set project
$PROJECT_ID = "shreevid-ai-prod"
$SERVICE_NAME = "shreevid-backend"
$REGION = "us-central1"

Write-Host "📦 Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "🌍 Region: $REGION" -ForegroundColor Yellow
Write-Host "🔧 Service: $SERVICE_NAME" -ForegroundColor Yellow
Write-Host ""

# Check if .env file exists
if (-not (Test-Path "backend\.env.production")) {
    Write-Host "❌ Error: backend\.env.production file not found!" -ForegroundColor Red
    Write-Host "Please create it from .env.production.template" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green
Write-Host ""

# Build and deploy to Cloud Run
Write-Host "🔨 Building and deploying to Cloud Run..." -ForegroundColor Cyan

gcloud run deploy $SERVICE_NAME --source . --region $REGION --platform managed --allow-unauthenticated --memory 512Mi --cpu 1 --timeout 300 --max-instances 10 --env-vars-file backend/.env.production --project $PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your backend is now live!" -ForegroundColor Cyan
    Write-Host "📋 Run 'gcloud run services describe $SERVICE_NAME --region $REGION' to get the URL" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the errors above and try again." -ForegroundColor Yellow
    exit 1
}
