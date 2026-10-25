import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="p-8 border-[3px] border-[#182B5E] bg-white shadow-[8px_8px_0px_0px_#182B5E] text-center space-y-3">
          <Spinner size="lg" variant="navy" />
          <p className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page with target location preserved
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in as non-admin (e.g. Student)
  if (!isAdmin) {
    const handleSwitchToAdmin = async () => {
      await logout();
      navigate('/login', { state: { from: { pathname: '/admin' } } });
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] p-4">
        <div className="max-w-md w-full p-8 border-[3px] border-[#182B5E] bg-white shadow-[8px_8px_0px_0px_#182B5E] text-center space-y-4">
          <div className="inline-block p-2 bg-[#D9381E] text-white border-2 border-[#182B5E] font-black text-xs uppercase tracking-widest">
            Access Restricted
          </div>
          <h2 className="text-2xl font-black text-[#182B5E]">403 Forbidden</h2>
          <p className="text-sm font-semibold text-[#5A6B8C]">
            You are logged in with a student account. The Admin Console is restricted to authorized campus administrators.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              My Student Dashboard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSwitchToAdmin}
            >
              Log In as Administrator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
