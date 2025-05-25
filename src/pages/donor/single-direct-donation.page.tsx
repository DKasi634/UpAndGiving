import { DIRECT_DONATION_STATUSES, IDirectDonation, IProfile, USER_ROLE_TYPE } from "@/api/types";
import BaseButton from "@/components/generic/base-button/base-button.component";
import GenericImage from "@/components/generic/generic-image/generic-image.component";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { setErrorToast } from "@/store/toast/toast.actions";
import { claimDirectDonation, getDirectDonationById, getProfileByProfileId } from "@/utils/supabase/supabase.utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const SingleDirectDonationPage = () => {
    const { directDonationId } = useParams<{ directDonationId: string }>() as { directDonationId: string };
    const [thisDirectDonation, setThisDirectDonation] = useState<IDirectDonation | null>(null);
    const [donorProfile, setDonorProfile] = useState<IProfile | null>(null);
    const [claimerProfile, setClaimerProfile] = useState<IProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const [currentUserRole, setCurrentUserRole] = useState<USER_ROLE_TYPE | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showError = (message: string) => {
        dispatch(setErrorToast(message));
    };

    useEffect(() => {
        if (currentUser && currentUser.user) {
            setCurrentUserRole(currentUser.user.role);
            if (![USER_ROLE_TYPE.DONOR, USER_ROLE_TYPE.ADMIN].find(role => role === currentUser?.user?.role ) ) {
                navigate("/me/dashboard", { replace: true });
            }
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (directDonationId && directDonationId.trim()) {
            fetchThisDirectDonation(directDonationId);
        }
    }, [directDonationId]);

    const fetchThisDirectDonation = async (directDonationId: string) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const donation = await getDirectDonationById(directDonationId);
            if (donation) {
                setThisDirectDonation(donation);
                // Fetch donor profile
                const donorProfile = await getProfileByProfileId(donation.donor_id);
                if (donorProfile) {
                    setDonorProfile(donorProfile);
                }
                // Fetch claimer profile if claimed
                if (donation.claimer_id) {
                    const claimerProfile = await getProfileByProfileId(donation.claimer_id);
                    if (claimerProfile) {
                        setClaimerProfile(claimerProfile);
                    }
                }
            }
        } catch (error) {
            showError("Failed to load donation details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaimDonation = async (donationId: string) => {
        if (!currentUser?.profile?.id) {
            showError("You must be logged in to claim a donation.");
            return;
        }
        setIsLoading(true);
        try {
            const claimedDonation = await claimDirectDonation(donationId, currentUser.profile.id);
            if (!claimedDonation) {
                showError("This donation has already been claimed or is unavailable.");
            } else {
                setThisDirectDonation(claimedDonation);
                const claimerProfile = await getProfileByProfileId(currentUser.profile.id);
                if (claimerProfile) {
                    setClaimerProfile(claimerProfile);
                }
            }
        } catch (error) {
            showError("Failed to claim donation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <h3 className="text-lg font-semibold text-center w-full text-black/90 bg-gray-100 shadow-xs shadow-black/20 sticky top-0 py-4 z-10">Direct Donation</h3>
            {thisDirectDonation && (
                <div className="flex flex-col justify-start items-start w-full max-w-2xl gap-6 px-8 lg:px-12 py-16">
                    <div className="w-64 md:w-80 aspect-square rounded-lg overflow-hidden">
                        <GenericImage
                            src={thisDirectDonation.images[0]}
                            className="w-full h-full object-center object-contain"
                        />
                    </div>
                    <div className="flex items-center justify-start py-2">
                        <span
                            className={`!px-6 py-[0.2rem] text-xs ${
                                thisDirectDonation.status === DIRECT_DONATION_STATUSES.AVAILABLE
                                    ? "bg-green-500/20 text-green-600"
                                    : "bg-gray-600/20 text-black/80"
                            } rounded-xl capitalize`}
                        >
                            {thisDirectDonation.status}
                        </span>
                    </div>
                    <div className="p-4 space-y-2">
                        <h3 className="text-lg font-extrabold text-black/60">
                            {donorProfile?.name || "Anonymous Donor"}
                        </h3>
                        {thisDirectDonation.status === DIRECT_DONATION_STATUSES.CLAIMED && claimerProfile && (
                            <p className="text-sm text-gray-600">
                                Claimed by: {claimerProfile.name}
                            </p>
                        )}
                        <h4 className="text-sm font-semibold text-indigo-600">{thisDirectDonation.name}</h4>
                        <p className="text-xs text-gray-600">{thisDirectDonation.description}</p>
                    </div>
                    <div className="flex items-center justify-start gap-8">
                        {currentUser &&
                            currentUserRole === USER_ROLE_TYPE.DONOR &&
                            thisDirectDonation.status === DIRECT_DONATION_STATUSES.AVAILABLE &&
                            currentUser.profile?.id !== thisDirectDonation.donor_id && (
                                <BaseButton
                                    clickHandler={() => handleClaimDonation(thisDirectDonation.id)}
                                    className="!px-4 !py-[0.4rem]"
                                >
                                    Claim Donation
                                </BaseButton>
                            )}
                    </div>
                </div>
            )}
            {isLoading && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default SingleDirectDonationPage;