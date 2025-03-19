import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  tagTypes: ["Todo"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1",
  }),
  // refetchOnFocus: true, // refetch data when window regains focus
  // keepUnusedDataFor: 10, // clear cache after 10 seconds
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/tasks",
      providesTags: ["Todo"],
    }),
    createTodos: builder.mutation({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Todo"],
    }),
    updateTodos: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "Todo", id: _id },
      ],
    }),
    deleteTodos: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodosMutation,
  useUpdateTodosMutation,
  useDeleteTodosMutation,
} = todoApi;
