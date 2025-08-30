import { ArrowLeft, BookOpen, Calendar, CheckCircle, Copy, Edit, Hash, Tag, User, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useGetBookByIdQuery } from '../services/api';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bookResponse, isLoading, error } = useGetBookByIdQuery(id!);

  if (isLoading) {
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
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <Link to="/books">
            <Button>Back to Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const book = bookResponse.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/books" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-gray-600">Book Details</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link to={`/edit-book/${book._id}`}>
              <Button variant="outline" className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Book</span>
              </Button>
            </Link>
            <Link to={`/borrow/${book._id}`}>
              <Button className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Borrow Book</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Book Information */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Book Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
              <p className="text-lg text-gray-600">by {book.author}</p>
            </div>
          </div>
        </div>

        {/* Book Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Author</p>
                  <p className="text-gray-900">{book.author}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Genre</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {book.genre}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">ISBN</p>
                  <p className="text-gray-900 font-mono">{book.isbn}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Copy className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Copies</p>
                  <p className="text-gray-900">{book.copies}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {book.available ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    book.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
              
              {book.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                  <p className="text-gray-900 text-sm leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Added to Library</p>
                  <p className="text-gray-900">{formatDate(book.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{formatDate(book.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-500">
                Book ID: <span className="font-mono text-gray-900">{book._id}</span>
              </div>
              <div className="flex space-x-3">
                <Link to={`/edit-book/${book._id}`}>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Edit Book</span>
                  </Button>
                </Link>
                <Link to={`/borrow/${book._id}`}>
                  <Button className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Borrow Book</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
