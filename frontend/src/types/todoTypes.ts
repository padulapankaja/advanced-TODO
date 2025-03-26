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