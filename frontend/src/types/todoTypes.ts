import { UseFormRegister } from "react-hook-form";
import { ReactNode, ErrorInfo } from "react";

export type FormData = {
  _id?: string;
  title: string;
  priority: string;
  isRecurrent: boolean;
  isDependent: boolean;
  recurrencePattern?: string;
  dependencies?: FormData[];
  isRecurring?: boolean;
  isDependency?: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};
export type Incomplete = {
  _id: string;
  title: string;
};

export type TaskStatus = "done" | "notDone";
export type FilterType = "status" | "priority";
export type PriorityKey = "low" | "medium" | "high";
export type NotificationType = "error" | "success" | "warning";

export type DependentTask = {
  _id: string;
  title: string;
};

export type Notification = {
  type: "error" | "success" | "warning";
  message: string;
};
export type Filters = {
  status: string[];
  priority: string[];
};

export interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export interface FormActionsProps {
  onCancel?: () => void;
  onSave?: () => void;
}
export interface InputFieldProps {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  register: UseFormRegister<FormData>;
  required?: boolean;
  errorMessage?: string;
  autoComplete?: string;
  placeholder?: string;
  minDate?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface RadioGroupProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  register: UseFormRegister<FormData>;
  errorMessage?: string;
  required?: boolean;
}

export interface SelectProps {
  id: string;
  register: UseFormRegister<FormData>;
  options: { value: string; label: string }[];
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

export interface ToggleSwitchProps {
  id: string;
  label: string;
  isChecked: boolean;
  register: UseFormRegister<FormData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export interface TaskCardProps {
  task: FormData;
  onComplete?: (task: FormData) => void;
  onDelete?: (task: FormData) => void;
  onUpdate?: (task: FormData) => void;
  onReopen?: (task: FormData) => void;
}

export interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  option1: string;
  option2: string;
  onConfirm?: () => void;
  dependentTasks?: DependentTask[];
  inCompleted?: Incomplete[];
  onCancel?: () => void;
  onSubmit?: (task: FormData) => void;
}

export interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export type FilterOptions = {
  status: string[];
  priority: string[];
};
export type taskStatsType = {
  totalTasks?: number;
  completedTasks?: number;
  incompleteTasks?: number;
};
export interface FilterProps {
  onFilterApply: (filters: FilterOptions) => void;
  taskStats: taskStatsType;
}

export interface TodoState {
  taskToDelete: FormData | null;
  taskToUpdate: FormData | null;
}

export type FiltersInput = {
  status: {
    done: boolean;
    notDone: boolean;
  };
  priority: {
    low: boolean;
    medium: boolean;
    high: boolean;
  };
};