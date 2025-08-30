import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './features/book/bookSlice';
import borrowReducer from './features/borrow/borrowSlice';
import { api } from '../services/api';

export const store = configureStore({
  reducer: {
    book: bookReducer,
    borrow: borrowReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
