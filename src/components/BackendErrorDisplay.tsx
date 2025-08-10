import React from 'react';
import { AlertTriangle, RefreshCw, ExternalLink, LogOut } from 'lucide-react';
import Button from './Button';

interface BackendErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onSignOut?: () => void;
  className?: string;
}

const BackendErrorDisplay: React.FC<BackendErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  onSignOut,
  className = '' 
}) => {
  const getErrorDetails = (errorMessage: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (errorMessage.includes('Backend URL not configured')) {
      return {
        title: 'Backend Not Configured',
        description: 'The backend URL environment variable is missing.',
        solution: 'Create a .env.local file with VITE_API_BASE_URL=https://your-backend.netlify.app/.netlify/functions',
        backendIssue: 'Frontend configuration issue - not a backend problem.'
      };
    }
    
    if (errorMessage.includes('Network error') || errorMessage.includes('fetch')) {
      return {
        title: 'Cannot Connect to Backend',
        description: 'Unable to reach the backend server.',
        solution: `Check if the backend is accessible at: ${apiBaseUrl}`,
        backendIssue: 'Backend may be down, incorrect URL, or CORS not configured for localhost:5173'
      };
    }
    
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return {
        title: 'Backend Endpoints Missing',
        description: 'The backend endpoints are not found.',
        solution: 'Verify that all Netlify Functions are deployed correctly.',
        backendIssue: 'Missing Netlify Functions. Check deployment status and function names.'
      };
    }
    
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return {
        title: 'Authentication Token Expired',
        description: 'Your authentication token has expired and needs to be refreshed.',
        solution: 'Sign out and sign back in to get a fresh authentication token.',
        backendIssue: 'Firebase token expired (tokens expire after ~1 hour). Frontend needs token refresh mechanism.'
      };
    }
    
    if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
      return {
        title: 'Backend Server Error',
        description: 'The backend encountered an internal error.',
        solution: 'Check Netlify Function logs for detailed error information.',
        backendIssue: 'Backend code error. Check Netlify Function logs in dashboard.'
      };
    }
    
    return {
      title: 'Backend Communication Error',
      description: errorMessage,
      solution: 'Check backend status and configuration.',
      backendIssue: 'Unknown backend issue. Check all backend endpoints and configuration.'
    };
  };

  const errorDetails = getErrorDetails(error);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const isAuthError = error.includes('401') || error.includes('Unauthorized');

  return (
    <div className={`bg-red-600/20 border border-red-500/30 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            {errorDetails.title}
          </h3>
          
          <p className="text-red-300 mb-4">
            {errorDetails.description}
          </p>
          
          <div className="bg-red-900/30 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-red-300 mb-2">For Backend Developer:</h4>
            <p className="text-sm text-red-200 mb-2">
              <strong>Issue:</strong> {errorDetails.backendIssue}
            </p>
            {apiBaseUrl && (
              <p className="text-sm text-red-200 mb-2">
                <strong>Backend URL:</strong> {apiBaseUrl}
              </p>
            )}
            <p className="text-sm text-red-200">
              <strong>Solution:</strong> {errorDetails.solution}
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {isAuthError && onSignOut && (
              <Button
                onClick={onSignOut}
                variant="secondary"
                size="sm"
                className="border-red-500/50 hover:border-red-400/50 bg-red-600/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out & Try Again
              </Button>
            )}
            
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="secondary"
                size="sm"
                className="border-red-500/50 hover:border-red-400/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            )}
            
            {apiBaseUrl && apiBaseUrl !== 'mock' && (
              <Button
                onClick={() => window.open(`${apiBaseUrl.replace('/.netlify/functions', '')}/`, '_blank')}
                variant="secondary"
                size="sm"
                className="border-red-500/50 hover:border-red-400/50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Check Backend
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendErrorDisplay;