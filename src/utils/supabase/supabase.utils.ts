import { DONATION_STATUSES, ICategory, IDonation, IDonationRequest, IProfile, IUser, USER_ROLE_TYPE } from "@/api/types";
import { supabase } from "./supabase.config";
import { getNewUUID } from "..";

const SUPABASE_BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET_NAME;
// const SUPABASE_SCHEMAS = {
//   DONORS:""
// }


// Upload an image
export const uploadToSupabaseStorage = async (file:File, folderPath:string):Promise<string|null> => {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(`${folderPath || "Generic"}/Image_${Date.now()}`, file);
  
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  
    const publicUrl = supabase.storage
      .from(SUPABASE_BUCKET_NAME)
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
      console.error("Error fetching user with :", error.message);
      return null;
    }
  
    return data as IUser;
  };

  export const getProfileByProfileId = async(profileId:string):Promise<IProfile|null> => {
    try {
        const {data, error} = await supabase.from("profiles").select("*").eq("id", profileId).single();
        if(error){ return null }
        return data as IProfile
    } catch (error) {
      //console.log("Something went wrong when getting the profile !")
        return null
    }

  }

  export const getCategoryById = async (categoryId:string):Promise<ICategory|null>=>{
    try {
      const {data, error}  =await supabase.from("categories").select("*").eq("id", categoryId).single();
      if(error){ throw new Error(error.message) }
      return data as ICategory
    } catch (error) {
      return null
    }
  }
  export const getProfileByUserId = async(userId:string):Promise<IProfile|null> => {
    try {
        const {data, error} = await supabase.from("profiles").select("*").eq("user_id", userId).single();
        if(error){ return null }
        return data as IProfile
    } catch (error) {
      //console.log("Something went wrong when getting the profile !")
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
              id: profile?.id || getNewUUID(), // Generate a new ID if not provided
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
    // console.log("\nCreating or updating user : ", user)
    try {
      // Step 1: Upsert the user in the `users` table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .upsert(
          [
            {
              id:user.id||getNewUUID(),
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
      // console.log("\nCreated or updated user : ", userData)
      return userData as IUser;
    } catch (error) {
      console.error("Unexpected error:", error);
      return null
    }
  };

  export const getDonationById = async (donationId:string):Promise<IDonation|null>=>{
    try {
      const {data, error} = await supabase.from("donations").select("*").eq("id", donationId).single();
      if(error){ throw new Error(error.message) }
      return data as IDonation
    } catch (error) {
    //console.log("Error getting donation with id : ", donationId)
      return null
    }
  }

  export const getDonations  = async ():Promise<IDonation[]|null>=>{
    try {
      const {data, error} = await supabase.from("donations").select("*");
      if(error){ throw new Error(error.message)}
      return data as IDonation[]
    } catch (error) {
      return null
    }
  }


  export const getDonationsByDonorId = async (donorId:string):Promise<IDonation[]|null>=>{
    try {
      const {data, error} = await supabase.from("donations").select("*").eq("donor_id", donorId);
      if(error){ throw new Error(error.message) }
      return data as IDonation[]
    } catch (error) {
    //console.log("Error getting donation with donor id : ", donorId)
      return null
    }
  }

  export const getDonationsByRecepientId = async (recepientId:string):Promise<IDonation[]|null>=>{
    try {
      const {data, error} = await supabase.from("donations").select("*").eq("recipient_id", recepientId);
      if(error){ throw new Error(error.message) }
      return data as IDonation[]
    } catch (error) {
    //console.log("Error getting donation with recepient id : ", recepientId, "\nas :", error)
      return null
    }
  }

export type MonthDonation = {
  month:string, count:number
}



  export const getDonorsDonationsByMonth = async (donorId: string):Promise<MonthDonation[]|null> => {
    try {
      const donations = await getDonationsByDonorId(donorId);
      if (!donations || !donations.length) return null;
  
      // Filter donations from the last 12 months (including the current month)
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  
      const filteredDonations = donations.filter(donation =>
        new Date(donation.created_at) >= oneYearAgo
      );
  
      // Group donations by month
      const donationsByMonth = filteredDonations.reduce((acc, donation) => {
        const donationDate = new Date(donation.created_at);
        const year = donationDate.getFullYear();
        const month = donationDate.getMonth(); // 0-based index for months
  
        const key = `${year}-${month}`;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key]++;
        return acc;
      }, {} as Record<string, number>);
  
      // Convert to an array with month names and sort by date
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      const sortedDonationsByMonth = Object.entries(donationsByMonth)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([key, count]) => {
          const month = key.split("-")[1];
          return {
            month: monthNames[parseInt(month, 10)],
            count,
          };
        });
  
      return sortedDonationsByMonth;
    } catch (error) {
      console.error("Error getting donations by month for donor ID:", donorId, error);
      return null;
    }
  };

  export const getNGOReceivedDonationsByMonth = async (ngo_profile_id: string):Promise<MonthDonation[]|null> => {
    try {
      const donations = await getDonationsByRecepientId(ngo_profile_id);
      if (!donations || !donations.length) return null;
  
      // Filter donations from the last 12 months (including the current month)
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  
      const filteredDonations = donations.filter(donation =>
        new Date(donation.created_at) >= oneYearAgo
      );
  
      // Group donations by month
      const donationsByMonth = filteredDonations.reduce((acc, donation) => {
        const donationDate = new Date(donation.created_at);
        const year = donationDate.getFullYear();
        const month = donationDate.getMonth(); // 0-based index for months
  
        const key = `${year}-${month}`;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key]++;
        return acc;
      }, {} as Record<string, number>);
  
      // Convert to an array with month names and sort by date
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      const sortedDonationsByMonth = Object.entries(donationsByMonth)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([key, count]) => {
          const month = key.split("-")[1];
          return {
            month: monthNames[parseInt(month, 10)],
            count,
          };
        });
  
      return sortedDonationsByMonth;
    } catch (error) {
      console.error("Error getting donations by month for recepient ID:",ngo_profile_id , error);
      return null;
    }
  };
  

  export const createOrUpdateDonation = async (donation:IDonation):Promise<IDonation|null> =>{
    try {
      const {data, error} = await supabase.from("donations").upsert([donation]).select().single();
      if(error){ throw new Error(error.message) }
      return data as IDonation
    } catch (error) {
    //console.log("Error creating or updating donation",donation,  "\n as : ", error);
      return null
    }
  }

  export const createOrUpdateDonationRequest = async (donationRequest:IDonationRequest):Promise<IDonationRequest|null> =>{
    try {
      const {data, error} = await supabase.from("donation_requests").upsert([donationRequest]).select().single();
      if(error){ throw new Error(error.message) }
      return data as IDonationRequest
    } catch (error) {
    //console.log("Error creating or updating donation request",donationRequest,  "\n as : ", error);
      return null
    }
  }

  export const getDonationRequestById = async (request_id:string):Promise<IDonationRequest|null>=>{
    try {
      const {data, error} = await supabase.from("donation_requests").select("*").eq("id", request_id).single();
      if(error){ throw new Error(error.message) }
      return data as IDonationRequest
    } catch (error) {
    //console.log("Error getting donation request with id : ", request_id)
      return null
    }
  }

  export const getDonationRequests = async ():Promise<IDonationRequest[]|null>=>{
    try {
      const {data, error} = await supabase.from("donation_requests").select("*");
      if(error){ throw new Error(error.message) }
      return data as IDonationRequest[]
    } catch (error) {
    //console.log("Error getting donation request with as : ", error)
      return null
    }
  }


  export const getDonationRequestsByNGOId = async (ngo_profile_id:string):Promise<IDonationRequest[]|null>=>{
    try {
      const {data, error} = await supabase.from("donation_requests").select("*").eq("ngo_profile_id", ngo_profile_id);
      if(error){ throw new Error(error.message) }
      return data as IDonationRequest[]
    } catch (error) {
    //console.log("Error getting donation with NGO profile id : ", ngo_profile_id)
      return null
    }
  }

