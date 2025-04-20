import React, { useEffect, useRef, useState } from "react";
import GenericInput from "@/components/generic/generic-input/generic-input.component";
import GenericTextarea from "@/components/generic/generic-input/generic-textarea.component";
import { NGOProfile } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthLoading, selectCurrentUser } from "@/store/auth/auth.selector";
import { IProfile, USER_ROLE_TYPE } from "@/api/types";
import { useNavigate } from "react-router-dom";
import NotFoundPage from "../errors/not-found.page";
import BaseButton, { buttonType } from "@/components/generic/base-button/base-button.component";
import GenericImage from "@/components/generic/generic-image/generic-image.component";
import ImageUploadFormGroup from "@/components/generic/images-upload-input/image-upload-input.component";
import { logoutStart, updateProfileStart } from "@/store/auth/auth.actions";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";
import { PiSignOutBold } from "react-icons/pi";

const ProfilePage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentUserLoading = useSelector(selectAuthLoading);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
  const [errors, setErrors] = useState<Partial<NGOProfile>>({});
  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const imagesUploadRef = useRef<{ uploadImages: () => Promise<string[]>, hasSelectedImages: () => boolean, getAvailableRemoteImages: () => string[] }>(null);


  useEffect(() => {
    if (currentUser.user && currentUser.profile) {
      setProfile(currentUser.profile)
    } else {
      navigate("/not-found", { replace: true })
    }
  }, [currentUser])

  useEffect(() => {
    if (canSave && profile) {
      dispatch(updateProfileStart(profile));
      setLoading(false);
      setCanSave(false);
      setIsEditing(false);
    }
  }, [canSave])


  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value } as IProfile));
  };

  const handleSignout = () => {
    dispatch(logoutStart())
  }


  // Validate form fields
  const validateForm = () => {
    const newErrors: Partial<IProfile> = {};
    if (!profile) { return }
    if (!profile.name) newErrors.name = "Name is required.";
    if (!profile.bio && currentUser.user?.role === USER_ROLE_TYPE.NGO) newErrors.bio = "Bio is required.";
    if (!profile.location && currentUser.user?.role === USER_ROLE_TYPE.NGO) newErrors.location = "Location is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle saving changes
  const handleSave = async () => {
    if (!validateForm() || !profile) { return };
    setLoading(true);

    if (imagesUploadRef.current && imagesUploadRef.current.hasSelectedImages()) {
      const uploadedImages = await imagesUploadRef.current.uploadImages();
      if (uploadedImages.length) { setProfile(prev => ({ ...prev, profile_image: uploadedImages[0] } as IProfile)) }
    }
    setCanSave(true)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      {
        currentUser.profile ?
          <div className="md:bg-white p-8 md:rounded-lg md:shadow-lg w-full max-w-xl space-y-2">
            <h2 className="text-2xl font-bold text-center"> {currentUser.user?.role === USER_ROLE_TYPE.DONOR ? "User" : currentUser.user?.role === USER_ROLE_TYPE.NGO ? "NGO" : "Admin"} Profile</h2>

            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-32 aspect-square rounded-full overflow-hidden">
                <GenericImage src={currentUser.profile.profile_image} alt={`${currentUser.profile.name}`}
                  className="w-full h-full object-center object-contain" />
              </div>

              {isEditing && (

                <ImageUploadFormGroup label='Choose images' imagesLimit={1} folderPath='Profiles'
                  ref={imagesUploadRef} />
              )}
            </div>

            {/* NGO Name */}
            {isEditing ? (
              <GenericInput
                label="NGO Name"
                type="text"
                name="name"
                value={profile?.name || ''}
                onChange={handleChange}
                placeholder="Enter the name of your NGO"
                error={errors.name}
              />
            ) : (
              <p className="text-lg font-semibold text-center">{currentUser.profile.name}</p>
            )}

            {/* Bio/Description */}
            {isEditing ? (
              <GenericTextarea
                label="Bio"
                name="bio"
                value={profile?.bio ? profile?.bio : ""}
                onChange={handleChange}
                placeholder="Tell us about your NGO"
                error={errors.bio}
              />
            ) : (
              <p className="text-sm text-gray-600 text-center">{currentUser.profile.bio}</p>
            )}

            {/* Location */}
            {isEditing ? (
              <GenericInput
                label="Location"
                type="text"
                name="location"
                value={profile?.location || ""}
                onChange={handleChange}
                placeholder="Enter your area of activity"
                error={errors.location}
              />
            ) : (
              <p className="text-sm text-gray-600 text-center">{currentUser.profile.location}</p>
            )}

            {/* Edit/Save Buttons */}
            <div className="flex justify-between items-center mt-12 w-full">
              {isEditing ? (
                <>
                  <BaseButton
                    clickHandler={() => setIsEditing(false)}
                    type={buttonType.clear}
                    className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
                  >
                    Cancel
                  </BaseButton>
                  <BaseButton
                    clickHandler={handleSave}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 focus:outline-none ">
                    {loading ? "Saving..." : "Save Changes"}
                  </BaseButton>
                </>
              ) : (
                <>
                  <BaseButton clickHandler={handleSignout} className="!px-6 !text-xs !font-bold !py-[0.4rem] bg-indigo-600 rounded-3xl text-white">
                    <> <span className="hidden md:inline">Logout</span> <span className=""><PiSignOutBold className="text-xl" /></span> </>
                  </BaseButton>
                  <BaseButton
                    clickHandler={() => setIsEditing(true)}
                    className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
                  >
                    Edit Profile
                  </BaseButton>
                </>
              )}
            </div>
          </div> :
          <NotFoundPage />
      }
      {(loading || currentUserLoading) && <AbsoluteLoaderLayout />}
    </div>
  );
};

export default ProfilePage;


