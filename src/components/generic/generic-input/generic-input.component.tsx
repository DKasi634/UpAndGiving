import React from "react";

interface InputProps {
  label: string;
  type: string;
  value: any;
  name:string,
  id?:string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const GenericInput: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  id,
  name
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-black/70">{label}</label>
      <input
        type={type}
        value={value}
        id={id || name}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className={`mt-1 block w-full px-3 py-[0.6rem] rounded-lg bg-black/5 text-black/70 text-sm font-semibold placeholder:text-gray-500/60 sm:text-sm ${
          error ? "border-red-500" : "border-gray-700/50"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default GenericInput;