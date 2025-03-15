import React from "react";

interface TextareaProps {
  label: string;
  value: any;
  name:string,
  id?:string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  rows?:number
}

const GenericTextarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  id,
  name,
  rows=3
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-black/70">{label}</label>
      <textarea
        value={value}
        id={id || name}
        onChange={onChange}
        rows={rows}
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

export default GenericTextarea;
