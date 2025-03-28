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

export type TaskStatus = "done" | "notDone";
export type FilterType = "status" | "priority";
export type PriorityKey = "low" | "medium" | "high";
export type NotificationType = "error" | "success" | "warning"

export type DependentTask = {
  _id: string;
  title: string;
};
export type Notification = {
  type: "error" | "success" | "warning"
  message: string;
};
export interface Filters {
  status: string[];
  priority: string[];
}