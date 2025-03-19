import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todo/todoSlice";
import { todoApi } from "../services/todoService";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    counter: todoReducer,
    [todoApi.reducerPath]: todoApi.reducer,
  }, // Reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

// optional
// refetch data when window regains focus
// clear cache after 10 seconds
setupListeners(store.dispatch);
