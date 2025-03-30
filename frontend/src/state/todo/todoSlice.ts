import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData, TodoState } from "../../types/todoTypes";

const initialState: TodoState = {
  taskToDelete: null,
  taskToUpdate: null,
};

// Create the todoSlice with actions to handle task deletion
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Action to set a task for deletion (store in taskToDelete)
    setTaskToDelete: (state, action: PayloadAction<FormData>) => {
      state.taskToDelete = action.payload;
    },
    // Action to confirm deletion and remove the task from tasks
    confirmDeleteTask: (state) => {
      state.taskToDelete = null; // Clear the taskToDelete after deletion
    },
    // Action to cancel the deletion (reset taskToDelete)
    cancelDeleteTask: (state) => {
      state.taskToDelete = null;
    },
    // Action to set a task for deletion (store in taskToUpdate)
    setTaskToUpdate: (state, action: PayloadAction<FormData>) => {
      state.taskToUpdate = action.payload;
    },
    // Action to confirm deletion and remove the task from tasks
    confirmUpdateTask: (state) => {
      state.taskToUpdate = null;
    },
    // Action to cancel the deletion (reset taskToUpdate)
    cancelUpdateTask: (state) => {
      state.taskToUpdate = null;
    },
  },
});

// Export the actions for use in components
export const {
  setTaskToDelete,
  confirmDeleteTask,
  cancelDeleteTask,
  setTaskToUpdate,
  cancelUpdateTask,
  confirmUpdateTask,
} = todoSlice.actions;

export default todoSlice.reducer;
