import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const todoApi = createApi({
  reducerPath: "todoApi",
  tagTypes: ["Todo"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://advancedtodo-dev.us-east-1.elasticbeanstalk.com/api/v1",
    //baseUrl: "http://localhost:4002/api/v1",
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
        method: "PATCH",
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
        url: `/tasks/status/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Todo"],
    }),
    searchTodos: builder.query({
      query: (filters) => ({
        url: 'tasks/search',
        method: 'GET',
        params: {
          ...filters,
          page: filters.page || 1,
          limit: filters.limit || 3
        }
      }),
      providesTags: ['Todo']
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
