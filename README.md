# 📚 Library Management System

A complete full-stack Library Management System built with React, Redux Toolkit Query, TypeScript, Express.js, and MongoDB. This system provides comprehensive book management, borrowing functionality, and real-time data aggregation.

## ✨ Features

### 🎯 Core Functionality
- **Book Management**: Full CRUD operations for books
- **Borrowing System**: Track book borrowing with business logic
- **Real-time Updates**: Instant UI updates using RTK Query
- **Data Aggregation**: MongoDB aggregation pipeline for borrowing summaries
- **Responsive Design**: Mobile-first, fully responsive UI

### 🔧 Technical Features
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit with RTK Query
- **API Integration**: RESTful API with proper error handling
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Comprehensive form and data validation
- **Security**: Rate limiting, CORS, and input sanitization

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **RTK Query** for API calls and caching
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Mongoose** middleware and validation
- **Aggregation Pipeline** for complex queries

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
```

Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📖 API Endpoints

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/books` | Create a new book |
| `GET` | `/api/books` | Get all books (with filtering, sorting, pagination) |
| `GET` | `/api/books/:id` | Get book by ID |
| `PUT` | `/api/books/:id` | Update book |
| `DELETE` | `/api/books/:id` | Delete book |

### Borrowing
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/borrow` | Borrow a book |
| `GET` | `/api/borrow` | Get borrowed books summary (aggregation) |
| `GET` | `/api/borrow/all` | Get all borrow records |

## 🎨 UI Components

### Pages
- **Books**: Main book listing with filtering, sorting, and pagination
- **Create Book**: Form to add new books
- **Edit Book**: Update existing book information
- **Book Detail**: Comprehensive book information view
- **Borrow Book**: Borrow books with validation
- **Borrow Summary**: Aggregated borrowing statistics

### Features
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, intuitive interface
- **Real-time Updates**: Instant data synchronization
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading experiences

## 🔒 Business Logic

### Book Management
- **Availability Control**: Automatic status updates based on copies
- **ISBN Validation**: Unique ISBN enforcement
- **Genre Restrictions**: Predefined genre categories
- **Copy Management**: Non-negative copy validation

### Borrowing System
- **Quantity Validation**: Cannot exceed available copies
- **Due Date Enforcement**: Future date validation
- **Automatic Updates**: Book availability updates on borrow
- **Data Integrity**: Pre-save validation

## 📊 Data Models

### Book Schema
```typescript
{
  title: string;           // Required, max 200 chars
  author: string;          // Required, max 100 chars
  genre: string;           // Required, enum values
  isbn: string;            // Required, unique, 10-17 digits
  description?: string;    // Optional, max 1000 chars
  copies: number;          // Required, non-negative integer
  available: boolean;      // Auto-calculated based on copies
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-updated
}
```

### Borrow Schema
```typescript
{
  book: ObjectId;          // Reference to Book
  quantity: number;        // Required, positive integer
  dueDate: Date;           // Required, future date
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-updated
}
```

## 🚀 Advanced Features

### MongoDB Aggregation
- **Real-time Statistics**: Live borrowing summaries
- **Data Grouping**: Books grouped by borrowing activity
- **Performance Optimization**: Indexed queries for fast results

### RTK Query Integration
- **Automatic Caching**: Intelligent data caching
- **Optimistic Updates**: Instant UI feedback
- **Background Refetching**: Always fresh data
- **Error Handling**: Graceful error management

## 🔧 Development

### Scripts
```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017/library_management |
| `NODE_ENV` | Environment mode | development |

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Screens**: 1280px and up

## 🧪 Testing

```bash
# Backend tests
npm test

# Frontend tests (when implemented)
npm run test
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced search and filtering
- [ ] Book return functionality
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced reporting
- [ ] Book recommendations
- [ ] Integration with external book APIs

---

**Built with ❤️ using modern web technologies**