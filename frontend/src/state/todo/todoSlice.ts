/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData } from '../../types/todoTypes'

interface TodoState {
  taskToDelete: any | null;
}

const initialState: TodoState = {
  taskToDelete: null,
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
  },
});

// Export the actions for use in components
export const {
  setTaskToDelete,
  confirmDeleteTask,
  cancelDeleteTask,
} = todoSlice.actions;

export default todoSlice.reducer;