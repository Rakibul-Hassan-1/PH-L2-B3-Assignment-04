import { ArrowLeft, BookOpen, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input, Textarea } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useGetBookByIdQuery, useUpdateBookMutation } from '../services/api';
import type { UpdateBookData } from '../types';

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: bookResponse, isLoading: isLoadingBook, error } = useGetBookByIdQuery(id!);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  
  const [formData, setFormData] = useState<UpdateBookData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bookResponse?.data) {
      const book = bookResponse.data;
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        description: book.description || '',
        copies: book.copies,
        available: book.available,
      });
    }
  }, [bookResponse]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title !== undefined && !formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.author !== undefined && !formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (formData.isbn !== undefined && !formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (formData.isbn !== undefined && !/^[0-9-]{10,17}$/.test(formData.isbn)) {
      newErrors.isbn = 'ISBN must be a valid 10-17 digit number with optional hyphens';
    }

    if (formData.copies !== undefined && formData.copies < 0) {
      newErrors.copies = 'Copies must be a non-negative number';
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
      await updateBook({ id: id!, data: formData }).unwrap();
      navigate('/books');
    } catch (error: unknown) {
      console.error('Failed to update book:', error);
      // Handle specific errors
      if (error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'error' in error.data &&
          typeof error.data.error === 'string' && error.data.error.includes('ISBN')) {
        setErrors({ isbn: 'ISBN already exists' });
      }
    }
  };

  const handleInputChange = (field: keyof UpdateBookData, value: string | number | boolean) => {
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading book...</p>
        </div>
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/books" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
            <p className="text-gray-600">Update book information</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || book.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter book title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author || book.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Enter author name"
                className={errors.author ? 'border-red-500' : ''}
              />
              {errors.author && (
                <p className="text-sm text-red-600 mt-1">{errors.author}</p>
              )}
            </div>

            {/* Genre */}
            <div>
              <Label htmlFor="genre">Genre *</Label>
              <Select 
                value={formData.genre || book.genre} 
                onValueChange={(value) => handleInputChange('genre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FICTION">Fiction</SelectItem>
                  <SelectItem value="NON_FICTION">Non-Fiction</SelectItem>
                  <SelectItem value="SCIENCE">Science</SelectItem>
                  <SelectItem value="HISTORY">History</SelectItem>
                  <SelectItem value="BIOGRAPHY">Biography</SelectItem>
                  <SelectItem value="FANTASY">Fantasy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ISBN */}
            <div>
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={formData.isbn || book.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                placeholder="Enter ISBN (10-17 digits)"
                className={errors.isbn ? 'border-red-500' : ''}
              />
              {errors.isbn && (
                <p className="text-sm text-red-600 mt-1">{errors.isbn}</p>
              )}
            </div>

            {/* Copies */}
            <div>
              <Label htmlFor="copies">Copies *</Label>
              <Input
                id="copies"
                type="number"
                min="0"
                value={formData.copies !== undefined ? formData.copies : book.copies}
                onChange={(e) => handleInputChange('copies', parseInt(e.target.value) || 0)}
                placeholder="Number of copies"
                className={errors.copies ? 'border-red-500' : ''}
              />
              {errors.copies && (
                <p className="text-sm text-red-600 mt-1">{errors.copies}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description !== undefined ? formData.description : (book.description || '')}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                placeholder="Enter book description (optional)"
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link to="/books">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isUpdating} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{isUpdating ? 'Updating...' : 'Update Book'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
