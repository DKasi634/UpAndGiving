import { IProfile, IUser, USER_ROLE_TYPE } from "@/api/types";
import { supabase } from "./supabase.config";
import { getRandomOrTimestampedUUID } from "..";


// Upload an image
export const uploadToSupabaseStorage = async (file:File, folderPath:string):Promise<string|null> => {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`${folderPath || "generic"}/${Date.now()}-${file.name}`, file);
  
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  
    const publicUrl = supabase.storage
      .from("images")
      .getPublicUrl(data.path).data.publicUrl;
    return publicUrl
  };


  export const getUserById = async (id: string): Promise<IUser | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) {
      console.error("Error fetching user by ID:", error.message);
      return null;
    }
  
    return data as IUser;
  };

  export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
  
    if (error) {
      console.error("Error fetching user by email:", error.message);
      return null;
    }
  
    return data as IUser;
  };

  export const getProfileByUserId = async(userId:string):Promise<IProfile|null> => {
    try {
        const {data, error} = await supabase.from("profiles").select("*").eq("user_id", userId).single();
        if(error){ return null }
        return data as IProfile
    } catch (error) {
        console.log("Something went wrong when getting the profile !")
        return null
    }

  }

export const createOrUpdateProfile = async (userId:string, profile:IProfile):Promise<IProfile|null>=>{
  if(!userId){
    return null
  }
  try {
    const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert(
          [
            {
              id: profile?.id || getRandomOrTimestampedUUID(), // Generate a new ID if not provided
              user_id: profile.user_id,
              name: profile.name,
              bio: profile.bio,
              profile_image: profile.profile_image,
              location: profile.location,
              phone_number: profile.phone_number,
              verified: profile.verified || false,
              created_at: profile.created_at || new Date(),
              updated_at: new Date(),
            },
          ],
          { onConflict: "user_id" } // Use 'user_id' as the conflict resolution key
        )
        .select()
        .single();
  
      if (profileError) {
        throw new Error(profileError.message)
      }
      return profileData as IProfile
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    return null
  }
}

export const createOrUpdateUser = async (
    user: IUser
  ): Promise<IUser | null> => {
    if (!user.email) {
      console.error("Missing required fields for user or profile.");
      return null;
    }
  
    try {
      // Step 1: Upsert the user in the `users` table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .upsert(
          [
            {
              id:user.id||getRandomOrTimestampedUUID(),
              email: user.email,
              created_at: user.created_at || new Date(),
              last_login: user.last_login || new Date(),
              role: user.role || USER_ROLE_TYPE.DONOR, // Default role is 'donor'
            },
          ],
          { onConflict: "id" } // Use 'id' as the conflict resolution key
        )
        .select()
        .single();
  
      if (userError) {
        console.error("Error creating/updating user:", userError.message);
        return null;
      }
      return userData as IUser;
    } catch (error) {
      console.error("Unexpected error:", error);
      return null
    }
  };

