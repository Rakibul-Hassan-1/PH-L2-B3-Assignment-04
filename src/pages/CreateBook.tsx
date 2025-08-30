import { ArrowLeft, BookOpen, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input, Textarea } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCreateBookMutation } from '../services/api';
import type { CreateBookData } from '../types';

const CreateBook = () => {
  const navigate = useNavigate();
  const [createBook, { isLoading }] = useCreateBookMutation();
  
  const [formData, setFormData] = useState<CreateBookData>({
    title: '',
    author: '',
    genre: 'FICTION',
    isbn: '',
    description: '',
    copies: 1,
    available: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!/^[0-9-]{10,17}$/.test(formData.isbn)) {
      newErrors.isbn = 'ISBN must be a valid 10-17 digit number with optional hyphens';
    }

    if (formData.copies < 0) {
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
      await createBook(formData).unwrap();
      navigate('/books');
    } catch (error: unknown) {
      console.error('Failed to create book:', error);
      // Handle specific errors
      if (error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'error' in error.data &&
          typeof error.data.error === 'string' && error.data.error.includes('ISBN')) {
        setErrors({ isbn: 'ISBN already exists' });
      }
    }
  };

  const handleInputChange = (field: keyof CreateBookData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/books" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Book</h1>
            <p className="text-muted-foreground">Add a new book to your library collection</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter book title"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Enter author name"
                className={errors.author ? 'border-destructive' : ''}
              />
              {errors.author && (
                <p className="text-sm text-destructive mt-1">{errors.author}</p>
              )}
            </div>

            {/* Genre */}
            <div>
              <Label htmlFor="genre">Genre *</Label>
              <Select value={formData.genre} onValueChange={(value) => handleInputChange('genre', value)}>
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
                value={formData.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                placeholder="Enter ISBN (10-17 digits)"
                className={errors.isbn ? 'border-destructive' : ''}
              />
              {errors.isbn && (
                <p className="text-sm text-destructive mt-1">{errors.isbn}</p>
              )}
            </div>

            {/* Copies */}
            <div>
              <Label htmlFor="copies">Copies *</Label>
              <Input
                id="copies"
                type="number"
                min="0"
                value={formData.copies}
                onChange={(e) => handleInputChange('copies', parseInt(e.target.value) || 0)}
                placeholder="Number of copies"
                className={errors.copies ? 'border-destructive' : ''}
              />
              {errors.copies && (
                <p className="text-sm text-destructive mt-1">{errors.copies}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                placeholder="Enter book description (optional)"
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Link to="/books">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Creating...' : 'Create Book'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
