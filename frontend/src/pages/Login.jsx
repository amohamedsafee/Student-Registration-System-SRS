import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button, Input } from '../components/ui';
import useAuth from '../features/auth/hooks/useAuth';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        const dest = location.state?.from?.pathname || '/admin';
        navigate(dest, { replace: true });
      } else {
        const dest = location.state?.from?.pathname || '/dashboard';
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@llc.edu.lk');
    setPassword('AdminPass2026!');
    setErrorMessage(null);
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar />

      <main className="llc-container py-16 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="eyebrow">
              Student & Staff Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-[#182B5E]">
              Account <em>Sign In</em>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A6B8C]">
              Access your registrations and review application progress
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white border-[3px] border-[#182B5E] shadow-[8px_8px_0px_0px_#182B5E] p-8 space-y-5"
          >
            {errorMessage && (
              <div
                id="login-error-banner"
                className="p-3 border-2 border-[#D9381E] bg-[#FEE2E2] flex items-center gap-2 text-xs font-bold text-[#D9381E]"
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              id="login-email"
              type="email"
              label="Email Address"
              required
              placeholder="e.g. admin@llc.edu.lk or student@llc.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconLeading={<Mail size={16} />}
            />

            <Input
              id="login-password"
              type="password"
              label="Password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconLeading={<Lock size={16} />}
            />

            <div className="flex items-center justify-between text-xs pt-1 font-bold text-[#5A6B8C]">
              <button
                type="button"
                onClick={handleFillAdmin}
                className="text-xs font-black text-[#182B5E] underline flex items-center gap-1 hover:text-[#D9381E]"
              >
                <Shield size={13} />
                <span>Quick-fill Admin Credentials</span>
              </button>
              <Link to="/forgot-password" className="text-[#D9381E] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              id="login-submit-button"
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={loading}
              iconTrailing={<LogIn size={16} />}
            >
              Sign In
            </Button>

            <div className="pt-4 border-t-2 border-[#182B5E] text-center text-xs font-semibold text-[#5A6B8C]">
              <span>New student applying for 2026? </span>
              <Link
                to="/register"
                className="text-[#D9381E] font-black uppercase tracking-wider hover:underline inline-flex items-center gap-1 ml-1"
              >
                <span>Apply online</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
