import { DONATION_STATUSES, ICategory, IDonation, IProfile, USER_ROLE_TYPE } from "@/api/types"
import GenericImage from "../generic-image/generic-image.component"
import { useEffect, useState } from "react"
import { approveDonation, getCategoryById, getProfileByProfileId, rejectDonation } from "@/utils/supabase/supabase.utils"
import BaseButton, { buttonType } from "../base-button/base-button.component"
import AbsoluteLoaderLayout from "../loader/absolute-loader-layout.component"
import { useDispatch, useSelector } from "react-redux"
import { setErrorToast } from "@/store/toast/toast.actions"
import { selectCurrentUser } from "@/store/auth/auth.selector"


type DonationCardProps = {
    className?: string,
    donation: IDonation
}
const DonationCard = ({ className = "", donation }: DonationCardProps) => {
    const [donationCategory, setDonationCategory] = useState<ICategory | null>(null);
    const [donorProfile, setDonorProfile] = useState<IProfile | null>(null);
    const [thisDonation, setThisDonation] = useState<IDonation>(donation);
    const [isLoading, setIsloading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const [currentUserRole, setCurrentUserRole] = useState<USER_ROLE_TYPE | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (donation) {
            setIsloading(true)
            fetchDonationCategory(donation.category_id);
            fetchDonor(donation.donor_id);
            setIsloading(false);
        }
    }, [donation])

    useEffect(() => {
        if (currentUser && currentUser.user) {
            setCurrentUserRole(currentUser.user.role)
        }
    }, [currentUser])

    const showError = (message: string) => {
        dispatch(setErrorToast(message))
    }

    const fetchDonationCategory = async (categoryId: string) => {
        const fetchedCategory = await getCategoryById(categoryId);
        if (fetchedCategory) {
            setDonationCategory(fetchedCategory);
        };
    }

    const fetchDonor = async (donorProfileId: string) => {
        const donor = await getProfileByProfileId(donorProfileId);
        if (donor) { setDonorProfile(donor) }
    }

    const handleApproveDonation = async (donationId: string) => {
        setIsloading(true);
        const approvedDonation = await approveDonation(donationId);
        if (!approvedDonation) {
            showError("Oops, something went wrong, try again !"); return
        } else { setThisDonation(approvedDonation); }

        setIsloading(false);
    }
    const handleRejectDonation = async (donationId: string) => {
        setIsloading(true);
        const approvedDonation = await rejectDonation(donationId);
        if (!approvedDonation) {
            showError("Oops, something went wrong, try again !")
        } else { setThisDonation(approvedDonation); }

        setIsloading(false);
    }


    return (
        <div className={`${className} relative flex flex-col items-center justify-start !rounded-xl border border-black/80 shadow-md shadow-black/10 p-4`}>
            <div className="w-24 aspect-square rounded-lg overflow-hidden">
                <GenericImage src={thisDonation.images[0]} className="w-full h-full object-center object-cover" />
            </div>
            {donorProfile && <p className="text-sm font-bold py-2 text-center">{donorProfile.name}</p>}
            <div className="flex items-center justify-start py-2">
                {donationCategory && <span className="!px-6 py-[0.2rem] text-xs text-indigo-600 rounded-xl bg-indigo-500/20">{donationCategory.category_name}</span>}
            </div>
            <div className="flex flex-col items-center justify-start gap-1">
                <p className="text-lg font-semibold text-black/80 line-clamp-1">{thisDonation.name}</p>
                <p className="text-xs font-semibold text-black/80 line-clamp-2">{thisDonation.description}</p>
                <span className="text-xs font-normal text-black/80 w-fit">{new Date(thisDonation.created_at).toLocaleDateString("en-GB", { minute: "2-digit", hour: "2-digit", day: "2-digit", month: "short", year: "numeric", })}</span>
            </div>
            <div className="flex items-center justify-center w-full pt-4 gap-3">
                <BaseButton href={`/me/single-donation/${donation.id}`} className="!px-4 !py-[0.4rem] !text-xs" >View</BaseButton>
                {
                    (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && (thisDonation.status === DONATION_STATUSES.PENDING || thisDonation.status === DONATION_STATUSES.REJECTED)) &&
                    <BaseButton clickHandler={() => handleApproveDonation(thisDonation.id)} className="!px-4 !py-[0.4rem] !text-xs">Approve</BaseButton>
                }
                {
                    (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && thisDonation.status !== DONATION_STATUSES.REJECTED) &&
                    <BaseButton type={buttonType.dark} clickHandler={() => handleRejectDonation(thisDonation.id)} className="!px-4 !py-[0.4rem] !text-xs">Reject</BaseButton>
                }
            </div>

            {isLoading && <AbsoluteLoaderLayout />}
        </div>
    )
}

export default DonationCard