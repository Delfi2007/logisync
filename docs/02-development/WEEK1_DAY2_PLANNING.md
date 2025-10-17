# 🚀 Phase 5 - Week 1 - Day 2: Advanced Authentication Features

**Date**: October 17, 2025  
**Status**: Starting Development  
**Branch**: Create `phase5/week1-day2-advanced-auth`

---

## 📋 Day 1 Recap - COMPLETED ✅

### What We Built
- ✅ Complete JWT authentication backend (11 endpoints)
- ✅ Multi-role RBAC system (5 roles, permissions)
- ✅ Database migrations (7 new tables)
- ✅ Frontend authentication integration
- ✅ Token refresh mechanism
- ✅ Activity logging
- ✅ Password hashing with bcrypt
- ✅ All tests passing (15/15)
- ✅ Tested in browser
- ✅ Merged to main

### Current Features Working
1. ✅ User registration
2. ✅ User login/logout
3. ✅ Token refresh
4. ✅ Protected routes
5. ✅ Password change (for logged-in users)
6. ✅ Forgot password (token generation)
7. ✅ Reset password (with token)
8. ✅ Activity logging
9. ✅ Profile endpoint (/me)
10. ✅ Token verification
11. ✅ Multi-role support

---

## 🎯 Day 2 Goals

### Features to Build Today

#### 1. Email Verification System ⭐ **Priority 1**
**Backend** (Already exists, just needs frontend):
- ✅ Email verification token generation
- ✅ Database table: `email_verification_tokens`
- ✅ Endpoint: `POST /api/auth/verify-email` (to implement)
- ⏳ Email sending service (to implement)

**Frontend** (Need to build):
- Email verification page
- Resend verification email
- Verification success/error states
- Email verification banner

**Time Estimate**: 2-3 hours

---

#### 2. Password Reset UI ⭐ **Priority 2**
**Backend** (Already exists):
- ✅ Endpoint: `POST /api/auth/forgot-password`
- ✅ Endpoint: `POST /api/auth/reset-password`
- ✅ Database table: `password_reset_tokens`

**Frontend** (Need to build):
- Forgot password page
- Reset password page (with token validation)
- Success/error messages
- Link expiration handling

**Time Estimate**: 1-2 hours

---

#### 3. User Profile Management ⭐ **Priority 3**
**Backend** (Partially exists):
- ✅ Endpoint: `GET /api/auth/me`
- ⏳ Endpoint: `PUT /api/auth/me` (to implement)
- ⏳ Avatar upload endpoint (to implement)

**Frontend** (Need to build):
- Profile view page
- Edit profile form
- Avatar upload
- Update password in profile
- Account settings

**Time Estimate**: 2-3 hours

---

#### 4. Email Service Integration (Supporting)
**Need to implement**:
- Email service configuration
- Email templates
- Send verification emails
- Send password reset emails
- Test email sending

**Time Estimate**: 1-2 hours

---

## 🏗️ Implementation Plan

### Phase 1: Email Verification System (Start Here)

#### Step 1: Create Email Service
```javascript
// backend/src/services/email.service.js
- Configure email provider (Nodemailer)
- Create email templates
- Send verification email
- Send password reset email
- Handle email errors
```

#### Step 2: Add Verify Email Endpoint
```javascript
// backend/src/controllers/auth.controller.js
- Add verifyEmail method
- Validate token
- Mark user as verified
- Return success response
```

#### Step 3: Add Resend Verification Endpoint
```javascript
// backend/src/controllers/auth.controller.js
- Add resendVerification method
- Generate new token
- Send email
- Rate limit (1 per 5 minutes)
```

#### Step 4: Build Frontend Components
```typescript
// src/pages/auth/VerifyEmail.tsx
- Extract token from URL
- Call verify endpoint
- Show success/error states
- Redirect to dashboard

// src/components/EmailVerificationBanner.tsx
- Show banner if not verified
- Resend verification button
- Show countdown between resends
```

---

### Phase 2: Password Reset UI

#### Step 1: Forgot Password Page
```typescript
// src/pages/auth/ForgotPassword.tsx
- Email input form
- Call forgot-password endpoint
- Show success message
- Email sent confirmation
```

