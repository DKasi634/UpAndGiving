import { DonationItemType } from "@/components/donor/donation-item.component";
import { MenuItemType } from "@/components/menu-item.component";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaHandHoldingHeart } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";


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
      path: "/dashboard",
    },
    {
      icon: <FaHandHoldingHeart />,
      label: "Donate",
      name: "donate",
      path: "/donate",
    },
    {
      icon: <IoSearchOutline />,
      label: "Browse",
      name: "browse",
      path: "/browse",
    },
  ];