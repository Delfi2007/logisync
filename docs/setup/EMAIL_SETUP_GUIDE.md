# 📧 Gmail SMTP Configuration Guide

## Option 1: Automated Setup (Recommended)

Run the PowerShell configuration script:

```powershell
# From LogiSync root directory
.\configure-email.ps1
```

The script will:
1. ✅ Prompt for your Gmail address
2. ✅ Prompt for App Password
3. ✅ Backup your existing .env file
4. ✅ Add email configuration automatically

---

## Option 2: Manual Setup

### Step 1: Generate Gmail App Password

1. **Visit:** https://myaccount.google.com/apppasswords
2. **Login** to your Google Account
3. **Select app:** Mail
4. **Select device:** Other (Custom name)
5. **Enter name:** LogiSync
6. **Click Generate**
7. **Copy the 16-character password** (format: `xxxx xxxx xxxx xxxx`)

### Step 2: Update `.env` File

Open `backend/.env` and add these lines at the end:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="LogiSync <noreply@logisync.com>"
```

**Replace:**
- `your-email@gmail.com` → Your actual Gmail address
- `your-16-char-app-password` → The app password from Step 1 (remove spaces)

**Example:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mukesh@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="LogiSync <noreply@logisync.com>"
```

### Step 3: Restart Backend Server

```powershell
# Stop current server (Ctrl+C in backend terminal)
cd backend
npm start
```

---

## Option 3: Use Mailtrap (For Testing)

If you don't want to use your real Gmail account, use Mailtrap:

1. **Sign up:** https://mailtrap.io/ (free)
2. **Get credentials** from your inbox settings
3. **Update `.env`:**

```bash
# Email Configuration (Mailtrap)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
SMTP_FROM="LogiSync <noreply@logisync.com>"
```

**Benefits:**
- ✅ No real emails sent
- ✅ View emails in Mailtrap inbox
- ✅ Test HTML rendering
- ✅ Safe for development

---

## 🧪 Testing Email Configuration

### Test 1: Password Reset Email

1. Start backend: `cd backend; npm start`
2. Start frontend: `npm run dev`
3. Go to: http://localhost:5173/forgot-password
4. Enter your email → Submit
5. **Check your email inbox** (or Mailtrap)
6. Click reset link in email
7. ✅ Should work!

### Test 2: Verification Email

1. Go to: http://localhost:5173/register
2. Register new account
3. **Check your email inbox** (or Mailtrap)
4. Click verification link
5. ✅ Should verify successfully!

---

## 🔧 Troubleshooting

### Issue: "Invalid credentials"
**Solutions:**
- ✅ Make sure you're using **App Password**, not your regular Gmail password
- ✅ Remove any spaces from the app password
- ✅ Regenerate app password if needed

### Issue: "Less secure app access"
**Solution:** This is outdated. Use App Password instead (requires 2FA enabled)

### Issue: No emails arriving
**Check:**
1. ✅ Spam folder
2. ✅ Backend console for error messages
3. ✅ SMTP credentials are correct
4. ✅ Internet connection
5. ✅ Gmail account is active

### Issue: "Connection timeout"
**Solutions:**
- ✅ Check firewall settings (allow port 587)
- ✅ Try port 465 with SSL instead
- ✅ Check antivirus isn't blocking

### Issue: Backend console shows errors
**Common errors:**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
→ Wrong credentials, regenerate App Password

Error: Greeting never received
→ Wrong SMTP host/port, use smtp.gmail.com:587

Error: self signed certificate
→ Add: SMTP_SECURE=false to .env
```

---

## 📝 Complete `.env` Example

Here's how your complete `backend/.env` should look:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logisync_dev
DB_USER=postgres
DB_PASSWORD='Mukesh#198316'

# JWT Configuration
JWT_SECRET=c8d77d6060e5ee9699184597995e89ae85ad75e2c98d18055c0bd37705d8556b
JWT_REFRESH_SECRET=2984df15afedd547f252c4d0f180a0310e41947bd05c1fe7d525ba9658d51eaf
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Frontend URL (for password reset emails)
FRONTEND_URL=http://localhost:5173

# Bcrypt Configuration
BCRYPT_ROUNDS=10

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="LogiSync <noreply@logisync.com>"
```

---

## ✅ Success Checklist

After configuration, verify:
- [ ] App Password generated from Google
- [ ] `.env` file updated with SMTP settings
- [ ] Backend server restarted
- [ ] Password reset email received
- [ ] Verification email received
- [ ] Links in emails work correctly
- [ ] HTML templates render properly
- [ ] Welcome email sent after verification

---

## 🚀 Quick Start Commands

```powershell
# Option A: Run automated script
.\configure-email.ps1

# Option B: Edit .env manually
notepad backend\.env
# Add email configuration, save, restart server

# Option C: Use VS Code
code backend\.env
# Add email configuration, save, restart server
```

---

## 📞 Need Help?

If you're stuck:
1. Check backend console for specific error messages
2. Verify Gmail App Password setup
3. Try Mailtrap instead for testing
4. Check firewall/antivirus settings
5. Ensure 2FA is enabled on Gmail account

---

**Estimated Time:** 5-10 minutes
**Difficulty:** Easy
**Required:** Gmail account with 2FA enabled
