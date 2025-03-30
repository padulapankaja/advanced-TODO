import { FormData, ToggleSwitchProps } from "../../types/todoTypes";

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  isChecked,
  register,
  onChange,
  children,
}) => {
  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
          <input
            {...register(id as keyof FormData)}
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            onChange={onChange}
          />
          <span
            className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
              isChecked ? "bg-[#4F39F6]" : "bg-[#CCCCCE]"
            }`}
          >
            <span
              className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
                isChecked ? "translate-x-6" : ""
              }`}
            ></span>
          </span>
        </label>
        {isChecked && children}
      </div>
    </div>
  );
};
export default ToggleSwitch;
