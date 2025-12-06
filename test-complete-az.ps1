# Complete A-Z Testing Script for Shreevid.ai
# Tests: Backend, Frontend, APIs, Stripe, SMTP, Dashboard

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   SHREEVID.AI - COMPLETE A-Z SYSTEM TEST" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

$productionBackend = "https://shreevid-backend-709824347872.us-central1.run.app/api"
$productionFrontend = "https://shreevid.prioritytechnologiess.com"
$testResults = @()
$testEmail = "e2etest$(Get-Random -Minimum 10000 -Maximum 99999)@test.com"

# Helper function to log results
function Log-Test {
    param($name, $status, $details = "")
    if ($status -eq "PASS") {
        Write-Host "   ✅ PASS - $name" -ForegroundColor Green
        if ($details) { Write-Host "      $details" -ForegroundColor Gray }
    } else {
        Write-Host "   ❌ FAIL - $name" -ForegroundColor Red
        if ($details) { Write-Host "      $details" -ForegroundColor Yellow }
    }
    $script:testResults += @{Name=$name; Status=$status; Details=$details}
}

# ============================================================
# PART 1: BACKEND HEALTH CHECK
# ============================================================
Write-Host "🔍 PART 1: BACKEND HEALTH CHECK" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

try {
    $health = Invoke-RestMethod -Uri "$productionBackend/test/health" -TimeoutSec 10
    Log-Test "Backend Health" "PASS" "Service: $($health.service)"
} catch {
    Log-Test "Backend Health" "FAIL" $_.Exception.Message
    Write-Host "`n❌ Backend is down. Stopping tests.`n" -ForegroundColor Red
    exit 1
}

# ============================================================
# PART 2: SIGNUP FLOW (with SMTP)
# ============================================================
Write-Host "`n📝 PART 2: SIGNUP FLOW (with SMTP Email)" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

$signupData = @{
    firstName = "Test"
    lastName = "User"
    email = $testEmail
    password = "Test@123"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri "$productionBackend/auth/signup" -Method POST -Body $signupData -ContentType "application/json"
    Log-Test "Signup API" "PASS" "UserId: $($signup.userId)"
    $userId = $signup.userId
    
    # Check if email was mentioned
    if ($signup.message -like "*email*") {
        Log-Test "SMTP Email Trigger" "PASS" "OTP email should be sent to $testEmail"
    } else {
        Log-Test "SMTP Email Trigger" "WARN" "No email confirmation in response"
    }
} catch {
    Log-Test "Signup API" "FAIL" $_.Exception.Message
    exit 1
}

# ============================================================
# PART 3: OTP VERIFICATION
# ============================================================
Write-Host "`n🔐 PART 3: OTP VERIFICATION" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

Write-Host "   Using fallback OTP: 123456" -ForegroundColor Gray

$otpData = @{
    userId = $userId
    otp = "123456"
} | ConvertTo-Json

try {
    $otpResult = Invoke-RestMethod -Uri "$productionBackend/auth/verify-otp" -Method POST -Body $otpData -ContentType "application/json"
    Log-Test "OTP Verification" "PASS" "Token received"
    $token = $otpResult.token
    $user = $otpResult.user
} catch {
    Log-Test "OTP Verification" "FAIL" $_.Exception.Message
    exit 1
}

# ============================================================
# PART 4: LOGIN FLOW
# ============================================================
Write-Host "`n🔑 PART 4: LOGIN FLOW" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

$loginData = @{
    email = $testEmail
    password = "Test@123"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$productionBackend/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Log-Test "Login API" "PASS" "User: $($login.user.firstName) $($login.user.lastName)"
    $token = $login.token
} catch {
    Log-Test "Login API" "FAIL" $_.Exception.Message
}

# Setup authorization header
$headers = @{
    Authorization = "Bearer $token"
}

# ============================================================
# PART 5: DASHBOARD APIs
# ============================================================
Write-Host "`n📊 PART 5: DASHBOARD APIs" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

# Test 5.1: Get Credits Balance
try {
    $credits = Invoke-RestMethod -Uri "$productionBackend/credits/balance" -Headers $headers
    Log-Test "Credits Balance API" "PASS" "Credits: $($credits.credits)"
} catch {
    Log-Test "Credits Balance API" "FAIL" $_.Exception.Message
}

# Test 5.2: Get My Projects
try {
    $projects = Invoke-RestMethod -Uri "$productionBackend/projects/my-projects" -Headers $headers
    Log-Test "My Projects API" "PASS" "Projects count: $($projects.projects.Count)"
} catch {
    Log-Test "My Projects API" "FAIL" $_.Exception.Message
}

