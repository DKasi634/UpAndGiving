import DonationItem from "@/components/donor/donation-item.component";
import GenericImage from "@/components/generic/generic-image/generic-image.component";
import { DummyDonations } from "@/constants";

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
import { NoScrollbarConatiner, VerticalScrollableWrapper } from "@/styles/global.styles";
import DashBoardCard from "@/components/generic/dashbord-card/dashboard-card.component";
import { FaAward, HiUserGroup, IoIosCheckmarkCircle, LuClock4, SiSololearn,BiSolidBadgeCheck } from "@/assets";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DonorDashboard = () => {
    // Data for the donation progress chart
    const chartData = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                label: "Donation Progress",
                data: [100, 250, 180, 300, 270, 200], // Example donation amounts
                backgroundColor: "rgba(37, 99, 235, 0.6)", // Blue color with transparency
                borderColor: "rgba(37, 99, 235, 1)", // Solid blue border
                borderWidth: 1,
            },
        ],
    };

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

    return (
        <NoScrollbarConatiner className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[70%_30%] bg-white">
            <aside className="flex flex-col items-start justify-start px-4 pt-4 border-r-[1px] border-black/30 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="w-fit flex items-center justify-start gap-2">
                        <div className="h-[3rem] w-[3rem] rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">J</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-black">Welcome, John</span>
                            <span className="text-xs font-normal text-black">
                                Your personal dashboard overview
                            </span>
                        </div>
                    </div>

                    <span className="px-4 text-sm font-bold py-2 bg-blue-600 rounded-3xl text-white">
                        Donate
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full">
                    <div className="p-4 rounded-xl bg-white flex flex-col gap-2">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="relative h-[8rem] aspect-square rounded-full border-[0.1rem] border-gray-400/60 p-1 border-r-blue-600">
                                <GenericImage className="w-full h-full rounded-full overflow-hidden" />
                                <span className="w-fit absolute right-3 bottom-1 z-10 rounded-full bg-white">
                                    <BiSolidBadgeCheck className="text-2xl text-blue-600" />
                                </span>
                            </div>
                            <div className="flex flex-col items-start justify-start gap-1">
                                <span className="font-semibold text-black text-lg leading-2">
                                    John Doe
                                </span>
                                <span className="text-xs text-black/60 font-medium">
                                    Hero donor
                                </span>
                            </div>
                            <div className="flex items-center justify-center px-2 w-full gap-2">
                                <p className="text-sm px-4 py-1 rounded-2xl bg-white text-black flex items-center justify-center shadow-sm shadow-black/30 gap-1">
                                    <HiUserGroup className="text-lg" />
                                    <span className="font-bold text-xs leading-1 text-blue-600">
                                        7
                                    </span>
                                </p>
                                <p className="text-sm px-4 py-1 rounded-2xl bg-white text-black flex items-center justify-center shadow-sm shadow-black/30 gap-1">
                                    <FaAward className="text-lg" />
                                    <span className="font-bold text-xs leading-1 text-blue-600">
                                        23
                                    </span>
                                </p>
                                <p className="text-sm px-4 py-1 rounded-2xl bg-white text-black flex items-center justify-center shadow-sm shadow-black/30 gap-1">
                                    <IoIosCheckmarkCircle className="text-lg" />
                                    <span className="font-bold text-xs leading-1 text-blue-600">
                                        15
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        
                        <DashBoardCard title="Completed Donations" figure={3} icon={<LuClock4 className="text-black text-lg" />}  subtitle="This month" />
                        <DashBoardCard title="Earned points" figure={15} icon={<SiSololearn className="text-black text-lg" />}  subtitle="This week" />
                    </div>
                </div>
                {/* Chart Section */}
                <div className="chart w-full h-[15rem] mt-4">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </aside>
            <aside className="relative flex flex-col lg:overflow-y-scroll">
                <div className="flex flex-col md:sticky md:top-2">
                    <span className="text-xl font-bold text-black py-4 shadow-md w-full shadow-black/20 px-4 text-center">My donations</span>
                    <VerticalScrollableWrapper className="h-[calc(100vh-3rem)] px-4">
                        {DummyDonations.map((item, idx) => (
                            <DonationItem item={item} key={idx} />
                        ))}
                    </VerticalScrollableWrapper>
                </div>
            </aside>
        </NoScrollbarConatiner>
    );
};

export default DonorDashboard;