#### Step 2: Reset Password Page
```typescript
// src/pages/auth/ResetPassword.tsx
- Extract token from URL
- New password form
- Password strength indicator
- Call reset-password endpoint
- Redirect to login on success
```

---

### Phase 3: User Profile Management

#### Step 1: Backend Endpoints
```javascript
// backend/src/controllers/auth.controller.js
- Add updateProfile method
- Add uploadAvatar method (with multer)
- Validate profile data
- Update user record
```

#### Step 2: Frontend Profile Page
```typescript
// src/pages/Profile.tsx
- Display user information
- Edit mode toggle
- Update form
- Avatar upload with preview
- Change password section
- Account settings
```

---

### Phase 4: Email Service Setup

#### Step 1: Install Dependencies
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

#### Step 2: Configure Email Provider
```javascript
// Options:
1. Gmail (easy for development)
2. SendGrid (production)
3. Mailgun (production)
4. AWS SES (production)
```

#### Step 3: Create Email Templates
```javascript
- Verification email template
- Password reset email template
- Welcome email template
- Password changed notification
```

---

## 📊 Feature Priority

### Must Have (Today)
1. ⭐⭐⭐ Email verification system
2. ⭐⭐⭐ Password reset UI
3. ⭐⭐ Basic profile management

### Nice to Have (Tomorrow)
4. ⭐ Avatar upload
5. ⭐ Account settings
6. Role management UI
7. Activity log viewer

---

## 🎨 UI Components Needed

### New Pages
1. `VerifyEmail.tsx` - Email verification page
2. `ForgotPassword.tsx` - Request password reset
3. `ResetPassword.tsx` - Reset password with token
4. `Profile.tsx` - User profile page
5. `Settings.tsx` - Account settings (optional)

### New Components
1. `EmailVerificationBanner.tsx` - Shows "Verify your email"
2. `AvatarUpload.tsx` - Avatar upload with preview
3. `PasswordStrength.tsx` - Password strength indicator (already have)
4. `ProfileForm.tsx` - Edit profile form
5. `AccountSettings.tsx` - Account settings panel

---

## 📁 File Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── email.service.js         ← NEW
│   │   └── upload.service.js        ← NEW
│   ├── controllers/
│   │   └── auth.controller.js       ← UPDATE (add methods)
│   ├── routes/
│   │   └── auth.routes.js           ← UPDATE (add routes)
│   └── templates/
│       ├── email-verification.html  ← NEW
│       └── password-reset.html      ← NEW

src/
├── pages/
│   ├── auth/
│   │   ├── VerifyEmail.tsx          ← NEW
│   │   ├── ForgotPassword.tsx       ← NEW
│   │   └── ResetPassword.tsx        ← NEW
│   └── Profile.tsx                  ← NEW
├── components/
│   ├── EmailVerificationBanner.tsx  ← NEW
│   ├── AvatarUpload.tsx             ← NEW
│   └── ProfileForm.tsx              ← NEW
└── services/
    └── auth.ts                      ← UPDATE
```

---

## 🧪 Testing Strategy

### Backend Tests
1. Email service tests
   - Send verification email
   - Send password reset email
   - Handle email errors

2. Verification endpoint tests
   - Valid token verification
   - Expired token
   - Invalid token
   - Already verified user

3. Profile update tests
   - Update first/last name
   - Update email (with re-verification)
   - Update phone
   - Avatar upload

### Frontend Tests
1. Email verification flow
   - Click verification link
   - Show success state
   - Show error states
   - Resend verification

2. Password reset flow
   - Request reset email
   - Click reset link
   - Set new password
   - Login with new password

3. Profile management
   - View profile
   - Edit profile
   - Upload avatar
   - Change password

---

## 🔐 Security Considerations

### Email Verification
- ✅ Token expires after 24 hours
- ✅ Token can only be used once
- ✅ Rate limit resend requests (1 per 5 minutes)
- ✅ Don't reveal if email exists

### Password Reset
- ✅ Token expires after 1 hour
- ✅ Token can only be used once
- ✅ Invalidate all sessions on password reset
- ✅ Send notification email after password change

### Profile Updates
- ✅ Require authentication
- ✅ Validate all inputs
- ✅ Rate limit profile updates
- ✅ Re-verify email if changed
- ✅ Sanitize file uploads

---

## 📝 Environment Variables Needed

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=LogiSync <noreply@logisync.com>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_MAX_SIZE=5242880  # 5MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
```

