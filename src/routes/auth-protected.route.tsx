import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/auth/auth.selector';

interface AuthProtectedRouteProps {
  children: ReactNode;
}

const AuthProtectedRoute = ({ children }: AuthProtectedRouteProps) => {
    const currentUser = useSelector(selectCurrentUser);
  return (currentUser.user && currentUser.profile) ? <>{children}</> : <Navigate to="/auth/signin" />;
};

export default AuthProtectedRoute;