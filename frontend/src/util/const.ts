import {
  FilterType,
  NotificationType,
  PriorityKey,
  TaskStatus,
} from "../types/todoTypes";

export const TASK_STATUS = {
  DONE: "done" as TaskStatus,
  NOT_DONE: "notDone" as TaskStatus,
};
export const FILTER_TYPES = {
  STATUS: "status" as FilterType,
  PRIORITY: "priority" as FilterType,
};
export const PRIORITY_TYPES = {
  LOW: "low" as PriorityKey,
  MEDIUM: "medium" as PriorityKey,
  HIGH: "high" as PriorityKey,
} as const;
export const NOTIFICATION_TYPES = {
  ERROR: "error" as NotificationType,
  SUCCESS: "success" as NotificationType,
  WARNING: "warning" as NotificationType,
} as const;
export const NOTIFICATION_MESSAGES = {
  ERROR: "An error occurred. Please try again.",
  SUCCESS: "Operation completed successfully.",
  WARNING: "Warning: Please check your input.",
} as const;

export const TASK_MESSAGES = {
  CREATED: "Task created successfully!",
  UPDATE: "Task updated successfully!",
  DELETED: "Task deleted successfully!",
} as const;
