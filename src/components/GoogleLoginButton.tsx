import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface GoogleLoginButtonProps {
  onSuccess?: (user: { name: string; email: string }) => void;
}

export default function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps = {}) {
  const { login } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        login(data.user);
        if (onSuccess) {
          onSuccess({ name: data.user.name, email: data.user.email });
        }
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Authentication failed on server.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus('error');
      setErrorMessage('Network error occurred during login.');
    }
  };

  const handleError = () => {
    setStatus('error');
    setErrorMessage('Google Sign-In was cancelled or failed.');
  };

  if (status === 'loading') {
    return (
      <div className="w-full py-3.5 bg-neutral-900 border border-neutral-800 rounded-xs flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-white animate-spin" />
        <span className="font-sans text-[11px] text-white font-medium uppercase tracking-widest">
          Verifying...
        </span>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full py-3.5 bg-green-950/30 border border-green-900/50 rounded-xs flex items-center justify-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />
        <span className="font-sans text-[11px] text-green-400 font-medium uppercase tracking-widest">
          Login Successful
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {status === 'error' && (
        <div className="flex items-start gap-2 p-3 bg-red-950/20 border border-red-900/40 rounded-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300 font-sans leading-relaxed">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_black"
          shape="rectangular"
          text="continue_with"
          size="large"
          width="320"
        />
      </div>
    </div>
  );
}
