# Post-Deployment Verification Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$backendUrl = "https://shreevid-backend-709824347872.us-central1.run.app"
$frontendUrl = "https://shreevid.prioritytechnologiess.com"

# Test 1: Frontend Accessibility
Write-Host "🌐 Testing Frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: LIVE (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 2: Backend Health Check
Write-Host "`n🏥 Testing Backend Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$backendUrl/api/health" -TimeoutSec 10
    Write-Host "✅ Backend Health: $($healthResponse.status.ToUpper())" -ForegroundColor Green
    Write-Host "   Environment: $($healthResponse.environment)" -ForegroundColor Gray
    Write-Host "   Database: $($healthResponse.checks.database.status)" -ForegroundColor Gray
    Write-Host "   Memory Used: $($healthResponse.checks.memory.usage.heapUsed)MB" -ForegroundColor Gray
    Write-Host "   Uptime: $($healthResponse.checks.uptime.formatted)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend Health: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 3: Test Endpoint
Write-Host "`n🧪 Testing API Endpoints..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri "$backendUrl/api/test/health" -TimeoutSec 10
    Write-Host "✅ Test Endpoint: OK" -ForegroundColor Green
    Write-Host "   Service: $($testResponse.service)" -ForegroundColor Gray
    Write-Host "   RunwayML: $($testResponse.components.runwayML)" -ForegroundColor Gray
    Write-Host "   Google TTS: $($testResponse.components.googleTTS)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Test Endpoint: FAILED" -ForegroundColor Red
}

# Test 4: CORS Configuration
Write-Host "`n🔒 Testing CORS..." -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = $frontendUrl
    }
    $corsResponse = Invoke-WebRequest -Uri "$backendUrl/api/test/health" -Headers $headers -UseBasicParsing -TimeoutSec 10
    $accessControlOrigin = $corsResponse.Headers["Access-Control-Allow-Origin"]
    if ($accessControlOrigin) {
        Write-Host "✅ CORS: Configured correctly" -ForegroundColor Green
        Write-Host "   Allowed Origin: $accessControlOrigin" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  CORS: Headers not found (may need backend restart)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ CORS: Check failed" -ForegroundColor Red
}

# Test 5: Database Connectivity (via stats endpoint)
Write-Host "`n💾 Testing Database Connectivity..." -ForegroundColor Yellow
try {
    $statsResponse = Invoke-RestMethod -Uri "$backendUrl/api/test/stats" -TimeoutSec 10
    Write-Host "✅ Database: Connected" -ForegroundColor Green
    Write-Host "   Total Users: $($statsResponse.totalUsers)" -ForegroundColor Gray
    Write-Host "   Total Projects: $($statsResponse.totalProjects)" -ForegroundColor Gray
    Write-Host "   Total Credits Distributed: $($statsResponse.totalCreditsDistributed)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Database Stats: Unable to fetch (may require auth)" -ForegroundColor Yellow
}

# Test 6: Response Times
Write-Host "`n⚡ Testing Response Times..." -ForegroundColor Yellow
$endpoints = @(
    @{ Name = "Frontend"; Url = $frontendUrl },
    @{ Name = "Backend Health"; Url = "$backendUrl/api/health" },
    @{ Name = "Test Endpoint"; Url = "$backendUrl/api/test/health" }
)

foreach ($endpoint in $endpoints) {
    try {
        $start = Get-Date
        $null = Invoke-WebRequest -Uri $endpoint.Url -UseBasicParsing -TimeoutSec 10
        $duration = ((Get-Date) - $start).TotalMilliseconds
        
        if ($duration -lt 1000) {
            Write-Host "✅ $($endpoint.Name): ${duration}ms" -ForegroundColor Green
        } elseif ($duration -lt 3000) {
            Write-Host "⚠️  $($endpoint.Name): ${duration}ms (acceptable)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ $($endpoint.Name): ${duration}ms (slow)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $($endpoint.Name): Timeout or error" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   VERIFICATION COMPLETE" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📊 Summary:" -ForegroundColor White
Write-Host "   Frontend URL: $frontendUrl" -ForegroundColor Gray
Write-Host "   Backend URL:  $backendUrl" -ForegroundColor Gray
Write-Host "`n💡 Next Steps:" -ForegroundColor White
Write-Host "   1. Test user login/signup" -ForegroundColor Gray
Write-Host "   2. Verify credit balance display" -ForegroundColor Gray
Write-Host "   3. Test video generation" -ForegroundColor Gray
Write-Host "   4. Check responsive design on mobile" -ForegroundColor Gray
Write-Host "   5. Test payment flow`n" -ForegroundColor Gray
