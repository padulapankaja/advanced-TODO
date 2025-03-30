import React from "react";
import Button from "./Button";
import { FormActionsProps } from "../../types/todoTypes";

const FormActions: React.FC<FormActionsProps> = ({ onCancel, onSave }) => {
  return (
    <div className="flex gap-4 mt-4 justify-end">
      <Button variant="secondary" onClick={onCancel} size="medium">
        Cancel
      </Button>
      <Button variant="primary" onClick={onSave} size="medium">
        Save
      </Button>
    </div>
  );
};

export default FormActions;
