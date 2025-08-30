import { createBrowserRouter } from "react-router";
import App from "../App";
import BookDetail from "../pages/BookDetail";
import Books from "../pages/Books";
import BorrowBook from "../pages/BorrowBook";
import BorrowSummary from "../pages/BorrowSummary";
import CreateBook from "../pages/CreateBook";
import EditBook from "../pages/EditBook";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Books />,
      },
      {
        path: "books",
        element: <Books />,
      },
      {
        path: "create-book",
        element: <CreateBook />,
      },
      {
        path: "books/:id",
        element: <BookDetail />,
      },
      {
        path: "edit-book/:id",
        element: <EditBook />,
      },
      {
        path: "borrow/:bookId",
        element: <BorrowBook />,
      },
      {
        path: "borrow-summary",
        element: <BorrowSummary />,
      },
    ],
  },
]);

export default router;
