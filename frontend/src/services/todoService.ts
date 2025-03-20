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
    updateStatusTodos: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Todo"],
    }),
    searchTodos: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/tasks/search?${queryParams}`;
      },
      providesTags: ["Todo"],
    }),
  }),
});

export const {
  useCreateTodosMutation,
  useUpdateTodosMutation,
  useDeleteTodosMutation,
  useUpdateStatusTodosMutation,
  useSearchTodosQuery,
} = todoApi;
