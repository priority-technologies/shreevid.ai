# Comprehensive API Testing Script
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "   SHREEVID.AI - API AUTOMATED TESTING" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000/api"
$testResults = @()

# Test 1: Signup
Write-Host "📝 TEST 1: Signup..." -ForegroundColor Yellow
$testEmail = "test$(Get-Random -Minimum 10000 -Maximum 99999)@test.com"
$signupData = @{
    firstName = "Test"
    lastName = "User"
    email = $testEmail
    password = "Test@123"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method POST -Body $signupData -ContentType "application/json"
    Write-Host "   ✅ PASS - Signup successful" -ForegroundColor Green
    $userId = $signup.userId
    $testResults += "PASS: Signup"
} catch {
    Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "FAIL: Signup"
    exit 1
}

# Test 2: OTP Verification
Write-Host "`n🔐 TEST 2: OTP Verification..." -ForegroundColor Yellow
$otpData = @{
    userId = $userId
    otp = "123456"
} | ConvertTo-Json

try {
    $otpResult = Invoke-RestMethod -Uri "$baseUrl/auth/verify-otp" -Method POST -Body $otpData -ContentType "application/json"
    Write-Host "   ✅ PASS - OTP verification successful" -ForegroundColor Green
    $token = $otpResult.token
    $testResults += "PASS: OTP Verification"
} catch {
    Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "FAIL: OTP Verification"
}

# Test 3: Login
Write-Host "`n🔑 TEST 3: Login..." -ForegroundColor Yellow
$loginData = @{
    email = $testEmail
    password = "Test@123"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "   ✅ PASS - Login successful" -ForegroundColor Green
    $testResults += "PASS: Login"
} catch {
    Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "FAIL: Login"
}

# Setup headers for protected routes
$headers = @{
    Authorization = "Bearer $token"
}

# Test 4: Get Credits Balance
Write-Host "`n💰 TEST 4: Get Credits Balance..." -ForegroundColor Yellow
try {
    $credits = Invoke-RestMethod -Uri "$baseUrl/credits/balance" -Headers $headers
    Write-Host "   ✅ PASS - Credits: $($credits.credits)" -ForegroundColor Green
    $testResults += "PASS: Credits Balance"
} catch {
    Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "FAIL: Credits Balance"
}

# Test 5: Get My Projects
Write-Host "`n📁 TEST 5: Get My Projects..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$baseUrl/projects/my-projects" -Headers $headers
    Write-Host "   ✅ PASS - Projects count: $($projects.projects.Count)" -ForegroundColor Green
    $testResults += "PASS: My Projects"
} catch {
    Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "FAIL: My Projects"
}

# Test 6: Get Payment Methods
Write-Host "`n💳 TEST 6: Get Payment Methods..." -ForegroundColor Yellow
try {
    $methods = Invoke-RestMethod -Uri "$baseUrl/payment/methods" -Headers $headers
    Write-Host "   ✅ PASS - Available methods: $($methods.methods.Count)" -ForegroundColor Green
    $testResults += "PASS: Payment Methods"
} catch {
    Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "FAIL: Payment Methods"
}

# Test 7: Create Stripe Checkout
Write-Host "`n🛒 TEST 7: Create Stripe Checkout..." -ForegroundColor Yellow
$checkoutData = @{
    credits = 100
    packageId = "custom"
} | ConvertTo-Json

try {
    $checkout = Invoke-RestMethod -Uri "$baseUrl/payment/create-checkout-session" -Method POST -Headers $headers -Body $checkoutData -ContentType "application/json"
    Write-Host "   ✅ PASS - Checkout URL: $($checkout.url.Substring(0,40))..." -ForegroundColor Green
    Write-Host "   Session ID: $($checkout.sessionId)" -ForegroundColor Gray
    $testResults += "PASS: Stripe Checkout"
} catch {
    Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "FAIL: Stripe Checkout"
}

# Summary
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "   TEST SUMMARY" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object { $_ -like "PASS*" }).Count
$failCount = ($testResults | Where-Object { $_ -like "FAIL*" }).Count

foreach ($result in $testResults) {
    if ($result -like "PASS*") {
        Write-Host "   ✅ $result" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $result" -ForegroundColor Red
    }
}

Write-Host "`n   Total: $($testResults.Count) tests" -ForegroundColor White
Write-Host "   Passed: $passCount" -ForegroundColor Green
Write-Host "   Failed: $failCount`n" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

if ($failCount -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! Ready for deployment!`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please fix before deployment.`n" -ForegroundColor Yellow
}