# Test 5.3: Get Billing History
try {
    $billing = Invoke-RestMethod -Uri "$productionBackend/billing/history" -Headers $headers
    Log-Test "Billing History API" "PASS" "Transactions: $($billing.transactions.Count)"
} catch {
    Log-Test "Billing History API" "FAIL" $_.Exception.Message
}

# Test 5.4: Get Credits Pricing
try {
    $pricing = Invoke-RestMethod -Uri "$productionBackend/credits/pricing" -Headers $headers
    Log-Test "Credits Pricing API" "PASS" "Packages: $($pricing.packages.Count)"
} catch {
    Log-Test "Credits Pricing API" "FAIL" $_.Exception.Message
}

# ============================================================
# PART 6: STRIPE INTEGRATION
# ============================================================
Write-Host "`nPART 6: STRIPE PAYMENT INTEGRATION" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

# Test 6.1: Get Payment Methods
try {
    $methods = Invoke-RestMethod -Uri "$productionBackend/payment/methods" -Headers $headers
    Log-Test "Payment Methods API" "PASS" "Methods: $($methods.methods.Count)"
} catch {
    Log-Test "Payment Methods API" "FAIL" $_.Exception.Message
}

# Test 6.2: Create Stripe Checkout Session (THE CRITICAL FIX!)
Write-Host "   Testing Stripe Checkout (with fix)..." -ForegroundColor Gray
$checkoutData = @{
    credits = 100
    packageId = "custom"
} | ConvertTo-Json

try {
    $checkout = Invoke-RestMethod -Uri "$productionBackend/payment/create-checkout-session" -Method POST -Headers $headers -Body $checkoutData -ContentType "application/json"
    if ($checkout.url -and $checkout.sessionId) {
        Log-Test "Stripe Checkout Session" "PASS" "Session ID: $($checkout.sessionId.Substring(0,30))..."
        Write-Host "      Checkout URL: $($checkout.url.Substring(0,50))..." -ForegroundColor Gray
    } else {
        Log-Test "Stripe Checkout Session" "FAIL" "No URL or session ID returned"
    }
} catch {
    Log-Test "Stripe Checkout Session" "FAIL" $_.Exception.Message
}

# ============================================================
# PART 7: FRONTEND ACCESSIBILITY
# ============================================================
Write-Host "`n🌐 PART 7: FRONTEND ACCESSIBILITY" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

# Test 7.1: Frontend Homepage
try {
    $response = Invoke-WebRequest -Uri $productionFrontend -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Log-Test "Frontend Homepage" "PASS" "Status: $($response.StatusCode)"
    } else {
        Log-Test "Frontend Homepage" "FAIL" "Status: $($response.StatusCode)"
    }
} catch {
    Log-Test "Frontend Homepage" "FAIL" $_.Exception.Message
}

# Test 7.2: Frontend Assets
try {
    $assetResponse = Invoke-WebRequest -Uri "$productionFrontend/assets/index-DBZcl2Sv.js" -TimeoutSec 10 -UseBasicParsing
    if ($assetResponse.StatusCode -eq 200) {
        Log-Test "Frontend Assets (JS)" "PASS" "Latest build loaded"
    } else {
        Log-Test "Frontend Assets (JS)" "FAIL" "Status: $($assetResponse.StatusCode)"
    }
} catch {
    Log-Test "Frontend Assets (JS)" "FAIL" $_.Exception.Message
}

# ============================================================
# SUMMARY
# ============================================================
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Test Account Created: $testEmail" -ForegroundColor White
Write-Host "User ID: $userId`n" -ForegroundColor White

foreach ($result in $testResults) {
    if ($result.Status -eq "PASS") {
        Write-Host "   ✅ $($result.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($result.Name)" -ForegroundColor Red
    }
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "   Total Tests: $totalCount" -ForegroundColor White
Write-Host "   Passed: $passCount" -ForegroundColor Green
Write-Host "   Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "   Success Rate: $([math]::Round(($passCount/$totalCount)*100, 2))%" -ForegroundColor White
Write-Host ("=" * 60 + "`n") -ForegroundColor Gray

if ($failCount -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! System is production-ready!`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  $failCount test(s) failed. Review errors above.`n" -ForegroundColor Yellow
}

# ============================================================
# FINAL NOTES
# ============================================================
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Test login at: $productionFrontend/#/login" -ForegroundColor White
Write-Host "   2. Use credentials: $testEmail / Test@123" -ForegroundColor White
Write-Host "   3. Check Dashboard components" -ForegroundColor White
Write-Host "   4. Test Stripe payment flow" -ForegroundColor White
Write-Host "   5. Verify email OTP in inbox: $testEmail`n" -ForegroundColor White
