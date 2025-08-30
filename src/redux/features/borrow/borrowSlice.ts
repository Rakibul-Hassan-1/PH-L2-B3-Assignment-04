import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Borrow, BorrowSummaryData } from '../../../types';

interface BorrowState {
  borrows: Borrow[];
  borrowSummary: BorrowSummaryData[];
  loading: boolean;
  error: string | null;
}

const initialState: BorrowState = {
  borrows: [],
  borrowSummary: [],
  loading: false,
  error: null,
};

const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBorrows: (state, action: PayloadAction<Borrow[]>) => {
      state.borrows = action.payload;
    },
    setBorrowSummary: (state, action: PayloadAction<BorrowSummaryData[]>) => {
      state.borrowSummary = action.payload;
    },
    addBorrow: (state, action: PayloadAction<Borrow>) => {
      state.borrows.unshift(action.payload);
    },
    clearBorrows: (state) => {
      state.borrows = [];
      state.borrowSummary = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setBorrows,
  setBorrowSummary,
  addBorrow,
  clearBorrows,
} = borrowSlice.actions;

export default borrowSlice.reducer;
