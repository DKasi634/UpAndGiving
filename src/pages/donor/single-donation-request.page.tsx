import { IDonationRequest, IProfile } from "@/api/types";
import GenericImage from "@/components/generic/generic-image/generic-image.component"
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { disableDonationRequest, enableDonationRequest, getDonationRequestById, getProfileByProfileId } from "@/utils/supabase/supabase.utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { USER_ROLE_TYPE } from "@/api/types";
import BaseButton, { buttonType } from "@/components/generic/base-button/base-button.component";
import { setErrorToast } from "@/store/toast/toast.actions";
import { FiEye } from "@/assets";


const SingleDonationRequest = () => {
    const { requestId } = useParams<{ requestId: string }>() as { requestId: string };
    const [thisRequest, setThisRequest] = useState<IDonationRequest | null>(null);
    const [requestNGOProfile, setRequestNGOProfile] = useState<IProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const [currentUserRole, setCurrentUserRole] = useState<USER_ROLE_TYPE | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (requestId && requestId.trim()) {
            fetchThisDonationRequest(requestId)
        }
    }, [requestId])

    useEffect(() => {
        if (currentUser && currentUser.user) {
            setCurrentUserRole(currentUser.user.role)
        }
    }, [currentUser])

    const showError = (message: string) => {
        dispatch(setErrorToast(message))
    }

    const fetchThisDonationRequest = async (requestId: string) => {
        setIsLoading(true);
        const donationRequest = await getDonationRequestById(requestId);
        if (donationRequest) {
            setThisRequest(donationRequest);
            const ngoProfile = await getProfileByProfileId(donationRequest.ngo_profile_id);
            if (ngoProfile) {
                setRequestNGOProfile(ngoProfile)
            };
            setIsLoading(false)
        }
    }

    const handleApproveDonationRequest = async (donationId: string) => {
        setIsLoading(true);
        const enabledDonation = await enableDonationRequest(donationId);
        if (!enabledDonation) {
            showError("Oops, something went wrong, try again !"); return
        } else { setThisRequest(enabledDonation); }

        setIsLoading(false);
    }
    const handleRejectDonationRequest = async (donationId: string) => {
        setIsLoading(true);
        const rejectedDonationRequest = await disableDonationRequest(donationId);
        if (!rejectedDonationRequest) {
            showError("Oops, something went wrong, try again !")
        } else { setThisRequest(rejectedDonationRequest); }

        setIsLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <h3 className="text-lg font-semibold text-center w-full text-black/90 bg-gray-100 shadow-xs shadow-black/20 sticky top-0 py-4 z-10">Donation Request</h3>
            {thisRequest &&
                <div className="flex flex-col justify-start items-start w-full max-w-2xl gap-6 pl-4 md:pl-8 lg:pl-12 py-16">
                    <div className="w-64 md:w-80 aspect-square rounded-lg overflow-hidden">
                        <GenericImage src={thisRequest.image} className="w-full h-full object-center object-cover" />
                    </div>

                    <div className="p-4 space-y-2">
                        {/* NGO Name */}
                        <h3 className="text-lg font-extrabold text-black/60">{requestNGOProfile?.name}</h3>

                        {/* Request Title */}
                        <h4 className="text-sm font-semibold text-indigo-600">{thisRequest.title}</h4>

                        {/* Request Description */}
                        <p className="text-xs text-gray-600">
                            {thisRequest.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        {(currentUser && currentUserRole === USER_ROLE_TYPE.NGO && thisRequest.ngo_profile_id === currentUser.profile?.id) &&
                            <BaseButton href={`/me/edit-request-donation/${thisRequest.id}`} className="!px-4 !py-[0.4rem] !text-xs"> <FiEye className="mr-1" /> Edit</BaseButton>
                        }
                        {
                            (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && !thisRequest.disabled) &&
                            <BaseButton clickHandler={() => handleApproveDonationRequest(thisRequest.id)} className="!px-4 !py-[0.4rem] !text-xs">Approve</BaseButton>
                        }
                        {
                            (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && thisRequest.disabled) &&
                            <BaseButton type={buttonType.dark} clickHandler={() => handleRejectDonationRequest(thisRequest.id)} className="!px-4 !py-[0.4rem] !text-xs">Reject</BaseButton>
                        }
                    </div>
                </div>}
            {isLoading && <AbsoluteLoaderLayout />}
        </div>
    )
}

export default SingleDonationRequest