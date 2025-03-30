import { TaskStatus } from "../types/todoTypes";

// Function to determine priority color
export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
export const getCardBorder = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "border-red-300";
    case "medium":
      return "border-yellow-300";
    case "low":
      return "border-green-300";
    default:
      return "border-gray-300";
  }
};
export const completedBackground = (status: TaskStatus) => {
  switch (status.toLowerCase()) {
    case "notDone":
      return "bg-[#f7f7f7]";
    case "done":
      return "bg-[#f1fff1]";
    default:
      return "bg-[#f7f7f7]";
  }
};
