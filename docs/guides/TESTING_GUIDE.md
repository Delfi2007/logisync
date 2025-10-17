# 🧪 Quick Testing Guide - Email Verification System

## Prerequisites
```bash
# Make sure backend and frontend are running
cd backend
npm start

# In another terminal
cd ..
npm run dev
```

## Test 1: Password Reset Flow (5 minutes)

1. **Request Reset:**
   - Go to http://localhost:5173/forgot-password
   - Enter: `test@example.com`
   - Click "Send Reset Link"
   - ✅ Should see "Check Your Email" message

2. **Check Console:**
   ```bash
   # In backend terminal, look for:
   [Email Service] Sending email in development mode:
   To: test@example.com
   Subject: Reset Your Password
   
   # Copy the reset URL, looks like:
   http://localhost:5173/reset-password?token=abc123...
   ```

3. **Reset Password:**
   - Paste URL in browser
   - Enter new password: `NewPass123!`
   - Watch password strength indicator update
   - ✅ All 4 requirements should have checkmarks
   - Click "Reset Password"
   - ✅ See success message
   - ✅ Auto-redirect to login after 3 seconds

4. **Verify:**
   - Login with new password
   - ✅ Should work!

## Test 2: Email Verification Flow (5 minutes)

1. **Register New User:**
   - Go to http://localhost:5173/register
   - Fill in:
     - First Name: John
     - Last Name: Doe
     - Email: john@example.com
     - Password: Test123!
     - Phone: (optional)
   - Click "Register"
   - ✅ Should create account and login

2. **Check Console for Verification Email:**
   ```bash
   # In backend terminal:
   [Email Service] Sending email in development mode:
   To: john@example.com
   Subject: Verify Your Email Address
   
   # Copy the verification URL:
   http://localhost:5173/verify-email?token=xyz789...
   ```

3. **Verify Email:**
   - Paste URL in browser (or open in new tab)
   - ✅ See "Verifying Your Email" spinner
   - ✅ See "Email Verified! 🎉" success message
   - ✅ See countdown "Redirecting in 3 seconds..."
   - ✅ Auto-redirect to login

4. **Check Welcome Email:**
   ```bash
   # In backend terminal:
   [Email Service] Sending email in development mode:
   To: john@example.com
   Subject: Welcome to LogiSync!
   ```

## Test 3: Verification Banner (3 minutes)

### Setup: Create Unverified User
```bash
# Option A: Register and don't verify
# Just register a new user and skip the verification step

# Option B: Manually update database
# psql -U postgres -d logisync
UPDATE users SET is_verified = false WHERE email = 'john@example.com';
```

### Test Banner:
1. Login as unverified user
2. ✅ Orange banner should appear at top
3. ✅ Shows: "Verify your email address"
4. ✅ Shows email: john@example.com
5. Click "Resend Email"
6. ✅ See "Email sent!" success message
7. ✅ Button changes to "Resend in 60s"
8. ✅ Countdown decreases each second
9. Check console for new verification email
10. Click X button to dismiss
11. ✅ Banner disappears

## Test 4: Error Cases (3 minutes)

### Expired Token
```bash
# Visit with fake token
http://localhost:5173/verify-email?token=invalid123
```
✅ Should show red error message

### Already Verified
```bash
# Use same verification token twice
# First time: Success
# Second time: "Email already verified" message
```

### Invalid Reset Token
```bash
# Visit with fake token
http://localhost:5173/reset-password?token=fake456
```
✅ Should show "Invalid or expired" error

## Test 5: Resend Rate Limiting (2 minutes)

1. Show verification banner
2. Click "Resend Email" 
3. ✅ See "Email sent!" 
4. ✅ Button shows "Resend in 60s"
5. Try clicking again
6. ✅ Button is disabled
7. Wait 60 seconds
8. ✅ Button becomes "Resend Email" again
9. Click again
10. ✅ Works and resets countdown

## Expected Console Output

### Successful Password Reset Email:
```
[Email Service] Sending email in development mode:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: test@example.com
Subject: Reset Your Password
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Full HTML email content...]

Reset Link: http://localhost:5173/reset-password?token=abc123...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Successful Verification Email:
```
[Email Service] Sending email in development mode:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: john@example.com
Subject: Verify Your Email Address
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Full HTML email content...]

Verification Link: http://localhost:5173/verify-email?token=xyz789...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Welcome Email (After Verification):
```
[Email Service] Sending email in development mode:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: john@example.com
Subject: Welcome to LogiSync!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Full HTML email content with welcome message and features]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Common Issues & Solutions

### Issue: "Failed to send email"
**Solution:** Check if backend is running and SMTP is configured (or using dev mode)

### Issue: Token not found in URL
**Solution:** Make sure you copied the FULL URL including `?token=...` from console

### Issue: "Invalid or expired token"
**Solutions:**
- Token expired (24h for verification, 1h for reset)
- Token already used
- Copy token correctly from console

### Issue: Banner doesn't show
**Solutions:**
- User is already verified
- Check user.is_verified in database
- Hard refresh browser (Ctrl+Shift+R)

### Issue: No email in console
**Solutions:**
- Check backend terminal (not frontend)
- Verify email service is initialized
- Check for error messages in console

## Success Criteria Checklist

After testing, verify:
- [ ] Password reset email appears in console
- [ ] Reset password page works with token
- [ ] Password strength indicator updates correctly
- [ ] Auto-redirect works after password reset
- [ ] Can login with new password
- [ ] Password changed notification sent
- [ ] Verification email sent on registration
- [ ] Verification page validates token
- [ ] Welcome email sent after verification
- [ ] Verified users don't see banner
- [ ] Unverified users see banner
- [ ] Resend verification works
- [ ] 60-second rate limiting works
- [ ] Error states show correctly
- [ ] All pages have beautiful UI
- [ ] All icons and animations work

## Next Steps

✅ **All tests passed?** 
   → Ready to merge to main!

❌ **Found issues?**
   → Report bugs and we'll fix them

🚀 **Want to test with real emails?**
   → Configure SMTP in backend/.env

📧 **Want to see beautiful emails?**
   → Copy HTML from console and open in browser

---

**Estimated Testing Time:** 15-20 minutes
**Difficulty:** Easy
**Status:** Ready to test! 🧪
