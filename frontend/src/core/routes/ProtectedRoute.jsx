import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import Spinner from '../../components/ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="p-8 border-[3px] border-[#182B5E] bg-white shadow-[8px_8px_0px_0px_#182B5E] text-center space-y-3">
          <Spinner size="lg" variant="navy" />
          <p className="text-xs font-black uppercase tracking-wider text-[#182B5E]">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
