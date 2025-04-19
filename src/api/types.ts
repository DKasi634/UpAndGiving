export enum USER_ROLE_TYPE{
    DONOR ="donor",
    NGO = "ngo",
    ADMIN = "admin"
} 

export type IUser =  {
    readonly id: string; // Unique identifier for the user
    readonly email: string; // User's email address
    created_at: Date; // Timestamp indicating when the user account was created
    last_login?: Date; // Timestamp indicating the last time the user logged in
    role:USER_ROLE_TYPE; // Role of the user
  }

export type IProfile = {
    id: string; // Unique identifier for the profile
    user_id: string; // Foreign key referencing the `id` field in the `users` table
    name: string; // Full name of the user
    bio?: string; // A short description or bio (optional)
    profile_image?: string; // URL to the user's profile image (optional)
    location?: string; // Location or area of activity (optional)
    phone_number?: string; // Contact phone number (optional)
    verified: boolean; // Indicates whether the user's profile has been verified
    created_at: Date; // Timestamp indicating when the profile was created
    updated_at: Date; // Timestamp indicating the last time the profile was updated
  }

export  interface IDonor {
    id: string; // Unique identifier for the donor
    profile_id: string; // Foreign key referencing the `id` field in the `profiles` table
    total_donations: number; // Total number of donations made by the donor
    reward_points: number; // Reward points earned by the donor
  }

export interface INGO {
    id: string; // Unique identifier for the NGO
    profile_id: string; // Foreign key referencing the `id` field in the `profiles` table
    registration_certificate?: string; // URL to the NGO's registration certificate (optional)
    beneficiaries_served: number; // Number of beneficiaries served by the NGO
    premium_subscription: boolean; // Indicates whether the NGO has a premium subscription
  }
export interface IAdmin {
    id: string; // Unique identifier for the admin
    profile_id: string; // Foreign key referencing the `id` field in the `profiles` table
    permissions: Record<string, boolean>; // Admin-specific permissions stored as key-value pairs
  }

  export enum DONATION_STATUSES{
     PENDING="PENDING",
     ACCEPTED="ACCEPTED",
     REJECTED="REJECTED",
     MATCHED="MATCHED",
     DELIVERED="DELIVERED"
  }
  export type IDonation = {
    id:string,
    donor_id:string,
    category_id:string,
    recipient_id?:string,
    name:string,
    description:string,
    status:DONATION_STATUSES
    // condition:"NEW"|"USED",
    images:string[],
    created_at:Date,
  }

  export enum DONATION_REQUEST_EMERGENCY_LEVELS {
    LOW="LOW",
    MEDIUM="MEDIUM",
    HIGH="HIGH"
  }


  export type IDonationRequest = {
    id: string; // Unique identifier for the request
    ngo_profile_id:string,
    title: string; 
    description: string; 
    urgency_level?: DONATION_REQUEST_EMERGENCY_LEVELS; // Optional urgency level
    created_at:Date,
    disabled:boolean,
    image:string
  };

export type ICategory = {
  id:string,
  category_name:string,
  created_at:Date
}