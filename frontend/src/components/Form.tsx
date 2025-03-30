import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  InputField,
  RadioGroup,
  ToggleSwitch,
  Select,
  FormActions,
} from "./Shared/index";

import { FormData, Incomplete } from "../types/todoTypes";
import { NOTIFICATION_MESSAGES } from "../util/const";

interface TaskFormProps {
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  inCompleted?: Incomplete[];
  title: string;
  description: string;
  data?: FormData;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  inCompleted,
  title,
  description,
  data,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: data?.title || "",
      priority: data?.priority || "low",
      isRecurrent: data?.isRecurring || false,
      isDependent: data?.isDependency || false,
      recurrencePattern: data?.recurrencePattern || "daily",
    },
    mode: "onBlur",
  });

  const isRecurrent = watch("isRecurrent");
  const isDependent = watch("isDependent");
  const handleRecurrent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue("isRecurrent", checked);
  };

  const handleDependent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue("isDependent", checked);
  };

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    trigger().then((isValid) => {
      if (isValid) {
        onSubmit(data);
        reset();
      } else console.log(NOTIFICATION_MESSAGES.ERROR);
    });
  };

  // Option configurations
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const recurrenceOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <form
      className="max-w-7xl mx-auto border-b border-gray-900/10 pb-12 p-4 my-auto"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-12">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-600">{description}</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <InputField
              id="title"
              label="Title"
              register={register}
              required
              errorMessage={errors.title?.message}
              autoComplete="given-name"
            />

            <RadioGroup
              id="priority"
              label="Priority"
              options={priorityOptions}
              register={register}
              errorMessage={errors.priority?.message}
              required
              // ref={priorityRef}
            />

            <ToggleSwitch
              id="isRecurrent"
              label="Is Recurring task?"
              isChecked={isRecurrent}
              register={register}
              onChange={handleRecurrent}
            >
              {isRecurrent && (
                <Select
                  id="recurrencePattern"
                  register={register}
                  options={recurrenceOptions}
                />
              )}
            </ToggleSwitch>

            {inCompleted && inCompleted.length > 0 && (
              <ToggleSwitch
                id="isDependent"
                label="Is there dependent task?"
                isChecked={isDependent}
                register={register}
                onChange={handleDependent}
              >
                {isDependent && (
                  <Select
                    id="dependencies"
                    register={register}
                    options={inCompleted.map((task) => {
                      return {
                        value: task._id?.toString() || "",
                        label: task.title,
                      };
                    })}
                  />
                )}
              </ToggleSwitch>
            )}
          </div>
        </div>

        <FormActions onCancel={onCancel} />
      </div>
    </form>
  );
};

export default TaskForm;
