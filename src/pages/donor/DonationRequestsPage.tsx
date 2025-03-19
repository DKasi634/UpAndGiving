
import { IDonationRequest, USER_ROLE_TYPE } from "@/api/types";
import DonationRequestCard from "@/components/generic/donation-request-card/donation-request-card.component";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { getDonationRequests, getDonationRequestsByNGOId } from "@/utils/supabase/supabase.utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type DonationRequestProps = {
  user_type:"USER"|"NGO"
}

const DonationRequests = ({user_type="USER"}:DonationRequestProps ) => {
  const [requests, setRequests] = useState<IDonationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<USER_ROLE_TYPE>(USER_ROLE_TYPE.DONOR)
  const currentUser = useSelector(selectCurrentUser);

  const navigate = useNavigate();

  useEffect(()=>{
    if(user_type === "USER"){
      fetchDonationRequests()
    }
  }, [])

  useEffect(()=>{
    if(currentUser){
      if(user_type === "USER" && currentUser.user?.role !== USER_ROLE_TYPE.DONOR){
        navigate("/not-found", {replace:true})
      }
      else if(user_type === "NGO" && currentUser.user?.role !== USER_ROLE_TYPE.NGO){
        navigate("/not-found", {replace:true})
      }
      if(currentUser.user){ setUserRole(currentUser.user.role) }
      if(currentUser.user?.role === USER_ROLE_TYPE.NGO && currentUser.profile && user_type ==="NGO"){
        fetchDonationRequestsByNGOId(currentUser.profile.id)
      }
    }
  }, [currentUser])

  const fetchDonationRequests = async () =>{
    setIsLoading(true);
    const fetchedRquests = await getDonationRequests();
    if(fetchedRquests && fetchedRquests.length){ setRequests(fetchedRquests) }
    setIsLoading(false);
  }

  const fetchDonationRequestsByNGOId = async (ngo_profile_id:string) =>{
    setIsLoading(true);
    const fetchedRquests = await getDonationRequestsByNGOId(ngo_profile_id);
    if(fetchedRquests && fetchedRquests.length){ setRequests(fetchedRquests) }
    setIsLoading(false);
  }
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-8 w-full sticky top-0 z-10 bg-white/20 shadow-sm backdrop-blur-xl py-4">
          {userRole === USER_ROLE_TYPE.NGO && 'My'} Donation Requests
        </h1>
      <div className="container mx-auto px-4 py-8">
        {/* Grid of Donation Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex flex-wrap items-center justify-start gap-6">
          {requests.map((request) => (
            <DonationRequestCard className="lg:!max-w-[18rem]" key={request.id} request={request} />
          ))}
        </div>
      </div>

      { isLoading && <AbsoluteLoaderLayout/> }
    </div>
  );
};

export default DonationRequests;