@echo off
REM Shreevid AI - Complete Deployment Script
REM This script builds and deploys the backend to Google Cloud Run

setlocal enabledelayedexpansion

set Region=us-central1
set ProjectId=shreevid-ai-prod
set ServiceName=shreevid-backend
set RepositoryName=shreevid-docker

set ImageTag=shreevid-backend:latest
set RegistryUrl=us-central1-docker.pkg.dev
set FullImagePath=%RegistryUrl%/%ProjectId%/%RepositoryName%/%ImageTag%

echo.
echo ====================================================
echo  Shreevid AI - Backend Deployment to Cloud Run
echo ====================================================
echo.
echo Deployment Configuration:
echo    Project ID:       %ProjectId%
echo    Region:           %Region%
echo    Service Name:     %ServiceName%
echo    Repository:       %RepositoryName%
echo    Full Image Path:  %FullImagePath%
echo.

REM Step 1: Verify Dockerfile exists
echo Verifying deployment files...
if not exist "Dockerfile" (
    echo ERROR: Dockerfile not found!
    exit /b 1
)
if not exist "backend\.env.production" (
    echo ERROR: backend\.env.production not found!
    exit /b 1
)
echo    OK: All required files found
echo.

REM Step 2: Build Docker image
echo Building Docker image...
echo    Image tag: %ImageTag%
docker build -t %ImageTag% -f Dockerfile .

if errorlevel 1 (
    echo ERROR: Docker build failed!
    exit /b 1
)

echo    OK: Docker image built successfully
echo.

REM Step 3: Tag image for Artifact Registry
echo Tagging image for Artifact Registry...
docker tag %ImageTag% %FullImagePath%

if errorlevel 1 (
    echo ERROR: Docker tag failed!
    exit /b 1
)

echo    OK: Image tagged: %FullImagePath%
echo.

REM Step 4: Push to Artifact Registry
echo Pushing image to Artifact Registry...
docker push %FullImagePath%

if errorlevel 1 (
    echo ERROR: Docker push failed!
    exit /b 1
)

echo    OK: Image pushed to Artifact Registry
echo.

REM Step 5: Deploy to Cloud Run
echo Deploying to Cloud Run...
echo    Service: %ServiceName%
echo    Region:  %Region%

gcloud run deploy %ServiceName% ^
    --image=%FullImagePath% ^
    --region=%Region% ^
    --platform=managed ^
    --allow-unauthenticated ^
    --memory=512Mi ^
    --cpu=1 ^
    --timeout=300 ^
    --max-instances=10 ^
    --project=%ProjectId%

if errorlevel 1 (
    echo ERROR: Cloud Run deployment failed!
    exit /b 1
)

echo    OK: Service deployed to Cloud Run
echo.

REM Step 6: Get service URL
echo Getting service URL...
for /f %%i in ('gcloud run services describe %ServiceName% --region=%Region% --platform=managed --project=%ProjectId% --format="value(status.url)"') do set ServiceUrl=%%i

echo.
echo ====================================================
echo           DEPLOYMENT SUCCESSFUL!
echo ====================================================
echo.
echo Backend is now live!
echo.
echo Service Details:
echo    URL:     %ServiceUrl%
echo    Service: %ServiceName%
echo    Region:  %Region%
echo.
echo Next Steps:
echo    1. Update BACKEND_URL in frontend with: %ServiceUrl%
echo    2. Deploy frontend to Cloud Storage
echo    3. Configure DNS subdomain
echo.
echo Test the backend:
echo    curl %ServiceUrl%/api/health
echo.

REM Save service URL to file
echo %ServiceUrl% > backend-url.txt
echo Service URL saved to: backend-url.txt
echo.

endlocal
