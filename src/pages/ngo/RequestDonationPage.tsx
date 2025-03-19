import React, { useEffect, useRef, useState } from "react";
import GenericInput from "@/components/generic/generic-input/generic-input.component";
import GenericTextarea from "@/components/generic/generic-input/generic-textarea.component";
import BaseButton from "@/components/generic/base-button/base-button.component";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { DONATION_REQUEST_EMERGENCY_LEVELS, IDonationRequest, USER_ROLE_TYPE } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { getNewUUID } from "@/utils";
import ImageUploadFormGroup from "@/components/generic/images-upload-input/image-upload-input.component";
import { createOrUpdateDonationRequest } from "@/utils/supabase/supabase.utils";
import { setErrorToast } from "@/store/toast/toast.actions";
import { getCustomError } from "@/utils/error.utils";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";

const RequestDonation = () => {
  const [thisDonationRequest, setThisDonationRequest] = useState<IDonationRequest>({
    id: getNewUUID(),
    ngo_profile_id: "",
    title: "",
    description: "",
    urgency_level: DONATION_REQUEST_EMERGENCY_LEVELS.MEDIUM, // Default value,
    created_at: new Date(),
    image: "",
    disabled:true,
  });
  const [errors, setErrors] = useState<{ title: string, description: string, urgency_level: string } >({ title: "", description: "", urgency_level: "" });
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const imagesUploadRef = useRef<{ uploadImages: () => Promise<string[]>, hasSelectedImages: () => boolean, getAvailableRemoteImages: () => string[] }>(null);


  useEffect(() => {
    if(currentUser && currentUser.profile){
      setThisDonationRequest(prev => ({...prev, ngo_profile_id:currentUser.profile?.id} as IDonationRequest))
    }
    if (currentUser && currentUser.user && currentUser.user.role !== USER_ROLE_TYPE.NGO) {
      navigate("/not-found", { replace: true })
    }
  }, [currentUser])

  useEffect(() => {
    if (canCreate && thisDonationRequest) {
      createRequest(thisDonationRequest);
      setCanCreate(false);
      setLoading(false)
    }
  }, [canCreate])

  const showErrorToast = (message: string) => {
    dispatch(setErrorToast(message))
  }

  const createRequest = async (donationRequest: IDonationRequest) => {
    try {
      const createdRequest = await createOrUpdateDonationRequest(donationRequest);
      if (createdRequest) {
        navigate(`/me/single-request/${createdRequest.id}`)
      } else {
        throw new Error("Could not create request")
      }
    } catch (error) {
      showErrorToast(getCustomError(error).message)
    }
  }

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setThisDonationRequest((prev) => ({ ...prev, [name]: value }));
  };


  // Validate form fields
  const validateForm = () => {
    const localErrors:{ title: string, description: string, urgency_level: string }  = {title: "", description: "", urgency_level: "" };
    if (!thisDonationRequest.title) {localErrors.title = "Request title is required."};
    if (!thisDonationRequest.description)
      {localErrors.description = "Request description is required."};
    if (!thisDonationRequest.urgency_level || !thisDonationRequest.urgency_level.trim()) {
      localErrors.urgency_level = "Urgency level is required"
    }
    
      setErrors(localErrors);
    console.log("\nErrors length : ", Object.keys(localErrors).length)
    return !Object.values(localErrors).some(errorValue => errorValue.trim() !== ""); // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Starting submit with validate ")
    e.preventDefault();
    if (!validateForm() || loading) { return };
    console.log("First check passed !")
    setLoading(true);

    if (imagesUploadRef.current && !thisDonationRequest.image) {
      if (imagesUploadRef.current.hasSelectedImages()) {
        const uploadedImages = await imagesUploadRef.current.uploadImages();
        if (uploadedImages.length) {
          setThisDonationRequest(prev => ({ ...prev, image: uploadedImages[0] }))
        }
      } else {
        showErrorToast("You need to choose an image")
      }
    }
    setCanCreate(true)

  };

  return (
    <div className="min-h-screen bg-gray-100/20 flex flex-col items-center justify-start py-8 relative">
      <h2 className="text-2xl font-bold text-center my-8">Create a Donation Request</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg space-y-6  lg:shadow-lg w-full max-w-lg mx-auto"
      >


        {/* Request Title */}
        <GenericInput
          label="Request Title"
          type="text"
          name="title"
          value={thisDonationRequest.title}
          onChange={handleChange}
          placeholder="Enter the title of your request"
          error={errors.title}
        />

        {/* Request Description */}
        <GenericTextarea
          label="Request Description"
          name="description"
          value={thisDonationRequest.description}
          onChange={handleChange}
          placeholder="Describe your donation request in detail"
          error={errors.description}
        />

        {/* Urgency Level */}
        <div>
          <label className="block text-xs font-bold text-black/70">
            Urgency Level
          </label>
          <select
            name="urgency_level"
            value={thisDonationRequest.urgency_level}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-[0.6rem] rounded-lg bg-black/5 text-black/70 text-sm font-semibold border-gray-700/50"
          >
            <option value="" disabled>Choose here</option>
            <option value={DONATION_REQUEST_EMERGENCY_LEVELS.LOW}>Low</option>
            <option value={DONATION_REQUEST_EMERGENCY_LEVELS.MEDIUM}>Medium</option>
            <option value={DONATION_REQUEST_EMERGENCY_LEVELS.HIGH}>High</option>
          </select>
        </div>
        <ImageUploadFormGroup label='Choose image' imagesLimit={1} folderPath='DonationRequests'
          ref={imagesUploadRef} />
        {/* Submit Button */}
        <BaseButton
          submitType="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </BaseButton>
      </form>
      { loading && <AbsoluteLoaderLayout/> }
    </div>
  );
};

export default RequestDonation;