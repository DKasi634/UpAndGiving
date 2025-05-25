import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase/supabase.config";
import GenericInput from "@/components/generic/generic-input/generic-input.component";
import GenericTextarea from "@/components/generic/generic-input/generic-textarea.component";
import BaseButton from "@/components/generic/base-button/base-button.component";
import ImageUploadFormGroup from "@/components/generic/images-upload-input/image-upload-input.component";
import { useDispatch, useSelector } from "react-redux";
import { setErrorToast } from "@/store/toast/toast.actions";
import { DIRECT_DONATION_STATUSES, IDirectDonation, IProfile, USER_ROLE_TYPE } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { createDirectDonation } from "@/utils/supabase/supabase.utils";
import { getNewUUID } from "@/utils";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import AbsoluteLoaderLayout from "@/components/generic/loader/absolute-loader-layout.component";

type Category = {
    id: string;
    category_name: string;
    created_at: Date;
};

const PostDirectDonationPage = () => {
    const directDonationInitialValues: IDirectDonation = {
        id: getNewUUID(),
        donor_id: "",
        status: DIRECT_DONATION_STATUSES.AVAILABLE,
        created_at: new Date(),
        name: "",
        category_id: "",
        description: "",
        images: [],
        claimer_id:null
    };

    const [thisDirectDonation, setThisDirectDonation] = useState<IDirectDonation>(directDonationInitialValues);
    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof IDirectDonation, string>>>({});
    const [errorValue, setErrorValue] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);

    const imagesUploadRef = useRef<{
        uploadImages: () => Promise<string[]>;
        hasSelectedImages: () => boolean;
        getAvailableRemoteImages: () => string[];
    }>(null);

    const showErrorToast = (message: string) => {
        dispatch(setErrorToast(message));
    };

    useEffect(() => {
        if (errorValue.trim()) {
            showErrorToast(errorValue);
        }
    }, [errorValue]);

    useEffect(() => {
        if (currentUser && currentUser.user?.role !== USER_ROLE_TYPE.DONOR) {
            navigate("/me/dashboard", { replace: true });
        }
        if (currentUser.profile && currentUser.profile.id) {
            setThisDirectDonation((prev) => ({ ...prev, donor_id: (currentUser.profile as IProfile).id }));
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from("categories").select("*");
            if (error) console.error("Error fetching categories:", error);
            else setCategories(data as Category[]);
        };
        fetchCategories();
    }, []);

    const createDirectDonationHandler = async (donation: IDirectDonation) => {
        console.log("\n\nTrying to create donation: ", donation)
        try {
            const createdDonation = await createDirectDonation(donation);
            if (!createdDonation) {
                showErrorToast("Oops! Something went wrong, we could not complete this operation");
                return;
            }
            navigate(`/me/direct-donations/${createdDonation.id}`);
        } catch (error) {
            showErrorToast("Oops! Something went wrong, we could not complete this operation");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setThisDirectDonation((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!thisDirectDonation.name) {
            setErrorValue("Item name is required");
            newErrors.name = errorValue;
            return false;
        }
        if (!thisDirectDonation.category_id) {
            setErrorValue("Category is required");
            newErrors.category_id = errorValue;
            return false;
        }
        if (!thisDirectDonation.description) {
            setErrorValue("Description is required");
            newErrors.description = errorValue;
            return false;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        if (!imagesUploadRef.current || !imagesUploadRef.current.hasSelectedImages) {
            setErrorValue("You need to select at least one image");
            setLoading(false);
            return;
        }
        if (imagesUploadRef.current) {
            if (!imagesUploadRef.current.hasSelectedImages() && !thisDirectDonation.images.length) {
                showErrorToast("Choose at least one image, max 3");
                setLoading(false);
                return;
            }
            const uploadedImagesUrls = await imagesUploadRef.current.uploadImages();
            const initialAvailableImages = imagesUploadRef.current.getAvailableRemoteImages();
            if (!uploadedImagesUrls.length && !thisDirectDonation.images.length) {
                showErrorToast("Failed to upload images. Check your network and try again");
                setLoading(false);
                return;
            }
            const updatedDonation = { ...thisDirectDonation, images: [...uploadedImagesUrls, ...initialAvailableImages] };
            if (validateForm()) {
                createDirectDonationHandler(updatedDonation);
            } else {
                setLoading(false);
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8">
            <h2 className="text-2xl font-bold text-center my-4">Post Direct Donation</h2>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg lg:shadow-lg w-full max-w-lg space-y-4 mx-auto"
            >
                <p className="text-sm text-gray-600">
                    Your direct donation will be immediately visible to other users (not NGOs) and can be claimed on a first-come, first-served basis.
                </p>

                <GenericInput
                    type="text"
                    name="name"
                    value={thisDirectDonation.name}
                    onChange={handleChange}
                    label="Item Name"
                    error={errors.name}
                />

                <div>
                    <label className="block text-xs font-bold text-black/70">Category</label>
                    <select
                        name="category_id"
                        value={thisDirectDonation.category_id}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 text-sm border border-transparent ${
                            errors.category_id ? "border-red-500" : ""
                        } rounded-lg shadow-sm focus:outline-none bg-black/5 text-black/70`}
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
                </div>

                <GenericTextarea
                    label="Description"
                    name="description"
                    value={thisDirectDonation.description}
                    onChange={handleChange}
                    rows={3}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                <ImageUploadFormGroup
                    label="Choose images"
                    initialImages={thisDirectDonation.images}
                    imagesLimit={1}
                    folderPath="DirectDonations"
                    ref={imagesUploadRef}
                />

                <BaseButton
                    submitType="submit"
                    disabled={loading}
                    rounded={false}
                    className="w-full mx-auto xl:max-w-md mt-8 bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-500"
                >
                    {loading ? "Submitting..." : "Post Direct Donation"}
                </BaseButton>
            </form>
            {loading && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default PostDirectDonationPage;