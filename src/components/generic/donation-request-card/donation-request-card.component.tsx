
import React, { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import GenericImage from "../generic-image/generic-image.component";
import BaseButton, { buttonType } from "../base-button/base-button.component";
import { IDonationRequest, IProfile, USER_ROLE_TYPE } from "@/api/types";
import { disableDonationRequest, enableDonationRequest, getProfileByProfileId } from "@/utils/supabase/supabase.utils";
import AbsoluteLoaderLayout from "../loader/absolute-loader-layout.component";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { setErrorToast } from "@/store/toast/toast.actions";

type DonationRequestCardProps = {
  request: IDonationRequest;
  className?: string; // Optional className for additional styling
};

const DonationRequestCard: React.FC<DonationRequestCardProps> = ({
  request,
  className = "",
}) => {

  const [thisRequestNGOProfile, setThisRequestNGOProfile] = useState<IProfile | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const [thisDonationRequest, setThisDonationRequest] = useState<IDonationRequest>(request)
  const [currentUserRole, setCurrentUserRole] = useState<USER_ROLE_TYPE | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (request) {
      fetchRequestNGO(request.ngo_profile_id)
    }
  }, [request]);

  useEffect(() => {
    if (currentUser && currentUser.user) {
      setCurrentUserRole(currentUser.user.role)
    }
  }, [currentUser])

  const showError = (message: string) => {
    dispatch(setErrorToast(message))
  }

  const fetchRequestNGO = async (ngo_profile_id: string) => {
    setIsloading(true)
    const ngoProfile = await getProfileByProfileId(ngo_profile_id);
    if (ngoProfile) { setThisRequestNGOProfile(ngoProfile) }
    setIsloading(false);
  }

  const handleApproveDonationRequest = async (donationId: string) => {
    setIsloading(true);
    const enabledDonation = await enableDonationRequest(donationId);
    if (!enabledDonation) {
      showError("Oops, something went wrong, try again !"); return
    } else { setThisDonationRequest(enabledDonation); }

    setIsloading(false);
  }
  const handleRejectDonationRequest = async (donationId: string) => {
    setIsloading(true);
    const rejectedDonationRequest = await disableDonationRequest(donationId);
    if (!rejectedDonationRequest) {
      showError("Oops, something went wrong, try again !")
    } else { setThisDonationRequest(rejectedDonationRequest); }

    setIsloading(false);
  }

  return (
    <div
      className={`bg-white relative rounded-lg shadow-sm shadow-black/10 overflow-hidden transition-transform hover:scale-[1.02] ${className}`}
    >
      {/* NGO Profile Image */}
      <GenericImage
        src={request.image}
        alt={`${request.title} Profile`}
        className="w-full h-40 object-cover"
      />

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* NGO Name */}
        <h3 className="text-lg font-extrabold text-black/60 line-clamp-1">{thisRequestNGOProfile?.name}</h3>

        {/* Request Title */}
        <h4 className="text-sm font-semibold text-indigo-600 line-clamp-1">{request.title}</h4>

        {/* Request Description */}
        <p className="text-xs text-gray-600 line-clamp-2">
          {request.description}
        </p>

        {/* Buttons */}
        <div className="flex justify-center items-center mt-4 px-6">

        </div>
        <div className="flex items-center justify-center w-full pt-4 gap-3">
          <BaseButton href={`/me/single-request/${request.id}`} className="!px-4 !py-[0.4rem] !text-xs"> <FiEye className="mr-1" /> View</BaseButton>
          {(currentUser && currentUserRole === USER_ROLE_TYPE.NGO && thisDonationRequest.ngo_profile_id === currentUser.profile?.id) &&
            <BaseButton href={`/me/edit-request-donation/${request.id}`} className="!px-4 !py-[0.4rem] !text-xs"> <FiEye className="mr-1" /> Edit</BaseButton>
          }
          {
            (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && !thisDonationRequest.disabled) &&
            <BaseButton clickHandler={() => handleApproveDonationRequest(thisDonationRequest.id)} className="!px-4 !py-[0.4rem] !text-xs">Enable</BaseButton>
          }
          {
            (currentUser && currentUserRole === USER_ROLE_TYPE.ADMIN && thisDonationRequest.disabled) &&
            <BaseButton type={buttonType.dark} clickHandler={() => handleRejectDonationRequest(thisDonationRequest.id)} className="!px-4 !py-[0.4rem] !text-xs">Disable</BaseButton>
          }
        </div>
      </div>
      {isLoading && <AbsoluteLoaderLayout />}
    </div>
  );
};

export default DonationRequestCard;