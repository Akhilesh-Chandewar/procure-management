# Procurement Management System - Backend API

## Project Overview

This is a comprehensive backend API for a Procurement Management System built with Node.js, TypeScript, and Express. The system provides role-based access control and dynamic checklist functionality for managing procurement processes efficiently.

## Architecture

### Technology Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **File Upload**: Cloudinary integration for image/file storage
- **Validation**: Joi for request validation
- **Logging**: Bunyan for structured logging
- **Security**: Helmet, CORS, HPP, compression
- **Development**: Nodemon, Husky for git hooks

### Project Structure
```
src/
├── app.ts                    # Application entry point
├── serverSetup.ts           # Express server configuration
├── database/
│   └── database.ts          # MongoDB connection
├── config/
│   └── config.ts           # Configuration management
├── helpers/
│   ├── apiResponse.ts      # Standardized API responses
│   ├── errorHandler.ts     # Global error handling
│   └── cloudinaryUpload.ts # File upload utilities
├── decorators/
│   ├── joi-validator.decorator.ts
│   ├── file-upload.decorator.ts
│   ├── role-check.decorator.ts
│   └── auth.decorator.ts
├── constants/
│   └── constants.ts        # Application constants
├── routes/
│   └── routes.ts           # Main route configuration
└── features/
    ├── healthcheck/         # Health check endpoint
    ├── user/               # User management
    ├── order/              # Order management
    └── checklist/          # Checklist management
```

## Core Features

### 1. User Management
- **Role-based Access Control**: Client, Procurement Manager, Inspection Manager
- **Authentication**: JWT-based with password hashing (bcrypt)
- **User CRUD Operations**: Create, Read, Update, Delete users
- **Profile Management**: User profile information and status management

### 2. Order Management
- **Order Creation**: Clients can create procurement orders
- **Order Assignment**: Automatic assignment to procurement managers
- **Status Tracking**: Order status history with timestamps
- **Multi-stage Workflow**: Order progresses through different stages

### 3. Checklist System
- **Dynamic Checklists**: Create custom checklists for orders
- **Question Types**: Support for various question types including file uploads
- **Default Checklists**: Predefined checklists for common scenarios
- **Response Management**: Track checklist responses and file uploads

### 4. Security Features
- **Authentication Middleware**: JWT token validation
- **Role-based Authorization**: Role-specific access control
- **Input Validation**: Joi schema validation for all requests
- **File Upload Security**: Cloudinary integration with validation
- **Security Headers**: Helmet for security headers

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### User Management
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Order Management
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

### Checklist Management
- `GET /checklists` - Get all checklists
- `GET /checklists/:id` - Get checklist by ID
- `POST /checklists` - Create checklist
- `PUT /checklists/:id` - Update checklist
- `DELETE /checklists/:id` - Delete checklist

## Data Models

### User Model
```typescript
interface IUser {
  _id: ObjectId
  email?: string
  mobile?: string
  password: string
  role: UserRole  // Client, ProcurementManager, InspectionManager
  firstName: string
  lastName: string
  isActive: boolean
  createdBy?: ObjectId
  assignedTo?: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

### Order Model
```typescript
interface IOrder {
  _id: ObjectId
  orderNumber: string
  clientId: ObjectId
  procurementManagerId: ObjectId
  assignedInspectionManagerId: ObjectId
  checklistId: ObjectId
  checklistResponseId: ObjectId
  description: string
  requirements: string
  createdAt: Date
  updatedAt: Date
  statusHistory: IStatusHistory
}
```

### Checklist Model
```typescript
interface IChecklist {
  _id: ObjectId
  name: string
  description: string
  isDefault: boolean
  isActive: boolean
  createdBy: ObjectId
  questions: IQuestion[]
  responses: IResponse[]
  createdAt: Date
  updatedAt: Date
}
```

## Development Setup

### Prerequisites
- Node.js 16+ 
- MongoDB 4.4+
- Cloudinary account (for file uploads)

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.development` and configure:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/procurement
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Running the Application
```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Security Implementation

### Authentication Flow
1. User registration with password hashing
2. JWT token generation on login
3. Token validation for protected routes
4. Role-based access control

### Authorization Decorators
- `@Auth()` - Protect routes with authentication
- `@RoleCheck(role)` - Restrict access by user role
- `@FileUpload()` - Handle file uploads securely
- `@JoiValidator(schema)` - Validate request bodies

## Error Handling

### Standardized API Responses
- Consistent error format with error codes
- Detailed error messages for debugging
- Proper HTTP status codes
- Structured logging with Bunyan

### Global Error Handler
- Catches all unhandled exceptions
- Logs errors with context
- Returns appropriate error responses
- Graceful shutdown on critical errors

## Testing

The project includes comprehensive error handling and validation. Postman collection is provided for API testing.

## Deployment

### Build Process
1. TypeScript compilation to JavaScript
2. Environment-specific configuration
3. Production-ready Express server

### Production Considerations
- Environment variables for configuration
- Proper logging configuration
- Security best practices
- Graceful shutdown handling

## Contributing

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Commit linting with Husky

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Run linting and type checking
4. Commit with conventional commits
5. Create pull request

## Documentation

### API Documentation
- Postman collection included
- TypeScript interfaces for data models
- Detailed route specifications
- Environment configuration guide

### Architecture Documentation
- System design overview
- Database schema documentation
- Security implementation details
- Development setup instructions

## License

ISC License - See LICENSE file for details

## Support

For issues and questions:
- GitHub issues
- Documentation review
- API testing with Postman collection