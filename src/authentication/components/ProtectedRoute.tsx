import { useAuth } from "../hooks/useAuth";
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authState } = useAuth();
  
  if (!authState.logged) {
    return <Navigate to="/login" replace />;
  }

  return children;
};