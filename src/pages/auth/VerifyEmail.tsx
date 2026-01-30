import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import authService from '@/services/auth';

type VerificationState = 'verifying' | 'success' | 'error' | 'already-verified';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<VerificationState>('verifying');
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setState('error');
      setError('Verification token is missing');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  // Auto-redirect countdown after success
  useEffect(() => {
    if (state === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (state === 'success' && countdown === 0) {
      navigate('/login');
    }
  }, [state, countdown, navigate]);

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      setState('success');
    } catch (err: any) {
      console.error('Verification error:', err);
      
      const errorMessage = err.response?.data?.message || 'Failed to verify email';
      
      if (errorMessage === 'Email already verified') {
        setState('already-verified');
      } else {
        setState('error');
        setError(errorMessage);
      }
    }
  };

  const handleResendVerification = async () => {
    // This would need the user's email - could be passed as another query param
    // or user could enter it manually
    alert('Please login and request a new verification email from your dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Verifying State */}
          {state === 'verifying' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Your Email
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now access all features of LogiSync.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  Redirecting to login in <span className="font-bold">{countdown}</span> seconds...
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                Continue to Login
              </button>
            </div>
          )}

          {/* Already Verified State */}
          {state === 'already-verified' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Already Verified
              </h2>
              <p className="text-gray-600 mb-6">
                Your email has already been verified. You can login to your account.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-4">
                {error}
              </p>

              {/* Error Details */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-900 mb-2">Common Issues:</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Verification link has expired (valid for 24 hours)</li>
                  <li>• Link has already been used</li>
                  <li>• Invalid or tampered verification token</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Request New Verification Email
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 py-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="mailto:support@logisync.com" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
