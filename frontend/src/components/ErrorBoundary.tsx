/**
 * React Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the component tree and:
 * - Displays fallback UI
 * - Logs error information
 * - Provides recovery options
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @module components/ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ============================================
// INTERFACES
// ============================================

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ============================================
// ERROR BOUNDARY COMPONENT
// ============================================

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error information
    this.logError(error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  logError(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ERROR BOUNDARY]', errorData);
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (Sentry, Rollbar, etc.)
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      
      // Or send to your backend
      this.sendErrorToBackend(errorData);
    }
  }

  async sendErrorToBackend(errorData: any) {
    try {
      await fetch('/api/errors/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      });
    } catch (err) {
      console.error('Failed to send error to backend:', err);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
              </svg>
            </div>

            <h1 className="error-boundary-title">Something went wrong</h1>
            
            <p className="error-boundary-message">
              We're sorry, but something unexpected happened. The error has been logged and we'll look into it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-boundary-stack">
                  <p><strong>Error:</strong> {this.state.error.toString()}</p>
                  <pre>{this.state.error.stack}</pre>
                  {this.state.errorInfo && (
                    <>
                      <p><strong>Component Stack:</strong></p>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              <button 
                onClick={this.handleReset}
                className="error-boundary-button error-boundary-button-primary"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="error-boundary-button error-boundary-button-secondary"
              >
                Go to Home
              </button>
            </div>
          </div>

          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
            }

            .error-boundary-container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              max-width: 600px;
              width: 100%;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              text-align: center;
            }

            .error-boundary-icon {
              color: #ef4444;
              margin-bottom: 20px;
            }

            .error-boundary-icon svg {
              width: 64px;
              height: 64px;
            }

            .error-boundary-title {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
              margin: 0 0 16px 0;
            }

            .error-boundary-message {
              font-size: 16px;
              color: #6b7280;
              line-height: 1.6;
              margin: 0 0 24px 0;
            }

            .error-boundary-details {
              text-align: left;
              background: #f3f4f6;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
              cursor: pointer;
            }

            .error-boundary-details summary {
              font-weight: 600;
              color: #374151;
              outline: none;
            }

            .error-boundary-stack {
              margin-top: 12px;
              font-size: 14px;
            }

            .error-boundary-stack p {
              margin: 8px 0;
              color: #1f2937;
            }

            .error-boundary-stack pre {
              background: #1f2937;
              color: #f3f4f6;
              padding: 12px;
              border-radius: 6px;
              overflow-x: auto;
              font-size: 12px;
              line-height: 1.5;
            }

            .error-boundary-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-top: 24px;
            }

            .error-boundary-button {
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              border: none;
              cursor: pointer;
              transition: all 0.2s;
            }

            .error-boundary-button-primary {
              background: #667eea;
              color: white;
            }

            .error-boundary-button-primary:hover {
              background: #5568d3;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .error-boundary-button-secondary {
              background: #e5e7eb;
              color: #374151;
            }

            .error-boundary-button-secondary:hover {
              background: #d1d5db;
              transform: translateY(-2px);
            }

            @media (max-width: 640px) {
              .error-boundary-container {
                padding: 30px 20px;
              }

              .error-boundary-title {
                font-size: 24px;
              }

              .error-boundary-actions {
                flex-direction: column;
              }

              .error-boundary-button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
