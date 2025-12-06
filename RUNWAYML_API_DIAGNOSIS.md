# 🚨 RunwayML API - Critical Issue Diagnosis

**Date**: December 6, 2025  
**Status**: ❌ **NOT WORKING** - 401 Unauthorized

---

## 🔍 Problem Identified

### API Key Issue
- **Error Code**: `401 Unauthorized`
- **API Key Format**: ✅ Valid format (132 characters, starts with `key_`)
- **API Endpoint**: `https://api.runwayml.com/v1`
- **Headers**: Correctly formatted with Bearer authentication

### Test Results
```
❌ GET https://api.runwayml.com/v1/tasks - 401 Unauthorized
❌ GET https://api.runwayml.com/v1/user - 401 Unauthorized
❌ GET https://api.dev.runwayml.com/v1 - 404 Not Found
```

---

## 🎯 Root Cause

The API key is **NOT ACTIVATED** or **NOT AUTHORIZED** to access the RunwayML API.

### Possible Reasons:
1. ⚠️ **Billing Not Set Up** - API keys require active billing/payment method
2. ⚠️ **Key Not Activated** - New keys may need manual activation
3. ⚠️ **Credit Limit Reached** - No credits available (even for testing)
4. ⚠️ **Sandbox vs Production** - Key might be for sandbox, not production API
5. ⚠️ **Account Issue** - RunwayML account may need verification

---

## ✅ What You Need to Do IMMEDIATELY

### Step 1: Login to RunwayML Dashboard
**URL**: https://runwayml.com/account or https://app.runwayml.com

### Step 2: Verify API Key Status
1. Go to **Settings** → **API Keys**
2. Check if the key is marked as "Active" or "Enabled"
3. Look for any warning messages or status indicators

### Step 3: Check Billing & Credits
1. Navigate to **Billing** section
2. Verify:
   - ✅ Payment method is added
   - ✅ Billing is active (not suspended)
   - ✅ You have available credits ($5 you purchased)
3. If no payment method → **Add credit card**
4. If billing is suspended → **Resolve payment issue**

### Step 4: Regenerate API Key (If Needed)
If the key shows issues:
1. **Delete** the current API key
2. **Create new API key**
3. Copy the new key immediately
4. Update in our system

### Step 5: Check Account Verification
- Verify your email is confirmed
- Check if account needs additional verification
- Look for any pending actions in dashboard

---

## 🔧 How to Update API Key in Our System

### Method 1: Via Environment Variable (Cloud Run)
```bash
gcloud run services update shreevid-backend \
  --region=us-central1 \
  --update-env-vars="RUNWAYML_API_KEY=NEW_KEY_HERE"
```

### Method 2: Via .env File (Then Redeploy)
Update `backend/.env.production`:
```
RUNWAYML_API_KEY=NEW_KEY_HERE
```

Then redeploy:
```bash
cd backend
gcloud run deploy shreevid-backend --source . --region us-central1 --project shreevid-ai-prod
```

---

## 📋 Verification Checklist

After fixing the API key:

- [ ] API key is marked as "Active" in RunwayML dashboard
- [ ] Billing is active with payment method added
- [ ] Credits are available (showing balance > $0)
- [ ] No warning/error messages in RunwayML dashboard
- [ ] Account email is verified
- [ ] Test API call returns 200 OK (not 401)

---

## 🧪 Test Command (After Fixing)

Run this PowerShell command to test the NEW key:

```powershell
$newKey = "YOUR_NEW_KEY_HERE"
$headers = @{ 
  "Authorization" = "Bearer $newKey"
  "Content-Type" = "application/json"
}

# Test endpoint
Invoke-RestMethod -Uri "https://api.runwayml.com/v1/tasks" -Method GET -Headers $headers
```

**Expected Result**: Should return task list (could be empty) with status 200, NOT 401.

---

## 💡 Alternative Solutions

### If RunwayML API Continues to Fail:

#### Option A: Use Different API
- **Replicate**: https://replicate.com (easier to use, similar pricing)
- **Stability AI**: For image-to-video generation
- **Luma Labs**: Dream Machine API

#### Option B: Contact RunwayML Support
- Email: support@runwayml.com
- Dashboard: Look for "Help" or "Support" button
- Explain: "New API key getting 401 errors despite active billing"

#### Option C: Temporary Workaround
- Use mock/demo videos while fixing API
- Show users "Coming Soon" for video generation
- Focus on other features (TTS works fine)

---

## 📊 Current System Status

### ✅ Working Components:
- Backend deployed: `shreevid-backend-00017-ck5`
- Frontend deployed: `index-BjVoyL7W.js`
- Database: MongoDB working
- Google TTS: Working
- Stripe: Working
- User auth: Working
- Pricing: Updated and live

### ❌ NOT Working:
- **RunwayML Video Generation** - 401 Unauthorized
- This is the ONLY blocking issue for video creation

---

## 🎯 Priority Action

**THIS MUST BE FIXED BEFORE PLATFORM CAN GENERATE VIDEOS**

1. **Check RunwayML Dashboard NOW**
2. **Add payment method if missing**
3. **Verify billing is active**
4. **Get new API key if needed**
5. **Test new key**
6. **Update in Cloud Run**
7. **Test video generation**

---

## 📞 Need Help?

If you can't resolve this:
1. Share screenshot of RunwayML dashboard (API Keys section)
2. Share screenshot of Billing section
3. Share any error messages from RunwayML
4. I can guide you step-by-step

---

**Bottom Line**: The API key is not authorized. You MUST go into the RunwayML dashboard and fix the billing/activation issue. Without this, videos cannot be generated. Everything else is ready and working perfectly.
