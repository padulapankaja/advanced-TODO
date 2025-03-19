import React from "react";

interface FormActionsProps {
  onCancel?: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({ onCancel }) => {
  return (
    <div className="mt-6 flex items-center justify-end gap-x-6">
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-semibold text-gray-900"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-2 focus:outline-indigo-600"
      >
        Save
      </button>
    </div>
  );
};

export default FormActions;
