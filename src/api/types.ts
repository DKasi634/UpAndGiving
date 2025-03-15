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
