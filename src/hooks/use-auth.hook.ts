import { useEffect} from "react";
import { supabase } from "@/utils/supabase/supabase.config";
// import { User } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "@/store/auth/auth.actions";
import { selectCurrentUser } from "@/store/auth/auth.selector";

const useAuth = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth event: ${event} with user : `, session?.user);
        
        if(session?.user && session.user.email && session.user.email !== currentUser?.user?.email){
          // console.log("Emails :", currentUser.user?.email, " and ", session.user.email, "\n Dispatching user...")
          dispatch(setCurrentUser(session.user.email))
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // return user;
};

export default useAuth;