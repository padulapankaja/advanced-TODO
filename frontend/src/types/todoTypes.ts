export type FormData = {
  _id?: string;
  title: string;
  priority: string;
  dueDate: string;
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
