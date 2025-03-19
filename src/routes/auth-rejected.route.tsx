import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/auth/auth.selector';

interface AuthRejectedRouteProps {
  children: ReactNode;
}

const AuthRejectedRoute = ({ children }: AuthRejectedRouteProps) => {
  console.log("In navigation !")
  const currentUser = useSelector(selectCurrentUser);
  return (
    <>{
      (currentUser && currentUser.user && currentUser.profile) ? <Navigate to="/me/dashboard" /> : <>{children}</>
    }
    </>
  )
};

export default AuthRejectedRoute;