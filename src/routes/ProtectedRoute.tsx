import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/utils/supabase/supabase.config";
import { UserResponse } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const [currentUser, setCurrentUser] = useState<UserResponse|null>(null)

    const getCurrentUser =  () =>{
        supabase.auth.getUser().then(user => { if(user){ setCurrentUser(user) } })
    }

    useEffect(()=>{
        getCurrentUser();
    }, [])

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;