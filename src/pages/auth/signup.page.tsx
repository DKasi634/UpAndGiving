import GenericInput from "@/components/generic/generic-input/generic-input.component";
import PhoneNumberInput from "@/components/generic/phone-number-input/phone-number-input.component";
import PasswordInput from "@/components/generic/generic-input/password-input.component"; // Import the reusable PasswordInput
import React, { useEffect, useState } from "react";
import BaseButton, { buttonType } from "@/components/generic/base-button/base-button.component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, clearNavigateToSignIn, registerStart } from "@/store/auth/auth.actions";
import { selectAuthError, selectAuthLoading, selectCurrentUser, selectNavigateToSignIn } from "@/store/auth/auth.selector";
import { AuthError } from "@/utils/error.utils";
import LoaderLayout from "@/components/generic/loader/loader-layout.component";
import GoogleSigninButton from "@/components/generic/base-button/google-button.component";
import { nextRouteLocation } from "@/types";
import { parsePhoneNumber } from "react-phone-number-input";
// import { supabaseSignUp } from "@/utils/supabase/auth";


export type emailToVerifyState = {
  userEmail:string
}

const SignUpPage: React.FC = () => {

  const initialFormData = { firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirmPassword: "" }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const navigateToSignin = useSelector(selectNavigateToSignIn);


  const [signupError, setSignupError] = useState<AuthError | null>(authError);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialFormData);

  const location = useLocation();
  const nextLocation:nextRouteLocation = location.state;



  useEffect(() => {
    if (currentUser.user && currentUser.profile) {
      navigate("/me/dashboard")
    }
  }, [currentUser])

  useEffect(() => {
    if (navigateToSignin) {
      setFormData(initialFormData);
      const timer = setTimeout(() => {
        navigate("/auth/signin", {state: { userEmail:formData.email } as emailToVerifyState });
        dispatch(clearNavigateToSignIn())
      }, 4000);
      return () => clearTimeout(timer)
    }
  }, [navigateToSignin, navigate, dispatch])

  useEffect(() => {
    setSignupError(authError)
  }, [authError])

  useEffect(() => {
    if (signupError) {
      const timer = setTimeout(() => { 
        dispatch(clearAuthError()) 
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [signupError])

  const validateField = (field: keyof typeof formData, value: string) => {
    let error = "";
    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "Ce champ est obligatoire."; // This field is required.
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "L'email est obligatoire."; // Email is required.
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Format d'email invalide."; // Invalid email format.
        }
        break;
      case "phoneNumber":
        // if (!value.trim()) {
        //   error = "Le numéro de téléphone est obligatoire."; // Phone number is required.
        //   break;
        // }
        try {
          if (!parsePhoneNumber(value)?.isValid()) {
            error = "Numero invalide";
          }
        } catch (error) {
          error = "Numero invalide";
        }

        break;
      case "password":
        if (!value.trim()) {
          error = "Le mot de passe est obligatoire."; // Password is required.
        } else if (value.length < 6) {
          error = "Le mot de passe doit contenir au moins 6 caractères."; // Password must be at least 6 characters.
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Les mots de passe ne correspondent pas."; // Passwords do not match.
        }
        break;
      default:
        break;
    }
    return error;
  };

  // const handleCustomFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   const updatedFormData = { ...formData, [name]: value };
  //   setFormData(updatedFormData);
  //   const error = validateField(name as keyof typeof formData, value);
  //   setErrors({ ...errors, [name]: error });
  // };

  const handleNavigateToSignin = (e:React.MouseEvent<HTMLAnchorElement>) =>{
      e.preventDefault();
      navigate("/auth/signin", { state:nextLocation })
    }

  const handleCustomFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    const error = validateField(field, value);
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = Object.keys(formData).reduce((acc, field) => {
      const error = validateField(
        field as keyof typeof formData,
        formData[field as keyof typeof formData]
      );
      return { ...acc, [field]: error };
    }, {} as typeof errors);

    setErrors(formErrors);

    if (Object.values(formErrors).every((err) => !err)) {
      dispatch(registerStart(formData.firstName, formData.lastName, formData.email, formData.password, formData.phoneNumber))
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-16 px-4">
      <div className="w-full max-w-md p-8 space-y-3 lg:rounded-xl bg-white lg:shadow-lg">
        <h2 className="text-2xl font-bold text-center">S'inscrire</h2> {/* Sign Up */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name Group */}
          <div className="flex flex-col md:flex-row gap-4 md:space-x-4">
            <div className="md:w-1/2 md:pr-2">
              <GenericInput
                label="Prénom"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleCustomFieldChange("firstName", e.target.value)}
                error={errors.firstName}
                name="firstName"
                placeholder="Entrez votre prénom"
              />
            </div>
            <div className="md:w-1/2 md:pl-2">
              <GenericInput
                label="Nom"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleCustomFieldChange("lastName", e.target.value)}
                error={errors.lastName}
                name="lastName"
                placeholder="Entrez votre nom"
              />
            </div>
          </div>

          {/* Email */}
          <GenericInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleCustomFieldChange("email", e.target.value)}
            error={errors.email}
            name="email"
            placeholder="Entrez votre email"
          />

          {/* Phone Number */}
          <PhoneNumberInput
            value={formData.phoneNumber}
            onChange={(value) => handleCustomFieldChange("phoneNumber", value)}
            error={errors.phoneNumber}
          />

          {/* Password */}
          <PasswordInput
            label="Mot de passe"
            id="password"
            value={formData.password}
            onChange={(value) => handleCustomFieldChange("password", value)}
            error={errors.password}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirmez le mot de passe"
            id="confirm_password"
            value={formData.confirmPassword}
            onChange={(value) => handleCustomFieldChange("confirmPassword", value)}
            error={errors.confirmPassword}
          />

          <p className="w-full text-xs !mt-8">Vous avez déjà un compte ? <Link to={"/signin"} onMouseDown={handleNavigateToSignin} className="text-green font-bold px-2 underline-offset-2 underline">Se connecter</Link> </p>

          {/* Submit Button */}
          <BaseButton
            type={buttonType.blue} submitType="submit" rounded={false}
            className="w-full !px-4 !py-2 !mt-4 text-sm font-medium"
          >
            S'inscrire {/* Sign Up */
            }
          </BaseButton>

          <GoogleSigninButton />
        </form>
      </div>
      {authLoading && <LoaderLayout />}
    </div>
  );
};

export default SignUpPage;