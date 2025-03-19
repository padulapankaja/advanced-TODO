import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1",
  }),
  // refetchOnFocus: true, // refetch data when window regains focus
  // keepUnusedDataFor: 10, // clear cache after 10 seconds
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/tasks",
    }),
    createTodos: builder.mutation({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
    }),
    updateTodos: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteTodos: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodosMutation,
  useUpdateTodosMutation,
  useDeleteTodosMutation,
} = todoApi;
