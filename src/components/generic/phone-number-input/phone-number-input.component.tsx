import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "flag-icons/css/flag-icons.min.css";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void; // This is the callback that the parent component provides
  error?: string;
  label?: string,
  maxLength?: number; // Optional prop to define the maximum length
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  label = "",
  error,
  maxLength = 15, // Default max length is 15
}) => {
  // Internal handler to adapt to the E164Number | undefined type and enforce maxLength
  const handlePhoneChange = (phoneValue: string | undefined) => {
    try {
      const sanitizedValue = phoneValue || ""; // Convert undefined to an empty string
      // Enforce maxLength
      if (sanitizedValue.length < maxLength) {
        onChange(sanitizedValue); // Pass the sanitized value to the parent component
      }
    } catch (error) {
      console.log(error)
      return
    }

  };

  return (
    <div>
      <label className="block text-xs font-bold text-dark/80">{label ? label : "Phone Number"}</label>
      <PhoneInput
        international
        defaultCountry="CD"
        value={value}
        onChange={handlePhoneChange} // Use the internal handler here
        className={`mt-1 block w-full px-3 py-[0.6rem] rounded-lg bg-black/5 text-black/70 text-sm font-semibold placeholder:text-gray-500/60 sm:text-sm ${
          error ? "border-red-500" : "border-gray-700/50"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;