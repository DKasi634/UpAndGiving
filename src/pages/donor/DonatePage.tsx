import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase/supabase.config";
import GenericInput from "@/components/generic/generic-input/generic-input.component";
import GenericTextarea from "@/components/generic/generic-input/generic-textarea.component";
import BaseButton from "@/components/generic/base-button/base-button.component";
import ImageUploadFormGroup from "@/components/generic/images-upload-input/image-upload-input.component";

type DonationItemType = {
    name: string,
    categoryId: string,
    description: string,
    condition: "new" | "used",
    images: string[]
}

type Category = {
    id: string,
    category_name: string,
    created_at: Date
}

const Donate = () => {
    const donationItemInitialValues: DonationItemType = {
        name: "",
        categoryId: "",
        description: "",
        condition: "new", // Default value
        images: [],
    }
    const [formData, setFormData] = useState<DonationItemType>(donationItemInitialValues);
    const [categories, setCategories] = useState<Category[]>([]); // List of categories
    const [errors, setErrors] = useState<Partial<Record<keyof DonationItemType, string>>>({}); // Validation errors
    const [loading, setLoading] = useState(false);

    const imagesUploadRef = useRef<{ uploadImages: () => Promise<string[]>, hasSelectedImages: () => boolean }>(null);


    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from("categories").select("*");
            if (error) console.error("Error fetching categories:", error);
            else setCategories(data as Category[]);
        };
        fetchCategories();
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file uploads
    // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    //     const files = e.target.files;
    //     if (!files || !files.length) {
    //         return
    //     }
    //     const uploadedImages: string[] = [];

    //     for (let file of files) {
    //         const { data, error } = await supabase.storage
    //             .from("donated-items")
    //             .upload(`${Date.now()}-${file.name}`, file);

    //         if (error) {
    //             console.error("Error uploading image:", error);
    //             return;
    //         }

    //         const publicUrl = supabase.storage
    //             .from("donated-items")
    //             .getPublicUrl(data.path).data.publicUrl;

    //         uploadedImages.push(publicUrl);
    //     }

    //     setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
    // };

    // Validate form fields
    const validateForm = () => {
        const newErrors: typeof errors = {}
        if (!formData.name) newErrors.name = "Item name is required.";
        if (!formData.categoryId) newErrors.categoryId = "Category is required.";
        if (!formData.description) newErrors.description = "Description is required.";
        if (!formData.condition) newErrors.condition = "Condition is required.";
        if (formData.images.length === 0) newErrors.images = "At least one image is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const { error } = await supabase.from("donated_items").insert([formData]);

        if (error) {
            console.error("Error submitting donation:", error);
            setLoading(false);
        } else {
            alert("Donation submitted successfully!");
            setFormData({
                name: "",
                categoryId: "",
                description: "",
                condition: "new",
                images: [],
            });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8">
            <h2 className="text-2xl font-bold text-center my-4">Donate an Item</h2>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg lg:shadow-lg w-full max-w-lg space-y-4 mx-auto"
            >
                

                {/* Item Name */}

                <GenericInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label="Item Name"
                    error={errors.name}
                />


                {/* Category Dropdown */}
                <div>
                    <label className="block text-xs font-bold text-black/70">Category</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 text-sm border border-transparent ${errors.categoryId ? "border-red-500" : ""
                            } rounded-lg shadow-sm focus:outline-none bg-black/5 text-black/70 `}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <p className="text-red-500 text-sm">{errors.categoryId}</p>
                    )}
                </div>

                {/* Description */}
                <GenericTextarea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        
                    />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description}</p>
                        )}


                {/* Condition */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Condition</label>
                    <div className="flex items-center justify-start gap-4 p-2">
                        <label className="cursor-pointer flex items-center justify-center text-xs font-bold text-black/70">
                            <input type="radio" name="condition" value="new" checked={formData.condition === "new"}
                                onChange={handleChange} className="mr-2"  />
                            New
                        </label>
                        <label className="cursor-pointer flex items-center justify-center text-xs font-bold text-black/70">
                            <input  type="radio"  name="condition" value="used" checked={formData.condition === "used"} onChange={handleChange}
                                className="mr-2" />
                            Used
                        </label>
                    </div>
                    {errors.condition && (
                        <p className="text-red-500 text-sm">{errors.condition}</p>
                    )}
                </div>

                {/* Image Upload */}
                <ImageUploadFormGroup label='Choose images' imagesLimit={1} folderPath='Univartize'
                    ref={imagesUploadRef} />
                
                <BaseButton
                    submitType="submit"
                    disabled={loading}
                    rounded={false}
                    className="w-full mx-auto xl:max-w-md mt-8 bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? "Submitting..." : "Donate Now"}
                </BaseButton>
            </form>
        </div>
    );
};

export default Donate;