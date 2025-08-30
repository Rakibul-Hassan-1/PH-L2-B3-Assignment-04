import { useGetBorrowSummaryQuery } from '../services/api';
import type { BorrowSummaryData } from '../types';
import { Button } from '../components/ui/button';
import { BookOpen, BarChart3, Hash, Copy, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

const BorrowSummary = () => {
  const { data: summaryResponse, isLoading, error } = useGetBorrowSummaryQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Summary</h2>
          <p className="text-gray-600 mb-4">Please try again later.</p>
          <Link to="/books">
            <Button>Back to Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const borrowSummary: BorrowSummaryData[] = summaryResponse?.data || [];

  const totalBorrowed = borrowSummary.reduce((sum, item) => sum + item.totalQuantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Borrow Summary</h1>
              <p className="text-gray-600">Overview of all borrowed books</p>
            </div>
          </div>
          <Link to="/books">
            <Button variant="outline" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>View All Books</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Books Borrowed</p>
              <p className="text-2xl font-bold text-gray-900">{borrowSummary.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Copy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Copies Borrowed</p>
              <p className="text-2xl font-bold text-gray-900">{totalBorrowed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average per Book</p>
              <p className="text-2xl font-bold text-gray-900">
                {borrowSummary.length > 0 ? (totalBorrowed / borrowSummary.length).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrowed Books Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Borrowed Books Details</h3>
        </div>
        
        {borrowSummary.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Borrowed</h3>
            <p className="text-gray-500 mb-6">There are currently no borrowed books in the system.</p>
            <Link to="/books">
              <Button>Browse Books</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Quantity Borrowed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowSummary.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.book.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Book ID: {index + 1}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 font-mono">
                          {item.book.isbn}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Copy className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.totalQuantity}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          {item.totalQuantity === 1 ? 'copy' : 'copies'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to="/books">
                        <Button variant="outline" size="sm">
                          View in Library
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">About This Summary</h3>
        <div className="text-blue-800 text-sm space-y-2">
          <p>
            This summary shows the total quantity of each book that has been borrowed from the library.
            The data is aggregated using MongoDB's aggregation pipeline to provide real-time insights.
          </p>
          <p>
            <strong>Note:</strong> This summary only shows books that are currently borrowed. 
            Books that have been returned are not included in this count.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BorrowSummary;
