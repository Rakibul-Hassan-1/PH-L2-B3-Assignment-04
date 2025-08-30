import { BookOpen, Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useDeleteBookMutation, useGetBooksQuery } from '../services/api';

const Books: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  const { data: booksResponse, isLoading, error, refetch } = useGetBooksQuery({
    filter: filter === 'all' ? undefined : filter,
    sortBy,
    sort,
    limit: pageSize,
    page: currentPage
  });

  const [deleteBook] = useDeleteBookMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleSortChange = (value: string) => {
    setSort(value as 'asc' | 'desc');
    setCurrentPage(1); // Reset to first page when sort changes
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error Loading Books Please try again later.</div>
      </div>
    );
  }

  const books = booksResponse?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">All Books</h1>
        <Link to="/create-book">
          <Button>Add New Book</Button>
        </Link>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Genre:</label>
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="FICTION">Fiction</SelectItem>
              <SelectItem value="NON_FICTION">Non-Fiction</SelectItem>
              <SelectItem value="SCIENCE">Science</SelectItem>
              <SelectItem value="HISTORY">History</SelectItem>
              <SelectItem value="BIOGRAPHY">Biography</SelectItem>
              <SelectItem value="FANTASY">Fantasy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Sort By:</label>
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="copies">Copies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Order:</label>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Per Page:</label>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id || book._id} className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  book.available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {book.available ? 'Available' : 'Unavailable'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {book.availableCopies || book.copies} copies
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">
                {book.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  {book.genre}
                </span>
                <span className="text-xs text-muted-foreground">ISBN: {book.isbn}</span>
              </div>
              
              {book.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {book.description}
                </p>
              )}
              
              <div className="flex gap-2">
                <Link to={`/edit-book/${book.id || book._id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                
                <Link to={`/borrow/${book.id || book._id}`}>
                  <Button size="sm" className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Borrow
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(book.id || book._id)}
                  className="flex items-center gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No books found.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {books.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground px-3">
            Page {currentPage} of {Math.ceil((booksResponse?.data?.length || 0) / pageSize)}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={books.length < pageSize}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Books;
