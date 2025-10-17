# Quick Email Setup - Just Copy & Paste!

## 🎯 Super Quick Setup (2 minutes)

### Step 1: Get Your App Password (1 minute)
1. Click: https://myaccount.google.com/apppasswords
2. Select: **Mail** → **Other (LogiSync)** → **Generate**
3. Copy the 16-character password (e.g., `abcdefghijklmnop`)

### Step 2: Add to .env File (30 seconds)
1. Open: `backend\.env` in your editor
2. Scroll to the bottom
3. **Copy and paste these 5 lines:**

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=YOUR_EMAIL@gmail.com
SMTP_PASS=YOUR_APP_PASSWORD_HERE
SMTP_FROM="LogiSync <noreply@logisync.com>"
```

4. **Replace:**
   - `YOUR_EMAIL@gmail.com` with your Gmail address
   - `YOUR_APP_PASSWORD_HERE` with the 16-char password (no spaces!)

5. **Save the file** (Ctrl+S)

### Step 3: Restart Server (30 seconds)
```powershell
# In backend terminal, press Ctrl+C to stop
# Then run:
npm start
```

## ✅ Done! Test it:
1. Go to: http://localhost:5173/register
2. Register a new user
3. **Check your Gmail inbox** - You should get a verification email!

---

## 📋 Example (Real Values)

If your email is `mukesh@gmail.com` and app password is `abcd efgh ijkl mnop`:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mukesh@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="LogiSync <noreply@logisync.com>"
```

**Note:** Remove spaces from app password!

---

## 🆘 Troubleshooting

**No App Password option?**
→ Enable 2FA first: https://myaccount.google.com/security

**"Invalid credentials" error?**
→ Make sure you copied the app password correctly (no spaces)

**Still using console logs?**
→ Check if .env file is saved and server restarted

**Emails in spam?**
→ Mark as "Not Spam" - future emails will go to inbox

---

That's it! 🎉 Your real emails should now be working!
