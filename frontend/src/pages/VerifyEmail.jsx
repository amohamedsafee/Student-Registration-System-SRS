import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Spinner } from '../components/ui';
import authApi from '../features/auth/api/authApi';
import { CheckCircle2, AlertCircle, ArrowRight, MailCheck } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleVerify = async () => {
    if (!token) {
      setErrorMessage('Missing verification token in URL. Please click the full link in your email.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await authApi.verifyEmail(token);
      setSuccess(true);
      setMessage(res.message || 'Email verified successfully!');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired verification token.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify if token is present on mount
  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token]);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-16 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="eyebrow">
              Official Email Verification
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-[#182B5E]">
              Account <span className="text-[#D9381E]">Verification</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A6B8C]">
              Validating your student portal communication address
            </p>
          </div>

          <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 text-center space-y-5">
            {loading ? (
              <div className="py-8 space-y-3">
                <Spinner size="lg" variant="navy" />
                <p className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
                  Verifying Token with Server...
                </p>
              </div>
            ) : success ? (
              <div className="space-y-4">
                <div className="w-14 h-14 border-2 border-[#182B5E] bg-[#116530] text-white flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#182B5E]">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-black text-[#182B5E]">Email Verified</h3>
                <p className="text-xs font-semibold text-[#5A6B8C] leading-relaxed">
                  {message || 'Your email address has been verified. You may now sign in and track your admissions status.'}
                </p>
                <div className="pt-4 border-t-2 border-[#182B5E]">
                  <Link to="/login" className="btn-primary inline-flex text-xs w-full" iconTrailing={<ArrowRight size={14} />}>
                    Sign In to Portal
                  </Link>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="space-y-4">
                <div className="w-14 h-14 border-2 border-[#182B5E] bg-[#D9381E] text-white flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#182B5E]">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-xl font-black text-[#182B5E]">Verification Failed</h3>
                <p className="text-xs font-semibold text-[#D9381E] bg-[#FFF5F5] p-3 border-2 border-[#D9381E]">
                  {errorMessage}
                </p>
                <p className="text-xs text-[#5A6B8C] font-semibold">
                  Verification links are single-use and expire after 24 hours. Sign in to your account to request a fresh link.
                </p>
                <div className="pt-4 border-t-2 border-[#182B5E] flex gap-3">
                  <Link to="/login" className="btn-primary inline-flex text-xs flex-1">
                    Sign In
                  </Link>
                  <Link to="/courses" className="btn-secondary inline-flex text-xs flex-1">
                    Catalog
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 border-2 border-[#182B5E] bg-[#F7F9FC] text-[#182B5E] flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#182B5E]">
                  <MailCheck size={28} />
                </div>
                <h3 className="text-xl font-black text-[#182B5E]">Confirm Email</h3>
                <p className="text-xs font-semibold text-[#5A6B8C]">
                  Click the button below to confirm your email verification token.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleVerify}
                >
                  Confirm Verification
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
