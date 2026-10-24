import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input } from '../components/ui';
import authApi from '../features/auth/api/authApi';
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Missing password reset token. Please request a new reset link.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired reset token');
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
              Security Update
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-[#182B5E]">
              Set New <em>Password</em>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A6B8C]">
              Create a new secure password for your student portal account
            </p>
          </div>

          {success ? (
            <div className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 text-center space-y-4">
              <div className="w-14 h-14 border-2 border-[#182B5E] bg-[#116530] text-white flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#182B5E]">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-black text-[#182B5E]">Password Updated</h3>
              <p className="text-xs font-semibold text-[#5A6B8C]">
                Your password has been changed successfully. You may now sign in using your new credentials.
              </p>
              <div className="pt-4 border-t-2 border-[#182B5E]">
                <Link to="/login" className="btn-primary inline-flex text-xs w-full" iconTrailing={<ArrowRight size={14} />}>
                  Proceed to Sign In
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

              {!token && (
                <div className="p-3.5 border-2 border-[#F28C28] bg-[#FFFDF5] text-xs font-bold text-[#182B5E]">
                  ⚠️ No token provided in URL. If you received an email, please use the complete link.
                </div>
              )}

              <Input
                id="new-password"
                type="password"
                label="New Password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                iconLeading={<Lock size={16} />}
              />

              <Input
                id="confirm-password"
                type="password"
                label="Confirm New Password"
                required
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                iconLeading={<Lock size={16} />}
              />

              <Button
                id="reset-password-submit"
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={loading}
              >
                Update Password
              </Button>

              <div className="pt-4 border-t-2 border-[#182B5E] text-center">
                <Link to="/login" className="text-xs font-bold text-[#182B5E] hover:text-[#D9381E]">
                  Cancel and Return to Sign In
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
