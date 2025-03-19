import { ReactElement } from "react";


export  type DonationRequest = {
    id: string; // Unique identifier for the request
    ngoName: string; // Name of the NGO
    ngoProfileImage: string; // URL to the NGO's profile image
    title: string; // Title of the request
    description: string; // Description of the request
    urgencyLevel?: "low" | "medium" | "high"; // Optional urgency level
  };


  export type SelectedImage = {
    file:File,
    url:string;
}

export type LandingProcessStep = {
  title:string,
  description:string,
  icon:ReactElement
}

export type NGOProfile = {
  id: string; // Unique identifier for the NGO
  name: string; // Name of the NGO
  profileImage: string; // URL to the NGO's profile image
  bio: string; // Short description or bio of the NGO
  location: string; // Location or area of activity
};

export type nextRouteLocation = {
  fromRoute:Location
}