---

## 🚀 Getting Started

### Step 1: Create New Branch
```bash
git checkout -b phase5/week1-day2-advanced-auth
```

### Step 2: Start with Email Verification
We'll build features in this order:
1. Email service setup
2. Verify email endpoint
3. Verification frontend
4. Password reset pages
5. Profile management

### Step 3: Test as We Build
- Test each feature before moving to next
- Ensure all existing tests still pass
- Add new tests for new features

---

## 📊 Success Criteria

### Email Verification
- [ ] User receives verification email on registration
- [ ] User can click link to verify email
- [ ] Verified status shows in profile
- [ ] Can resend verification email
- [ ] Rate limiting works

### Password Reset
- [ ] User can request password reset
- [ ] User receives reset email with link
- [ ] Can set new password with token
- [ ] Old password no longer works
- [ ] New password works for login

### Profile Management
- [ ] User can view their profile
- [ ] User can update name, email, phone
- [ ] User can upload avatar
- [ ] User can change password
- [ ] All updates saved correctly

---

## 🎯 Today's Target

**Goal**: Complete email verification system and password reset UI

**Output**:
- Email service configured and working
- Verification emails sending
- Verification page working
- Forgot password page complete
- Reset password page complete
- All flows tested in browser

**Time**: 4-5 hours (realistic estimate)

---

## 💡 Quick Wins

These are easy features we can add quickly:
1. **Email verification banner** - 30 minutes
2. **Resend verification** - 30 minutes
3. **Forgot password page** - 1 hour
4. **Reset password page** - 1 hour

Total: 3 hours for complete password reset flow!

---

## 🤔 Questions to Decide

Before we start, let's decide:

1. **Email Provider**: Which email service to use?
   - Gmail (easiest for dev)
   - SendGrid (production-ready)
   - Mailgun (production-ready)
   - Other?

2. **File Upload**: Where to store avatars?
   - Local filesystem (simple)
   - AWS S3 (scalable)
   - Cloudinary (easy images)
   - Other?

3. **Email Templates**: How fancy?
   - Plain text (fastest)
   - Simple HTML (recommended)
   - Rich HTML with CSS (nice to have)

---

## 🎨 UI Design Notes

### Verification Email
```
Subject: Verify your LogiSync account

Hi [Name],

Welcome to LogiSync! Please verify your email address.

[Verify Email Button]

Or copy this link: http://localhost:5173/verify-email?token=...

This link expires in 24 hours.

Thanks,
LogiSync Team
```

### Password Reset Email
```
Subject: Reset your LogiSync password

Hi [Name],

You requested to reset your password.

[Reset Password Button]

Or copy this link: http://localhost:5173/reset-password?token=...

This link expires in 1 hour.

If you didn't request this, please ignore this email.

Thanks,
LogiSync Team
```

---

## 📚 Resources

### Email Service Docs
- [Nodemailer](https://nodemailer.com/about/)
- [SendGrid Node.js](https://github.com/sendgrid/sendgrid-nodejs)
- [Mailgun Node.js](https://github.com/mailgun/mailgun-js)

### File Upload Docs
- [Multer](https://github.com/expressjs/multer) - File upload middleware
- [AWS SDK S3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html)
- [Cloudinary Node.js](https://cloudinary.com/documentation/node_integration)

---

## 🎯 Let's Start!

**Ready to begin?** I recommend starting with:

### Option A: Email Verification (Recommended)
- Most important feature
- Required for production
- Good foundation for other email features

### Option B: Password Reset UI
- Quick wins (pages only, backend done)
- Good user experience
- Easy to test

### Option C: Profile Management
- Users will want this
- Good for testing authentication
- Can add features incrementally

**Which would you like to start with?** 🚀

---

*After you choose, I'll create the detailed implementation plan and start building!*
