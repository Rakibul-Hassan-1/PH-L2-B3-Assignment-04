export interface ITask {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  deadline: string;
  completed: boolean;
  assignTo: string|null;
}

export interface IUser {
  id: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  availableCopies?: number; // Added to match production API
  id?: string; // Added to match production API
}

export interface Borrow {
  _id: string;
  book: string;
  quantity: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowSummaryData {
  book: {
    title: string;
    isbn: string;
  };
  totalQuantity: number;
}

export interface CreateBookData {
  title: string;
  author: string;
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn: string;
  description?: string;
  copies: number;
  available?: boolean;
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  genre?: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn?: string;
  description?: string;
  copies?: number;
  available?: boolean;
}

export interface BorrowBookData {
  book: string;
  quantity: number;
  dueDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    limit: number;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  limit: number;
}
