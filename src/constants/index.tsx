import { MdPostAdd, FaUsers, AiOutlineGift,FiRefreshCw, AiOutlineLineChart, FaHandHoldingHeart, IoSearchOutline, GiTargetShot, AiFillHeart, FaPeopleArrows, FaTree } from "@/assets";
import { DonationItemType } from "@/components/donor/donation-item.component";
import { IFaq } from "@/components/generic/faq/faq.component";
import { MenuItemType } from "@/components/generic/menu-item/menu-item.component";
import { DonationRequest, LandingProcessStep } from "@/types";
import { ReactElement } from "react";


export const faqs:IFaq[] = [
  {
    question: "What is the purpose of this platform?",
    answer: "Our platform connects people with surplus food to those in need, reducing food waste and supporting local communities."
  },
  {
    question: "How do I share my surplus food?",
    answer: "Simply create a post by adding a description and an optional photo. Nearby users can then view your listing and arrange a pick-up."
  },
  {
    question: "Is the platform free to use?",
    answer: "Yes, our platform is completely free to use for both donors and recipients."
  },
  {
    question: "Who can use this platform?",
    answer: "Anyone with surplus food to share or in need of food can use the platform. Local stores and organizations are also welcome!"
  },
  {
    question: "How do I know my shared food is reaching the right people?",
    answer: "We encourage users to communicate and coordinate directly to ensure a smooth and transparent sharing process."
  },
  {
    question: "Can businesses or organizations use this platform?",
    answer: "Yes, businesses and organizations are welcome to participate and can be marked as verified partners on their profiles."
  },
  {
    question: "What types of food can I share?",
    answer: "You can share any fresh, unopened, or non-expired food items that are safe for consumption. Always follow food safety guidelines."
  },
  {
    question: "How do I find surplus food near me?",
    answer: "Browse listings on our platform using your location to find surplus food being shared by others nearby."
  },
  {
    question: "What happens if no one claims my surplus food?",
    answer: "If no one claims your surplus food, we recommend reaching out to local food banks or community centers to donate."
  },
  {
    question: "How does the platform support sustainability?",
    answer: "By reducing food waste and promoting local sharing, we help lower the environmental impact of discarded food and strengthen communities."
  }
];


export const aboutUsInfo: Array<{ title:string, description:string, icon:ReactElement }> = [
  {
    title: "Our Mission",
    description: "Reducing food waste, supporting communities, and creating a more sustainable future for all.",
    icon: <GiTargetShot />, // React icon or any visual
  },
  {
    title: "Our Team",
    description: "A group of passionate individuals committed to connecting people and reducing waste.",
    icon: <FaPeopleArrows />, // React icon or image of the team
  },
  {
    title: "Our Values",
    description: "Community, generosity, and sustainability are at the heart of what we do.",
    icon: <FaTree />, // Icon representing values
  },
  {
    title: "Our Impact",
    description: "Over 10,000 meals shared and counting—thanks to you!",
    icon: <AiFillHeart />, // Icon or a counter image
  },
];

export const processSteps:LandingProcessStep[] = [
  {
    title: "List Your Surplus",
    description: "Got extra food? Create a post in seconds with a description and a photo. It’s quick, simple, and makes a big difference.",
    icon: <MdPostAdd />,
  },
  {
    title: "Connect Locally",
    description: "Nearby users can view your post and reach out to arrange a pick-up. We connect you directly to your community.",
    icon: <FaUsers />,
  },
  {
    title: "Share and Support",
    description: "Hand over the food and know that you’ve made someone’s day better while helping to reduce food waste.",
    icon: <AiOutlineGift />,
  },
  {
    title: "Repeat the Kindness",
    description: "The cycle doesn’t stop here. Keep sharing, keep supporting, and together we’ll build a stronger, waste-free community.",
    icon: <FiRefreshCw />,
  },
];


