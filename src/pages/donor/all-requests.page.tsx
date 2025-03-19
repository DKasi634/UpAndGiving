import { IDonationRequest, USER_ROLE_TYPE } from "@/api/types"
import DonationRequestCard from "@/components/generic/donation-request-card/donation-request-card.component"
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component"
import { selectCurrentUser } from "@/store/auth/auth.selector"
import { getDonationRequests } from "@/utils/supabase/supabase.utils"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


const AllDonationRequestsPage = () => {
    const [donationRequests, setDonationRequests] = useState<IDonationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    useEffect(()=>{
        if(currentUser && currentUser.user && currentUser.user.role !== USER_ROLE_TYPE.ADMIN){
            navigate("/not-found",{replace:true})
        }
    }, [currentUser])

    useEffect(() => {
        fetchDonationRequests();
    }, [])

    const fetchDonationRequests = async () => {
        setIsLoading(true)
        const donations = await getDonationRequests();
        if (donations && donations.length) {
            setDonationRequests(donations)
        }
        setIsLoading(false)
    }
    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2  lg:flex items-center justify-start  flex-wrap gap-6 px-4 md:px-10 py-12">
                {
                    donationRequests.map(donationReq => (
                        <DonationRequestCard key={donationReq.id} request={donationReq} className="lg:!min-w-[16rem]" />
                    ))
                }
            </div>
            { isLoading && <AbsoluteLoaderLayout/> }
        </div>
    )
}

export default AllDonationRequestsPage