# Shreevid AI - Complete Deployment Script
# This script builds and deploys the backend to Google Cloud Run

param(
    [string]$Region = "us-central1",
    [string]$ProjectId = "shreevid-ai-prod",
    [string]$ServiceName = "shreevid-backend",
    [string]$RepositoryName = "shreevid-docker"
)

$ErrorActionPreference = "Stop"

# Colors for output
$Green = @{ ForegroundColor = "Green" }
$Yellow = @{ ForegroundColor = "Yellow" }
$Red = @{ ForegroundColor = "Red" }
$Cyan = @{ ForegroundColor = "Cyan" }

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" @Cyan
Write-Host "║     Shreevid AI - Backend Deployment to Cloud Run          ║" @Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" @Cyan
Write-Host ""

# Configuration
$ImageTag = "shreevid-backend:latest"
$RegistryUrl = "$Region-docker.pkg.dev"
$FullImagePath = "$RegistryUrl/$ProjectId/$RepositoryName/$ImageTag"

Write-Host "📋 Deployment Configuration:" @Cyan
Write-Host "   Project ID:       $ProjectId" @Yellow
Write-Host "   Region:           $Region" @Yellow
Write-Host "   Service Name:     $ServiceName" @Yellow
Write-Host "   Repository:       $RepositoryName" @Yellow
Write-Host "   Full Image Path:  $FullImagePath" @Yellow
Write-Host ""

# Step 1: Verify files
Write-Host "🔍 Verifying deployment files..." @Cyan

$requiredFiles = @(
    "Dockerfile",
    ".dockerignore",
    "backend/.env.production",
    "backend/package.json",
    "backend/server.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" @Green
    } else {
        Write-Host "   ❌ $file - NOT FOUND!" @Red
        exit 1
    }
}

Write-Host ""

# Step 2: Build Docker image
Write-Host "🔨 Building Docker image..." @Cyan
Write-Host "   Image tag: $ImageTag" @Yellow

docker build -t $ImageTag -f Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Docker build failed!" @Red
    exit 1
}

Write-Host "   ✅ Docker image built successfully" @Green
Write-Host ""

# Step 3: Tag image for Artifact Registry
Write-Host "🏷️  Tagging image for Artifact Registry..." @Cyan

docker tag $ImageTag $FullImagePath

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Docker tag failed!" @Red
    exit 1
}

Write-Host "   ✅ Image tagged: $FullImagePath" @Green
Write-Host ""

# Step 4: Push to Artifact Registry
Write-Host "📤 Pushing image to Artifact Registry..." @Cyan

docker push $FullImagePath

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Docker push failed!" @Red
    exit 1
}

Write-Host "   ✅ Image pushed to Artifact Registry" @Green
Write-Host ""

# Step 5: Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." @Cyan
Write-Host "   Service: $ServiceName" @Yellow
Write-Host "   Region:  $Region" @Yellow

gcloud run deploy $ServiceName `
    --image=$FullImagePath `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --memory=512Mi `
    --cpu=1 `
    --timeout=300 `
    --max-instances=10 `
    --project=$ProjectId

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Cloud Run deployment failed!" @Red
    exit 1
}

Write-Host "   ✅ Service deployed to Cloud Run" @Green
Write-Host ""

# Step 6: Get service URL
Write-Host "🌐 Getting service URL..." @Cyan

$ServiceUrl = gcloud run services describe $ServiceName `
    --region=$Region `
    --platform=managed `
    --project=$ProjectId `
    --format='value(status.url)'

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" @Green
Write-Host "║            ✅ DEPLOYMENT SUCCESSFUL!                       ║" @Green
Write-Host "╚════════════════════════════════════════════════════════════╝" @Green
Write-Host ""
Write-Host "🎉 Backend is now live!" @Green
Write-Host ""
Write-Host "📋 Service Details:" @Cyan
Write-Host "   URL:     $ServiceUrl" @Yellow
Write-Host "   Service: $ServiceName" @Yellow
Write-Host "   Region:  $Region" @Yellow
Write-Host ""
Write-Host "📝 Next Steps:" @Cyan
Write-Host "   1. Update BACKEND_URL in frontend with: $ServiceUrl" @Yellow
Write-Host "   2. Deploy frontend to Cloud Storage" @Yellow
Write-Host "   3. Configure DNS subdomain" @Yellow
Write-Host ""
Write-Host "🧪 Test the backend:" @Cyan
Write-Host "   curl $ServiceUrl/api/health" @Yellow
Write-Host ""

# Save service URL to file for reference
$ServiceUrl | Out-File "backend-url.txt"
Write-Host "📄 Service URL saved to: backend-url.txt" @Green
Write-Host ""