export const DummyDonations: DonationItemType[] = [
    {
        name: "Nike shoes",
        time: "11:04 am",
        date: "Wed, 23 Jul",
        status: "completed",
    },
    {
        name: "Winter jackets",
        time: "09:15 am",
        date: "Tue, 22 Jul",
        status: "pending",
    },
    {
        name: "Books for kids",
        time: "03:45 pm",
        date: "Mon, 21 Jul",
        status: "completed",
    },
    {
        name: "Groceries pack",
        time: "08:30 am",
        date: "Sun, 20 Jul",
        status: "failed",
    },
    {
        name: "School supplies",
        time: "02:10 pm",
        date: "Sat, 19 Jul",
        status: "completed",
    },
    {
        name: "Toys for children",
        time: "10:50 am",
        date: "Fri, 18 Jul",
        status: "pending",
    },
    {
        name: "Blankets and sheets",
        time: "07:20 pm",
        date: "Thu, 17 Jul",
        status: "completed",
    },
    {
        name: "Medical supplies",
        time: "12:00 pm",
        date: "Wed, 16 Jul",
        status: "failed",
    },
    {
        name: "Sports equipment",
        time: "04:30 pm",
        date: "Tue, 15 Jul",
        status: "completed",
    },
    {
        name: "Food pantry items",
        time: "06:45 am",
        date: "Mon, 14 Jul",
        status: "pending",
    },
    {
        name: "Medical supplies",
        time: "12:00 pm",
        date: "Wed, 16 Jul",
        status: "failed",
    },
    {
        name: "Sports equipment",
        time: "04:30 pm",
        date: "Tue, 15 Jul",
        status: "completed",
    },
    {
        name: "Food pantry items",
        time: "06:45 am",
        date: "Mon, 14 Jul",
        status: "pending",
    },
];

export const menuItems: MenuItemType[] = [
    {
      icon: <AiOutlineLineChart  />,
      label: "Dashboard",
      name: "dashboard",
      path: "dashboard",
    },
    {
      icon: <FaHandHoldingHeart />,
      label: "Donate",
      name: "donate",
      path: "donate",
    },
    {
      icon: <IoSearchOutline />,
      label: "Browse",
      name: "browse",
      path: "browse",
    },
  ];

  export const dummyDonationRequests: DonationRequest[] = [
    {
        id: "1",
        ngoName: "Hope for Tomorrow",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Winter Coats Needed",
        description: "We are urgently collecting winter coats for families in Kisenyi slum before the cold season begins.",
        urgencyLevel: "high",
    },
    {
        id: "2",
        ngoName: "Brighter Futures Initiative",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "School Supplies Drive",
        description: "Help us provide notebooks, pens, and backpacks to children in rural schools.",
        urgencyLevel: "medium",
    },
    {
        id: "3",
        ngoName: "Green Earth Uganda",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Tree Planting Campaign",
        description: "Support our initiative to plant 1,000 trees in urban areas to combat climate change.",
        urgencyLevel: "low",
    },
    {
        id: "4",
        ngoName: "Healing Hands Foundation",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Medical Aid for Refugees",
        description: "We are raising funds for essential medical supplies to support refugees in conflict zones.",
        urgencyLevel: "high",
    },
    {
        id: "5",
        ngoName: "Women Empowerment Network",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Skills Training for Women",
        description: "Help us organize vocational training sessions for underprivileged women in rural areas.",
        urgencyLevel: "medium",
    },
    {
        id: "6",
        ngoName: "Clean Water Project",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Borehole Construction Fund",
        description: "Support our effort to build boreholes in drought-prone areas to provide clean drinking water.",
        urgencyLevel: "high",
    },
    {
        id: "7",
        ngoName: "Feed the Hungry Initiative",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Food Pack Distribution",
        description: "We aim to distribute 5,000 food packs to families affected by floods in northern regions.",
        urgencyLevel: "high",
    },
    {
        id: "8",
        ngoName: "Youth Empowerment Center",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Job Readiness Program",
        description: "Join us in preparing youth for the job market through career counseling and workshops.",
        urgencyLevel: "low",
    },
    {
        id: "9",
        ngoName: "Animal Rescue Squad",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Shelter Renovation",
        description: "We need support to renovate our animal shelter to accommodate more stray animals.",
        urgencyLevel: "medium",
    },
    {
        id: "10",
        ngoName: "Bright Minds Foundation",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Digital Literacy Campaign",
        description: "Help us provide laptops and internet access to students in underserved communities.",
        urgencyLevel: "medium",
    },
    {
        id: "11",
        ngoName: "Elderly Care Society",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Home Care Kits",
        description: "We are collecting donations to provide hygiene kits to elderly citizens in need.",
        urgencyLevel: "low",
    },
    {
        id: "12",
        ngoName: "Health First Initiative",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Vaccination Outreach",
        description: "Support our campaign to vaccinate children in remote areas against preventable diseases.",
        urgencyLevel: "high",
    },
    {
        id: "13",
        ngoName: "Green Coastline Project",
        ngoProfileImage: "https://via.placeholder.com/300?text=NGO+Logo",
        title: "Beach Cleanup Drive",
        description: "Join us in cleaning up coastal areas and preserving marine biodiversity.",
        urgencyLevel: "medium",
    }
];
