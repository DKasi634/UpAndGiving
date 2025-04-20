import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase.config";
// import { IUser, USER_ROLE_TYPE, IProfile } from "@/api/types";
// import { getNewUUID } from "..";
// import { createOrUpdateProfile, createOrUpdateUser } from "./utils";

export  const supabaseSignUp = async (
  email: string,
  password: string,):Promise<User|null> => {
    // console.log(`Starting signup with email : ${email} and password : ${password}`)
    try {
      const { data, error } = await supabase.auth.signUp({email, password,
        options:{
          emailRedirectTo:`${window.location.origin}/auth/callback`
        }
      });
  
      if (error) {
        throw new Error(error.message);
      } 
      return data.user
    } catch (error) {
    //console.log("Error signing up : ", error)
      return null
    }
    
  };

export  const supabaseSignInWithEmail = async (email:string, password:string):Promise<User|null> => {
    // We should not rely on a returned user here, since we'll be catching them from the auth state changed listener
    // console.log("Signing in with email: ", email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error("Error signing in:", error.message);
      return null
    } else {
    //console.log("Signed in successfully with user : ", data.user);
      return data.user
    }
  };

export  const supabaseSignOut = async ():Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    } else {
      return true
    }
  } catch (error) {
    return false
  }
    
  };

export  const supabaseGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options:{
        redirectTo:`${window.location.origin}/auth/callback`
      }
    });
  
    if (error) {
      
      console.error("Error signing in with Google: ",!data,"\n", error.message);
    } else {
      // Redirects to Google's OAuth page
    //console.log("Redirecting to Google... with data : ", data);
    }
  };


  