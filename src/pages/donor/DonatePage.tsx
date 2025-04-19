import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase/supabase.config";
import GenericInput from "@/components/generic/generic-input/generic-input.component";
import GenericTextarea from "@/components/generic/generic-input/generic-textarea.component";
import BaseButton from "@/components/generic/base-button/base-button.component";
import ImageUploadFormGroup from "@/components/generic/images-upload-input/image-upload-input.component";
import { useDispatch, useSelector } from "react-redux";
import { setErrorToast } from "@/store/toast/toast.actions";
import { DONATION_STATUSES, IDonation, IProfile, USER_ROLE_TYPE } from "@/api/types";
import { useNavigate, useParams } from "react-router-dom";
import { createOrUpdateDonation, getDonationById } from "@/utils/supabase/supabase.utils";
import { getNewUUID } from "@/utils";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";


type Category = {
    id: string,
    category_name: string,
    created_at: Date
}

type DonatePageProps = {
    mode: "CREATE" | "EDIT"
}

const Donate = ({ mode = "CREATE" }: DonatePageProps) => {

    const donationItemInitialValues: IDonation = {
        id: getNewUUID(),
        donor_id: "",
        status: DONATION_STATUSES.PENDING,
        created_at: new Date(),
        name: "",
        category_id: "",
        description: "",
        // condition: "NEW",
        images: [],

    }

    let donationId: string | null = null;
    if (mode === "EDIT") {
        const donationParams = useParams<{ donationId: string }>() as { donationId: string };
        donationId = donationParams.donationId
    }
    const [thisDonation, setThisDonation] = useState<IDonation>(donationItemInitialValues);
    const [categories, setCategories] = useState<Category[]>([]); // List of categories
    const [errors, setErrors] = useState<Partial<Record<keyof IDonation, string>>>({}); // Validation errors
    const [errorValue, setErrorValue] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [canCreateDonation, setCanCreateDonation] = useState(false);
    const currentUser = useSelector(selectCurrentUser);

    const imagesUploadRef = useRef<{ uploadImages: () => Promise<string[]>, hasSelectedImages: () => boolean, getAvailableRemoteImages: () => string[] }>(null);

    const showErrorToast = (message: string) => {
        dispatch(setErrorToast(message));
    };
    useEffect(() => {
        if (errorValue.trim()) {
            showErrorToast(errorValue)
        }
    }, [errorValue])

    useEffect(()=>{
        if(currentUser && currentUser.user?.role !== USER_ROLE_TYPE.DONOR){
            navigate("/me/dashboard", {replace:true})
        }
        if(currentUser.profile && currentUser.profile.id){
                setThisDonation(prev => ({...prev, donor_id:(currentUser.profile as IProfile).id }))
        }
    }, [currentUser])

    useEffect(() => {
        if (donationId && donationId.trim()) {
            fetchDonation(donationId)
        }
    }, [donationId])

    useEffect(() => {
        if (canCreateDonation) {
            createDonation(thisDonation)
        }

    }, [canCreateDonation])

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from("categories").select("*");
            if (error) console.error("Error fetching categories:", error);
            else setCategories(data as Category[]);
        };
        fetchCategories();
    }, []);

    const fetchDonation = async (donationId: string) => {
        try {
            const thisDonation = await getDonationById(donationId);
            if (thisDonation) { 
                setThisDonation(thisDonation) }
        } catch (error) {

        }
    }

    const createDonation = async (donation: IDonation) => {
        try {
            const createdDonation = await createOrUpdateDonation(donation);
            if (!createdDonation) { showErrorToast("Oops ! Something went wrong, we could not complete this operation"); return }
            navigate(`/me/single-donation/${createdDonation.id}`)
        } catch (error) {
            showErrorToast("Oops ! Something went wrong, we could not complete this operation")
        } finally {
            setLoading(false)
        }
    }

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setThisDonation((prev) => ({ ...prev, [name]: value }));
    };


    // Validate form fields
    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!thisDonation.name) { setErrorValue("Item name is required"); newErrors.name = errorValue; return };
        if (!thisDonation.category_id) { setErrorValue("Category is required"); newErrors.category_id = errorValue; return }
        if (!thisDonation.description) { setErrorValue("Description is required"); newErrors.description = errorValue; return }
        // if (!thisDonation.condition) { setErrorValue("Condition is required"); newErrors.condition = errorValue; return }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) { return }
        setLoading(true);
        if (!imagesUploadRef.current || !imagesUploadRef.current.hasSelectedImages) {
            setErrorValue("You need to select at least one image"); return
        }
        if (imagesUploadRef.current) {
            if (!imagesUploadRef.current.hasSelectedImages() && !thisDonation.images.length) { showErrorToast("Choose at least one image, max 3"); return }
            const uploadedImagesUrls = await imagesUploadRef.current.uploadImages();
            const initialAvailableImages = imagesUploadRef.current.getAvailableRemoteImages();
            if (!uploadedImagesUrls.length && !thisDonation.images.length) { showErrorToast("Failed to upload images. Check your network and try again"); return }

            setThisDonation(prev => ({ ...prev, images: [...uploadedImagesUrls, ...initialAvailableImages] }));
            setCanCreateDonation(true);
        }
        if (!validateForm()) return;
    };

    return (
        <>
            <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8">
                <h2 className="text-2xl font-bold text-center my-4">Donate an Item</h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg lg:shadow-lg w-full max-w-lg space-y-4 mx-auto"
                >


                    {/* Item Name */}

                    <GenericInput
                        type="text"
                        name="name"
                        value={thisDonation.name}
                        onChange={handleChange}
                        label="Item Name"
                        error={errors.name}
                    />


                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-black/70">Category</label>
                        <select
                            name="category_id"
                            value={thisDonation.category_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 text-sm border border-transparent ${errors.category_id ? "border-red-500" : ""
                                } rounded-lg shadow-sm focus:outline-none bg-black/5 text-black/70 `}
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-500 text-sm">{errors.category_id}</p>
                        )}
                    </div>

                    {/* Description */}
                    <GenericTextarea
                        label="Description"
                        name="description"
                        value={thisDonation.description}
                        onChange={handleChange}
                        rows={3}

                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description}</p>
                    )}


                    {/* Condition */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Condition</label>
                        <div className="flex items-center justify-start gap-4 p-2">
                            <label className="cursor-pointer flex items-center justify-center text-xs font-bold text-black/70">
                                <input type="radio" name="condition" value="new" checked={thisDonation.condition === "NEW"}
                                    onChange={handleChange} className="mr-2" />
                                New
                            </label>
                            <label className="cursor-pointer flex items-center justify-center text-xs font-bold text-black/70">
                                <input type="radio" name="condition" value="used" checked={thisDonation.condition === "USED"} onChange={handleChange}
                                    className="mr-2" />
                                Used
                            </label>
                        </div>
                        {errors.condition && (
                            <p className="text-red-500 text-sm">{errors.condition}</p>
                        )}
                    </div> */}

                    {/* Image Upload */}
                    <ImageUploadFormGroup label='Choose images' initialImages={thisDonation.images} imagesLimit={1} folderPath='Donations'
                        ref={imagesUploadRef} />

                    <BaseButton
                        submitType="submit"
                        disabled={loading}
                        rounded={false}
                        className="w-full mx-auto xl:max-w-md mt-8 bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-500"
                    >
                        {loading ? "Submitting..." : "Donate Now"}
                    </BaseButton>
                </form>
                {loading && <AbsoluteLoaderLayout/>}
            </div>
        </>
    );
};

export default Donate;