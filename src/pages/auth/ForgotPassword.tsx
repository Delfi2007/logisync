/**
 * Forgot Password Page
 * Allows users to request a password reset email
 */

import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Loader2, Package, CheckCircle, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Call forgot password endpoint
      await apiClient.post('/auth/forgot-password', { email });
      
      // Show success state
      setSuccess(true);
    } catch (err: any) {
      // Don't reveal if email exists for security
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  // Success state - show confirmation
  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-xl mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-neutral-600">
              We've sent password reset instructions
            </p>
          </div>

          {/* Success Card */}
          <div className="card p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-2">
                Email Sent Successfully
              </h2>
              <p className="text-neutral-600 text-sm mb-4">
                If an account exists for <strong>{email}</strong>, you will receive 
                password reset instructions shortly.
              </p>
              <p className="text-neutral-500 text-xs">
                The reset link will expire in 1 hour for security reasons.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">
                What to do next:
              </h3>
              <ol className="text-sm text-neutral-600 space-y-2">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <span>Check your email inbox (and spam folder)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <span>Click the "Reset Password" button in the email</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <span>Enter your new password</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">4.</span>
                  <span>Sign in with your new password</span>
                </li>
              </ol>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            {/* Resend Option */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setSuccess(false)}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-neutral-600 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-neutral-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Form state - show email input
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-xl mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-neutral-600">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Enter the email address associated with your account
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-neutral-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
