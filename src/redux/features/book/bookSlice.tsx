import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../../../types';

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  selectedBook: Book | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    limit: number;
  } | null;
}

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
  selectedBook: null,
  pagination: null,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.unshift(action.payload);
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const index = state.books.findIndex(book => book._id === action.payload._id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter(book => book._id !== action.payload);
    },
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
    setPagination: (state, action: PayloadAction<BookState['pagination']>) => {
      state.pagination = action.payload;
    },
    clearBooks: (state) => {
      state.books = [];
      state.pagination = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setBooks,
  addBook,
  updateBook,
  removeBook,
  setSelectedBook,
  setPagination,
  clearBooks,
} = bookSlice.actions;

export default bookSlice.reducer;
