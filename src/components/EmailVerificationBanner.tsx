/**
 * Email Verification Banner
 * Shows at the top of pages for users with unverified emails
 * Includes resend functionality with rate limiting
 */

import React, { useState, useEffect } from 'react';
import { Mail, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import authService from '@/services/auth';

interface EmailVerificationBannerProps {
  userEmail: string;
  isVerified: boolean;
  onDismiss?: () => void;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  userEmail,
  isVerified,
  onDismiss
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Don't show banner if verified or dismissed
  if (isVerified || dismissed) {
    return null;
  }

  // Countdown timer for resend rate limiting
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle resend verification email
  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      setSending(true);
      setError('');
      setSent(false);

      await authService.resendVerification(userEmail);

      setSent(true);
      setCountdown(60); // 60 second cooldown

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSent(false);
      }, 5000);
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setError(err.response?.data?.message || 'Failed to send verification email');
      
      // Hide error after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setSending(false);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 border-b border-orange-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex items-center justify-between flex-wrap">
            {/* Left side - Icon and Message */}
            <div className="flex items-center flex-1 min-w-0">
              <span className="flex p-2 rounded-lg bg-white bg-opacity-20">
                <Mail className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
              
              <div className="ml-3 flex-1">
                <p className="text-white font-medium">
                  Verify your email address
                </p>
                <p className="text-orange-100 text-sm">
                  We sent a verification email to <span className="font-semibold">{userEmail}</span>
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3 mt-3 sm:mt-0">
              {/* Success Message */}
              {sent && (
                <div className="flex items-center bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Email sent!
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium max-w-xs">
                  <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{error}</span>
                </div>
              )}

              {/* Resend Button */}
              {!sent && !error && (
                <button
                  onClick={handleResend}
                  disabled={sending || countdown > 0}
                  className="flex items-center bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    <>Resend in {countdown}s</>
                  ) : (
                    <>Resend Email</>
                  )}
                </button>
              )}

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
