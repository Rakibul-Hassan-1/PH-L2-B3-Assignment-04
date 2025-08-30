import { AlertCircle, ArrowLeft, BookOpen, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useBorrowBookMutation, useGetBookByIdQuery } from '../services/api';
import type { BorrowBookData } from '../types';

const BorrowBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const { data: bookResponse, isLoading: isLoadingBook, error } = useGetBookByIdQuery(bookId!);
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();
  
  const [formData, setFormData] = useState<BorrowBookData>({
    book: bookId!,
    quantity: 1,
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bookId) {
      setFormData(prev => ({ ...prev, book: bookId }));
    }
  }, [bookId]);

  // Set default due date to 30 days from now
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setFormData(prev => ({ 
      ...prev, 
      dueDate: defaultDate.toISOString().split('T')[0] 
    }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (bookResponse?.data && formData.quantity > bookResponse.data.copies) {
      newErrors.quantity = `Cannot borrow more than ${bookResponse.data.copies} copies`;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.dueDate = 'Due date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await borrowBook(formData).unwrap();
      navigate('/borrow-summary');
    } catch (error: unknown) {
      console.error('Failed to borrow book:', error);
      // Handle specific errors
      if (error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'error' in error.data &&
          typeof error.data.error === 'string' && error.data.error.includes('copies')) {
        setErrors({ quantity: 'Not enough copies available' });
      }
    }
  };

  const handleInputChange = (field: keyof BorrowBookData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  if (isLoadingBook) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !bookResponse?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Book Not Found</h2>
          <p className="text-gray-600 mb-4">The book you're trying to borrow doesn't exist.</p>
          <Link to="/books">
            <Button>Back to Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const book = bookResponse.data;

  if (!book.available || book.copies === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Book Not Available</h2>
          <p className="text-gray-600 mb-6">
            "{book.title}" is currently not available for borrowing.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/books">
              <Button variant="outline">Back to Books</Button>
            </Link>
            <Link to={`/books/${book._id}`}>
              <Button>View Book Details</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to={`/books/${book._id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Book Details
        </Link>
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Borrow Book</h1>
            <p className="text-gray-600">Borrow "{book.title}" from the library</p>
          </div>
        </div>
      </div>

      {/* Book Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Title</p>
            <p className="text-gray-900 font-medium">{book.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Author</p>
            <p className="text-gray-900">{book.author}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Available Copies</p>
            <p className="text-gray-900 font-medium text-green-600">{book.copies}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Genre</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {book.genre}
            </span>
          </div>
        </div>
      </div>

      {/* Borrow Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity to Borrow *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={book.copies}
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                placeholder="Number of copies"
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Maximum available: {book.copies} copies
              </p>
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.dueDate ? 'border-red-500' : ''}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Please select a future date
              </p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Borrowing Terms</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You can borrow up to {book.copies} copies of this book</li>
              <li>• Books must be returned by the due date</li>
              <li>• Late returns may result in restrictions</li>
              <li>• Please handle books with care</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link to={`/books/${book._id}`}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isBorrowing} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{isBorrowing ? 'Processing...' : 'Borrow Book'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowBook;
