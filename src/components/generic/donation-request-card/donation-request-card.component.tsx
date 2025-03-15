import { DonationRequest } from "@/types";
import React from "react";
import { FaDonate } from "react-icons/fa"; // Import icons
import { FiEye } from "react-icons/fi";
import GenericImage from "../generic-image/generic-image.component";
import BaseButton, { buttonType } from "../base-button/base-button.component";

type DonationRequestCardProps = {
  request: DonationRequest;
  className?: string; // Optional className for additional styling
};

const DonationRequestCard: React.FC<DonationRequestCardProps> = ({
  request,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm shadow-black/10 overflow-hidden transition-transform hover:scale-[1.02] ${className}`}
    >
      {/* NGO Profile Image */}
      <GenericImage
        src={request.ngoProfileImage}
        alt={`${request.ngoName} Profile`}
        className="w-full h-40 object-cover"
      />

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* NGO Name */}
        <h3 className="text-lg font-extrabold text-black/60 line-clamp-1">{request.ngoName}</h3>

        {/* Request Title */}
        <h4 className="text-sm font-semibold text-blue-600 line-clamp-1">{request.title}</h4>

        {/* Request Description */}
        <p className="text-xs text-gray-600 line-clamp-2">
          {request.description}
        </p>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          {/* View Button */}
          <BaseButton type={buttonType.clear} className=" text-indigo-500 hover:text-indigo-700">
            <FiEye className="mr-1" /> View
          </BaseButton>

          {/* Donate Button */}
          <BaseButton className=" bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
            <FaDonate className="mr-1" /> Donate
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

export default DonationRequestCard;