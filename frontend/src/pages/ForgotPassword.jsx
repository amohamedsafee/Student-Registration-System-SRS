import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input } from '../components/ui';
import authApi from '../features/auth/api/authApi';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to process password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-16 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="eyebrow">
              Account Recovery
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-[#182B5E]">
              Reset <span className="text-[#D9381E]">Password</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A6B8C]">
              Enter your registered email address to receive reset instructions
            </p>
          </div>

          {submitted ? (
            <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 text-center space-y-4">
              <div className="w-14 h-14 border-2 border-[#182B5E] bg-[#116530] text-white flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#182B5E]">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-black text-[#182B5E]">Check Your Inbox</h3>
              <p className="text-xs font-semibold text-[#5A6B8C] leading-relaxed">
                If an account exists for <strong className="text-[#182B5E]">{email}</strong>, you will receive an email containing a secure, single-use password reset link.
              </p>
              <div className="pt-4 border-t-2 border-[#182B5E]">
                <Link to="/login" className="btn-primary inline-flex text-xs w-full">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 space-y-5"
            >
              {errorMessage && (
                <div className="p-3.5 border-2 border-[#D9381E] bg-[#FFF5F5] flex items-center gap-2 text-xs font-bold text-[#D9381E]">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                id="reset-email"
                type="email"
                label="Registered Email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                iconLeading={<Mail size={16} />}
                hint="We will send a one-time reset link valid for 1 hour"
              />

              <Button
                id="forgot-password-submit"
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={loading}
                iconTrailing={<KeyRound size={16} />}
              >
                Send Reset Instructions
              </Button>

              <div className="pt-4 border-t-2 border-[#182B5E] text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#182B5E] hover:text-[#D9381E]"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
