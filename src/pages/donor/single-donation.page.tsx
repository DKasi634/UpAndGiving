import { DONATION_STATUSES, IDonation, IProfile, USER_ROLE_TYPE } from "@/api/types";
import BaseButton, { buttonType } from "@/components/generic/base-button/base-button.component";
import GenericImage from "@/components/generic/generic-image/generic-image.component"
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { setErrorToast } from "@/store/toast/toast.actions";
import { approveDonation, getDonationById, getProfileByProfileId, rejectDonation } from "@/utils/supabase/supabase.utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"


const SingleDonationPage = () => {

    const { donationId } = useParams<{ donationId: string }>() as { donationId: string };
    const [thisDonation, setThisDonation] = useState<IDonation | null>(null);
    const [requestNGOProfile, setRequestNGOProfile] = useState<IProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const [currentUserRole, setCurrentUserRole] = useState<USER_ROLE_TYPE|null>(null);
    const dispatch = useDispatch();

    const showError = (message:string) =>{
        dispatch(setErrorToast(message))
    }

    useEffect(() => {
        if (donationId && donationId.trim()) {
            console.log("Got the donation with donation id : ", donationId)
            fetchThisDonationRequest(donationId)
        }
    }, [donationId]);

    useEffect(()=>{
        if(currentUser && currentUser.user){
            setCurrentUserRole(currentUser.user.role)
        }
    }, [currentUser])

    const fetchThisDonationRequest = async (donationId: string) => {
        if(isLoading){ return}
        setIsLoading(true);
        const donation = await getDonationById(donationId);
        if (donation) {
            console.log("Got donation at ",new Date().toISOString(), "\n  as : ", donation)
            setThisDonation(donation);
            if (donation.recipient_id) {
                const ngoProfile = await getProfileByProfileId(donation.recipient_id);
                if (ngoProfile) {
                    setRequestNGOProfile(ngoProfile)
                }
            };
            setIsLoading(false)
        }
    }
    const handleApproveDonation = async (donationId:string) =>{
        setIsLoading(true);
        const approvedDonation = await approveDonation(donationId);
        if(!approvedDonation){
            showError("Oops, something went wrong, try again !");
        }else{ setThisDonation(approvedDonation) ;}
        setIsLoading(false);
    }
    const handleRejectDonation = async (donationId:string) =>{
        setIsLoading(true);
        const approvedDonation = await rejectDonation(donationId);
        if(!approvedDonation){
            showError("Oops, something went wrong, try again !")
        } else { setThisDonation(approvedDonation); }
        
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <h3 className="text-lg font-semibold text-center w-full text-black/90 bg-gray-100 shadow-xs shadow-black/20 sticky top-0 py-4 z-10">Donation</h3>
            {thisDonation &&
                <div className="flex flex-col justify-start items-start w-full max-w-2xl gap-6 px-8 lg:px-12 py-16">
                    <div className="w-64 md:w-80 aspect-square rounded-lg overflow-hidden">
                        <GenericImage src={thisDonation.images[0]} className="w-full h-full object-center object-contain" />
                    </div>
                    <div className="flex items-center justify-start py-2">
                    { currentUserRole === USER_ROLE_TYPE.ADMIN && <span className={` !px-6 py-[0.2rem] text-xs ${thisDonation.status === DONATION_STATUSES.PENDING ? 'bg-gray-600/20 text-black/80':thisDonation.status === DONATION_STATUSES.REJECTED ? "bg-red-500/20 text-red-500/80":'bg-indigo-500/20 text-indigo-600'} rounded-xl capitalize`}>{thisDonation.status}</span> }
                    </div>

                    <div className="p-4 space-y-2">
                        {/* NGO Name */}
                        <h3 className="text-lg font-extrabold text-black/60">{requestNGOProfile?.name}</h3>

                        {/* Request Title */}
                        <h4 className="text-sm font-semibold text-indigo-600">{thisDonation.name}</h4>

                        {/* Request Description */}
                        <p className="text-xs text-gray-600">
                            {thisDonation.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-8"> 
                        {
                        (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && (thisDonation.status === DONATION_STATUSES.PENDING || thisDonation.status === DONATION_STATUSES.REJECTED)) &&
                        <BaseButton clickHandler={()=>handleApproveDonation(thisDonation.id)} className="!px-4 !py-[0.4rem]">Approve</BaseButton>
                        }
                        {
                        (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && thisDonation.status !== DONATION_STATUSES.REJECTED) &&
                        <BaseButton type={buttonType.dark} clickHandler={()=>handleRejectDonation(thisDonation.id)} className="!px-4 !py-[0.4rem]">Reject</BaseButton>
                        }
                    </div>
                </div>}
            {isLoading && <AbsoluteLoaderLayout />}
        </div>
    )
}

export default SingleDonationPage