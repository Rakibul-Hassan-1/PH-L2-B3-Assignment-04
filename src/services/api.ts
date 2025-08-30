import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ApiResponse,
  Book,
  Borrow,
  BorrowBookData,
  BorrowSummaryData,
  CreateBookData,
  UpdateBookData
} from '../types';

// Base API configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// For production, use a CORS proxy to avoid CORS issues
const baseUrl = isDevelopment 
  ? 'http://localhost:5000' 
  : 'https://cors-anywhere.herokuapp.com/https://ph-l2-b3-assignment-03.vercel.app';



export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
    mode: 'cors',
    credentials: 'omit',
    timeout: 30000,
  }),
  tagTypes: ['Book', 'Borrow'],
  endpoints: (builder) => ({
    // Book endpoints
    getBooks: builder.query<ApiResponse<Book[]>, { 
      filter?: string; 
      sortBy?: string; 
      sort?: 'asc' | 'desc'; 
      limit?: number; 
      page?: number 
    }>({
      query: (params) => ({
        url: '/api/books',
        params: {
          ...params,
          filter: params.filter === 'all' ? undefined : params.filter
        }
      }),
      providesTags: ['Book']
    }),

    getBookById: builder.query<ApiResponse<Book>, string>({
      query: (id) => `/api/books/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Book', id }]
    }),

    createBook: builder.mutation<ApiResponse<Book>, CreateBookData>({
      query: (bookData) => ({
        url: '/api/books',
        method: 'POST',
        body: bookData
      }),
      invalidatesTags: ['Book']
    }),

    updateBook: builder.mutation<ApiResponse<Book>, { id: string; data: UpdateBookData }>({
      query: ({ id, data }) => ({
        url: `/api/books/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Book', id }, 'Book']
    }),

    deleteBook: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/api/books/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Book']
    }),

    // Borrow endpoints
    borrowBook: builder.mutation<ApiResponse<Borrow>, BorrowBookData>({
      query: (borrowData) => ({
        url: '/api/borrow',
        method: 'POST',
        body: borrowData
      }),
      invalidatesTags: ['Borrow', 'Book']
    }),

    getBorrowSummary: builder.query<ApiResponse<BorrowSummaryData[]>, void>({
      query: () => '/api/borrow',
      providesTags: ['Borrow']
    })
  })
});

// Export hooks
export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery
} = api;