export const approveDonation  = async (donationId:string):Promise<IDonation|null>=>{
  try {
    const {data, error} = await supabase.from("donations").update([{"status":DONATION_STATUSES.ACCEPTED} as Pick<IDonation, "status"> ]).eq("id", donationId).select().single();
    if(error){ throw new Error("Failed to approve donation") }
    return data as IDonation
  } catch (error) {
    return null
  }
}
export const rejectDonation  = async (donationId:string):Promise<IDonation|null>=>{
  try {
    const {data, error} = await supabase.from("donations").update([{"status":DONATION_STATUSES.REJECTED} as Pick<IDonation, "status"> ]).eq("id", donationId).select().single();
    if(error){ throw new Error("Failed to reject donation") }
    return data as IDonation
  } catch (error) {
    return null
  }
}

export const enableDonationRequest  = async (donationReqId:string):Promise<IDonationRequest|null>=>{
  try {
    const {data, error} = await supabase.from("donation_requests").update([{"disabled":true} as Pick<IDonationRequest, "disabled"> ]).eq("id", donationReqId).select().single();
    if(error){ throw new Error("Failed to enable donation") }
    return data as IDonationRequest
  } catch (error) {
    return null
  }
}
export const disableDonationRequest  = async (donationReqId:string):Promise<IDonationRequest|null>=>{
  try {
    const {data, error} = await supabase.from("donation_requests").update([{"disabled":false} as Pick<IDonationRequest, "disabled"> ]).eq("id", donationReqId).select().single();
    if(error){ throw new Error("Failed to disable donation") }
    return data as IDonationRequest
  } catch (error) {
    return null
  }
}


