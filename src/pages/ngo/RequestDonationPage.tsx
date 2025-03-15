import React, { useState } from "react";
import GenericInput from "@/components/generic/generic-input/generic-input.component";
import GenericTextarea from "@/components/generic/generic-input/generic-textarea.component";
import { supabase } from "@/utils/supabase/supabase.config";
import { DonationRequest } from "@/types";
import BaseButton from "@/components/generic/base-button/base-button.component";

const RequestDonation = () => {
  const [formData, setFormData] = useState<DonationRequest>({
    id:"", 
    ngoProfileImage:"",
    ngoName: "",
    title: "",
    description: "",
    urgencyLevel: "medium", // Default value
  });
  const [errors, setErrors] = useState<Partial<DonationRequest>>({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // Validate form fields
  const validateForm = () => {
    const newErrors: Partial<DonationRequest> = {};
    if (!formData.ngoName) newErrors.ngoName = "NGO name is required.";
    if (!formData.title) newErrors.title = "Request title is required.";
    if (!formData.description)
      newErrors.description = "Request description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await supabase.from("donation_requests").insert([formData]);

    if (error) {
      console.error("Error submitting request:", error);
      setLoading(false);
    } else {
      alert("Request submitted successfully!");
      setFormData({
        ngoName: "",
        ngoProfileImage:"",
        id:"",
        title: "",
        description: "",
        urgencyLevel: "medium",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100/20 flex flex-col items-center justify-start py-8">
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
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter the title of your request"
          error={errors.title}
        />

        {/* Request Description */}
        <GenericTextarea
          label="Request Description"
          name="description"
          value={formData.description}
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
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-[0.6rem] rounded-lg bg-black/5 text-black/70 text-sm font-semibold border-gray-700/50"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Submit Button */}
        <BaseButton
          submitType="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </BaseButton>
      </form>
    </div>
  );
};

export default RequestDonation;