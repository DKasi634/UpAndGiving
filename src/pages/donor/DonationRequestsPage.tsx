
import DonationRequestCard from "@/components/generic/donation-request-card/donation-request-card.component";
import { dummyDonationRequests } from "@/constants";

// Dummy data
// const dummyData = [
//   {
//     id: "1",
//     ngoName: "Hope for Tomorrow",
//     ngoProfileImage:
//       "https://via.placeholder.com/300?text=NGO+Logo",
//     title: "Winter Coats Needed",
//     description:
//       "We are urgently collecting winter coats for families in Kisenyi slum before the cold season begins.",
//     urgencyLevel: "high",
//   },
//   {
//     id: "2",
//     ngoName: "Brighter Futures Initiative",
//     ngoProfileImage:
//       "https://via.placeholder.com/300?text=NGO+Logo",
//     title: "School Supplies Drive",
//     description:
//       "Help us provide notebooks, pens, and backpacks to children in rural schools.",
//     urgencyLevel: "medium",
//   },
//   {
//     id: "3",
//     ngoName: "Green Earth Uganda",
//     ngoProfileImage:
//       "https://via.placeholder.com/300?text=NGO+Logo",
//     title: "Tree Planting Campaign",
//     description:
//       "Support our initiative to plant 1,000 trees in urban areas to combat climate change.",
//     urgencyLevel: "low",
//   },
// ];

const DonationRequests = () => {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 w-full sticky top-0 z-10 bg-white shadow-sm backdrop-blur-xl py-4">
          Browse Donation Requests
        </h1>
      <div className="container mx-auto px-4 py-8">
        {/* Grid of Donation Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex flex-wrap items-center justify-start gap-6">
          {dummyDonationRequests.map((request) => (
            <DonationRequestCard className="lg:!max-w-[18rem]" key={request.id} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationRequests;