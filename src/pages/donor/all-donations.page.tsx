import { IDonation, USER_ROLE_TYPE } from "@/api/types"
import DonationCard from "@/components/generic/donation-card/donation-card.component"
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component"
import { selectCurrentUser } from "@/store/auth/auth.selector"
import { getDonations } from "@/utils/supabase/supabase.utils"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


const AllDonationsPage = () => {
    const [donations, setDonations] = useState<IDonation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    useEffect(()=>{
        if(currentUser && currentUser.user && currentUser.user.role !== USER_ROLE_TYPE.ADMIN){
            navigate("/not-found",{replace:true})
        }
    }, [currentUser])

    useEffect(() => {
        fetchDonations();
    }, [])

    const fetchDonations = async () => {
        setIsLoading(true)
        const donations = await getDonations();
        if (donations && donations.length) {
            setDonations(donations)
        }
        setIsLoading(false)
    }
    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2  lg:flex items-center justify-start  flex-wrap gap-6 px-4 md:px-10 py-12">
                {
                    donations.map(donation => (
                        <DonationCard key={donation.id} donation={donation} className="lg:!min-w-[16rem]" />
                    ))
                }
            </div>
            { isLoading && <AbsoluteLoaderLayout/> }
        </div>
    )
}

export default AllDonationsPage