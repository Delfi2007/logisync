# 🔧 Password Reset Testing Steps

## Current Issue Resolution

**Problem:** Password reset was failing with "An error occurred"

**Root Causes Found:**
1. ❌ Backend validator requires `confirmPassword` field
2. ❌ Error messages not being extracted correctly

**Fixes Applied:**
1. ✅ Added `confirmPassword` to API request
2. ✅ Improved error message handling
3. ✅ Added better error logging

---

## 🧪 Test Password Reset (Step-by-Step)

### Step 1: Clear Browser Cache
```
Press: Ctrl + Shift + Delete
Clear: Cached images and files
Or just do a hard refresh: Ctrl + Shift + R
```

### Step 2: Request Password Reset
1. Go to: http://localhost:5173/forgot-password
2. Enter email of an existing user
3. Click "Send Reset Link"
4. ✅ Should see "Check Your Email" message

### Step 3: Check Your Email
Open Gmail inbox: **mukeshkumar.cse24@gmail.com**
- ✉️ Subject: "Reset Your Password"
- 🔗 Copy the reset link

### Step 4: Open Reset Link
Paste the URL in browser, should look like:
```
http://localhost:5173/reset-password?token=21cb3ba2...
```

### Step 5: Enter New Password
**Test with this password:** `Test123!@#`

This password meets all requirements:
- ✅ At least 8 characters
- ✅ Contains uppercase (T)
- ✅ Contains lowercase (est)
- ✅ Contains number (123)
- ✅ Contains special char (!@#)

### Step 6: Submit
1. Enter password: `Test123!@#`
2. Confirm password: `Test123!@#`
3. Watch password strength indicator turn green
4. See all 4 checkmarks in requirements
5. Click "Reset Password"

### Step 7: Expected Results
✅ **Success state appears:**
- Green checkmark icon
- "Password Reset Successfully!"
- Countdown: "Redirecting to login in 3 seconds..."
- Auto-redirect to login page

✅ **Email notification:**
- Check inbox for "Your Password Was Changed" email

✅ **Can login:**
- Go to login page
- Use email + new password `Test123!@#`
- Should successfully login

---

## 🐛 If Still Failing

### Check Browser Console
Press F12 → Console tab

Look for:
```
Reset password error: {error details}
```

### Check Backend Console
Look in your backend terminal for:
```
Reset password error: {error message}
Validation failed: {validation errors}
```

### Common Issues & Solutions

**Issue: "Invalid token format"**
- Solution: Token must be at least 32 characters
- Check: URL has full token (no truncation)

**Issue: "Passwords do not match"**
- Solution: confirmPassword must equal password
- Fixed: Now sending both in request

**Issue: "Token expired"**
- Solution: Tokens expire after 1 hour
- Action: Request new reset email

**Issue: "Token already used"**
- Solution: Each token can only be used once
- Action: Request new reset email

**Issue: "Invalid or expired reset token"**
- Possible causes:
  1. Token doesn't exist in database
  2. Token has expired (>1 hour old)
  3. Database table doesn't exist
- Action: Check database has password_reset_tokens table

---

## 🔍 Debug Commands

### Check if token exists in database:
```sql
-- Run in PostgreSQL
SELECT * FROM password_reset_tokens 
WHERE token = 'YOUR_TOKEN_HERE' 
ORDER BY created_at DESC;
```

### Check token expiry:
```sql
SELECT 
  token,
  user_id,
  created_at,
  expires_at,
  used_at,
  CASE 
    WHEN used_at IS NOT NULL THEN 'USED'
    WHEN expires_at < NOW() THEN 'EXPIRED'
    ELSE 'VALID'
  END as status
FROM password_reset_tokens 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check if table exists:
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'password_reset_tokens'
);
```

---

## 📊 What Should Happen

### Request Flow:
```
1. User submits email
   ↓
2. Backend generates 32-byte token
   ↓
3. Token saved to password_reset_tokens table
   ↓
4. Email sent with reset link
   ↓
5. User clicks link
   ↓
6. Frontend extracts token from URL
   ↓
7. User enters new password
   ↓
8. Frontend sends: { token, password, confirmPassword }
   ↓
9. Backend validates:
   - Token exists and not expired
   - Token not already used
   - Password meets requirements
   - Password matches confirmPassword
   ↓
10. Backend updates user password
    ↓
11. Backend marks token as used
    ↓
12. Backend sends "password changed" email
    ↓
13. Frontend shows success + redirects
```

---

## ✅ Success Indicators

When working correctly, you should see:

**Browser Console:**
- No errors
- API call returns 200 status

**Backend Console:**
```
[Email Service] Email sent successfully via SMTP
Password reset successful for user: {email}
```

**Database:**
```sql
-- Token should be marked as used
SELECT used_at FROM password_reset_tokens 
WHERE token = 'YOUR_TOKEN';
-- Should show timestamp, not NULL
```

**Email Inbox:**
- Password reset email received
- Password changed notification received

**Login:**
- Old password doesn't work
- New password works successfully

---

## 🎯 Quick Test

**Fastest way to test:**

1. Open forgot password page
2. Enter email
3. Copy reset link from Gmail
4. Paste in browser
5. Enter password: `Test123!@#` (twice)
6. Click reset
7. Should see success + redirect
8. Login with new password

**Time:** 2-3 minutes

---

## 📞 Still Not Working?

**Share these details:**
1. Browser console error (F12 → Console)
2. Backend terminal error
3. Network tab response (F12 → Network → reset-password)
4. Token from URL
5. Password you're trying to use

---

*Last Updated: After commit eabcad1*
*Status: Should be working now with confirmPassword fix*
