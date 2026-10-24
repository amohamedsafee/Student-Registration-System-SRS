import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import Spinner from '../../components/ui/Spinner';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] p-4">
        <div className="max-w-md w-full p-8 border-[3px] border-[#182B5E] bg-white shadow-[8px_8px_0px_0px_#182B5E] text-center space-y-4">
          <div className="inline-block p-2 bg-[#D9381E] text-white border-2 border-[#182B5E] font-black text-xs uppercase tracking-widest">
            Access Restricted
          </div>
          <h2 className="text-2xl font-black text-[#182B5E]">403 Forbidden</h2>
          <p className="text-sm font-semibold text-[#5A6B8C]">
            This portal is restricted to authorized campus administrators only.
          </p>
          <a href="/" className="btn-primary inline-flex mt-4 text-xs">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
