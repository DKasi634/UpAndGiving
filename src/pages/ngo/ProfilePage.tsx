import React, { useState } from "react";
import GenericInput from "@/components/generic/generic-input/generic-input.component";
import GenericTextarea from "@/components/generic/generic-input/generic-textarea.component";
import { supabase } from "@/utils/supabase/supabase.config";
import { NGOProfile } from "@/types";

const ProfilePage: React.FC<{ initialProfile: NGOProfile }> = ({
  initialProfile,
}) => {
  const [profile, setProfile] = useState<NGOProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
  const [errors, setErrors] = useState<Partial<NGOProfile>>({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(`ngo-profiles/${Date.now()}-${file.name}`, file);

    if (error) {
      console.error("Error uploading image:", error);
      return;
    }

    const publicUrl = supabase.storage
      .from("images")
      .getPublicUrl(data.path).data.publicUrl;

    setProfile((prev) => ({ ...prev, profileImage: publicUrl }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Partial<NGOProfile> = {};
    if (!profile.name) newErrors.name = "Name is required.";
    if (!profile.bio) newErrors.bio = "Bio is required.";
    if (!profile.location) newErrors.location = "Location is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle saving changes
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await supabase
      .from("ngos")
      .update(profile)
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    } else {
      alert("Profile updated successfully!");
      setIsEditing(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">NGO Profile</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src={profile.profileImage}
            alt={`${profile.name} Profile`}
            className="w-32 h-32 rounded-full object-cover"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          )}
        </div>

        {/* NGO Name */}
        {isEditing ? (
          <GenericInput
            label="NGO Name"
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Enter the name of your NGO"
            error={errors.name}
          />
        ) : (
          <p className="text-lg font-semibold text-center">{profile.name}</p>
        )}

        {/* Bio/Description */}
        {isEditing ? (
          <GenericTextarea
            label="Bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about your NGO"
            error={errors.bio}
          />
        ) : (
          <p className="text-sm text-gray-600 text-center">{profile.bio}</p>
        )}

        {/* Location */}
        {isEditing ? (
          <GenericInput
            label="Location"
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            placeholder="Enter your area of activity"
            error={errors.location}
          />
        ) : (
          <p className="text-sm text-gray-600 text-center">{profile.location}</p>
        )}

        {/* Edit/Save Buttons */}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;