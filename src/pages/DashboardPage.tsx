import DonationItem from "@/components/donor/donation-item.component";
import GenericImage from "@/components/generic/generic-image/generic-image.component";

import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { NoScrollbarContainer, VerticalScrollableWrapper } from "@/styles/global.styles";
import DashBoardCard from "@/components/generic/dashbord-card/dashboard-card.component";
import { LuClock4, BiSolidBadgeCheck } from "@/assets";
import { getDonationsByDonorId, getDonationsByRecepientId, getDonorsDonationsByMonth, getNGOReceivedDonationsByMonth, MonthDonation } from "@/utils/supabase/supabase.utils";
import { useEffect, useState } from "react";
import { IDonation, USER_ROLE_TYPE } from "@/api/types";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthLoading, selectCurrentUser } from "@/store/auth/auth.selector";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";
import { logoutStart } from "@/store/auth/auth.actions";
import BaseButton from "@/components/generic/base-button/base-button.component";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DonorDashboard = () => {

    const [userDonations, setUserDonations] = useState<IDonation[]>([]);
    const [donationsLoading, setDonationsLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const currentUserLoading = useSelector(selectAuthLoading);
    const [donationsByMonth, setDonationsByMonth] = useState<MonthDonation[]>([]);
    const [chartData, setChartData] = useState<{ labels: string[], datasets: Array<any> }>({ labels: [], datasets: [] }) // Data for the donation progress chart

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && currentUser.user && currentUser.profile) {
            if (currentUser.user?.role === USER_ROLE_TYPE.DONOR) {
                fetchDonorDonations(currentUser.profile.id);
            } else if (currentUser.user?.role === USER_ROLE_TYPE.NGO) {
                fetchRecepientDonations(currentUser.profile.id)
            } else {
                navigate("/me/profile")
            }
        } else {
            navigate("/")
        }
    }, [currentUser])

    useEffect(() => {
        if (donationsByMonth.length) {
            setChartData({
                labels: [...donationsByMonth.map(donation => donation.month)],
                datasets: [
                    {
                        label: "Donation Progress",
                        data: [...donationsByMonth.map(donation => donation.count)], // Example donation amounts
                        backgroundColor: "rgba(37, 99, 235, 0.6)", // Blue color with transparency
                        borderColor: "rgba(37, 99, 235, 1)", // Solid blue border
                        borderWidth: 1,
                    },
                ],
            })
        }

    }, [donationsByMonth])

    // Chart options for customization
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            title: {
                display: true,
                text: "Donation Progress Over Time",
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Remove vertical grid lines
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.1)", // Light gray horizontal grid lines
                },
            },
        },
    };

    const fetchDonorDonations = async (donorId: string) => {
        setDonationsLoading(true)
        try {
            const donations = await getDonationsByDonorId(donorId);
            const sortedDonations = await getDonorsDonationsByMonth(donorId);
          //console.log("Fetched donations : ", donations)
            if (donations && donations.length) { setUserDonations(donations) }
            if (sortedDonations && sortedDonations.length) {
                setDonationsByMonth(sortedDonations)
            }
        } catch (error) {
          //console.log("Error fetching donations as : ", error)
        }
        setDonationsLoading(false)
    }
    const fetchRecepientDonations = async (recepientId: string) => {
        setDonationsLoading(true)
        try {
            const donations = await getDonationsByRecepientId(recepientId);
            const sortedDonations = await getNGOReceivedDonationsByMonth(recepientId);
          //console.log("Fetched donations : ", donations)
            if (donations && donations.length) { setUserDonations(donations) }
            if (sortedDonations && sortedDonations.length) {
                setDonationsByMonth(sortedDonations)
            }
        } catch (error) {
          //console.log("Error fetching donations as : ", error)
        }
        setDonationsLoading(false)
    }

    const handleSignout = () => {
        dispatch(logoutStart())
    }

    return (
        <div className="relative">
            {(currentUser.profile && currentUser.user) &&
                <NoScrollbarContainer className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[70%_30%] bg-white`}>
                    <aside className={`flex flex-col items-start justify-start px-4 pt-4 border-r-[1px] border-black/30 w-full`}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl lg:text-2xl text-black/70">Welcome {currentUser.profile.name}</span>
                                <span className="text-sm font-medium text-black/90">
                                    Your personal dashboard overview
                                </span>
                            </div>
                            {/* </div> */}

                            <BaseButton clickHandler={handleSignout} className="!px-6 !text-xs !font-bold !py-[0.4rem] bg-indigo-600 rounded-3xl text-white">
                                <> <span className="hidden md:inline">Logout</span> <span className="md:hidden"><PiSignOutBold className="text-xl" /></span> </>
                            </BaseButton>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full">
                            <div className="p-4 rounded-xl bg-white flex flex-col gap-2">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="relative h-[8rem] aspect-square rounded-full border-[0.1rem] border-gray-400/60 p-1 border-r-indigo-600">
                                        <GenericImage className="w-full h-full rounded-full overflow-hidden" src={currentUser.profile.profile_image} />
                                        {currentUser.profile.verified &&
                                            <span className="w-fit absolute right-3 bottom-1 z-10 rounded-full bg-white">
                                                <BiSolidBadgeCheck className="text-2xl text-indigo-600" />
                                            </span>}
                                    </div>
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-semibold text-black text-lg leading-2">
                                            {currentUser.profile.name}
                                        </span>
                                    </div>

                                </div>
                            </div>
                            <div className="grid grid-cols-1 w-full">
                                <DashBoardCard className="!w-full lg:!max-w-full" title={`${currentUser.user.role === USER_ROLE_TYPE.NGO ? "Received" : "Completed"} Donations`} figure={donationsByMonth.reduce((acc, curr) => acc + curr.count, 0)} icon={<LuClock4 className="text-black text-lg" />} subtitle="In total" />
                            </div>
                        </div>
                        {/* Chart Section */}
                        <div className="chart w-full h-[15rem] mt-4">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </aside>

                    <aside className="relative flex flex-col lg:overflow-y-scroll">
                        <div className="flex flex-col md:sticky md:top-2">
                            <span className="text-xl font-bold text-black py-4 shadow-sm md:shadow-md w-full shadow-black/20 px-4 text-center">{currentUser.user.role === USER_ROLE_TYPE.DONOR ? "Donations" : "Received donations"}</span>
                            <VerticalScrollableWrapper className="h-[calc(100vh-3rem)] px-4 relative">
                                {userDonations.map((item, idx) => (
                                    <DonationItem item={item} key={idx} />
                                ))}
                                {donationsLoading && <AbsoluteLoaderLayout />}
                                {(!donationsLoading && !userDonations.length) && <p className="text-sm font-semibold text-black/70 w-full text-center py-6">No donations {currentUser.user.role === USER_ROLE_TYPE.NGO && 'received'} yet</p>}
                            </VerticalScrollableWrapper>
                        </div>
                    </aside>
                </NoScrollbarContainer>
            }
            {currentUserLoading && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default DonorDashboard;