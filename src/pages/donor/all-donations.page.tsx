import { IDonation, IDirectDonation, USER_ROLE_TYPE } from "@/api/types";
import DonationCard from "@/components/generic/donation-card/donation-card.component";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { getDonations, getDirectDonations } from "@/utils/supabase/supabase.utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type DonationItem = {
    type: "vetted" | "direct";
    donation: IDonation | IDirectDonation;
};

const AllDonationsPage = () => {
    const [donationItems, setDonationItems] = useState<DonationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser?.user) return; // Wait for user to load
        const userRole = currentUser.user.role;
        if (![USER_ROLE_TYPE.ADMIN, USER_ROLE_TYPE.DONOR].includes(userRole)) {
            navigate("/not-found", { replace: true });
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        fetchAllDonations();
    }, [currentUser]);

    const fetchAllDonations = async () => {
        if (!currentUser?.user) return; // Avoid fetching if user isn’t loaded
        setIsLoading(true);
        try {
            const userRole = currentUser.user.role;
            let vettedDonations: IDonation[]|null = [];
            let directDonations: IDirectDonation[] = [];

            if (userRole === USER_ROLE_TYPE.ADMIN) {
                // Admins fetch both vetted and direct donations
                [vettedDonations, directDonations] = await Promise.all([
                    getDonations(),
                    getDirectDonations(),
                ]);
            } else if (userRole === USER_ROLE_TYPE.DONOR) {
                // Donors fetch only direct donations
                directDonations = await getDirectDonations();
            }

            const combinedItems: DonationItem[] = [
                ...(vettedDonations || []).map((donation) => ({
                    type: "vetted" as const,
                    donation,
                })),
                ...(directDonations || []).map((donation) => ({
                    type: "direct" as const,
                    donation,
                })),
            ];

            setDonationItems(combinedItems);
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex items-center justify-start flex-wrap gap-6 px-4 md:px-10 py-12">
                {donationItems.length === 0 && !isLoading && (
                    <p className="text-center text-gray-600 w-full">No donations available.</p>
                )}
                {donationItems.map((item) => (
                    <DonationCard
                        key={item.donation.id}
                        donation={item.donation}
                        donationType={item.type}
                        className="lg:!min-w-[16rem]"
                    />
                ))}
            </div>
            {isLoading && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default AllDonationsPage;