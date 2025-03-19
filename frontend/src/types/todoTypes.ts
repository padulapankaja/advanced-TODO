export type FormData = {
  title: string;
  priority: string;
  dueDate: string;
  isRecurrent: boolean;
  isDependent: boolean;
  recurrencePattern?: string;
  dependencies?: string;
};