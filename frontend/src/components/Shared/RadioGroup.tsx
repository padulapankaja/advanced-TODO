import { FormData, RadioGroupProps } from "../../types/todoTypes";

export const RadioGroup: React.FC<RadioGroupProps> = ({
  id,
  label,
  options,
  register,
  errorMessage,
  required,
}) => {
  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-x-3">
            <input
              {...register(id as keyof FormData, {
                required: `Please select a ${label.toLowerCase()}`,
              })}
              id={option.value}
              name={id}
              type="radio"
              value={option.value}
              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus:outline-indigo-600"
            />
            <label
              htmlFor={option.value}
              className="block text-sm font-medium text-gray-900"
            >
              {option.label}
            </label>
          </div>
        ))}
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    </div>
  );
};
export default RadioGroup;
