import { UseFormRegister } from "react-hook-form";
import { FormData } from "../../types/todoTypes";

// Input Field Component
interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegister<FormData>;
  required?: boolean;
  errorMessage?: string;
  autoComplete?: string;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  register,
  required = false,
  errorMessage,
  autoComplete,
  placeholder,
}) => {
  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <div className="mt-2">
        <input
          {...register(id as keyof FormData, {
            required: required ? errorMessage || `${label} is required` : false,
          })}
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    </div>
  );
};
export default InputField;
