import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for a single task
interface Task {
  id: string;
  title: string;
  status: "done" | "not done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  isRecurring: boolean;
  recurrencePattern?: "daily" | "weekly" | "monthly";
}

interface TodoState {
  tasks: Task[];
}

const initialState: TodoState = {
  tasks: [],
};

// Create the todoSlice with actions to handle tasks
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Action to add a task
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    // Action to update a task
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    // Action to delete a task
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    // Action to toggle the task status (done / not done)
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.status = task.status === "done" ? "not done" : "done";
      }
    },
  },
});

// Export the actions for use in components
export const { addTask, updateTask, deleteTask, toggleTaskStatus } = todoSlice.actions;

export default todoSlice.reducer;
