# Modular Express

A VS Code extension that helps you generate and manage modular Express.js applications using TypeScript. This extension provides a robust project structure with comprehensive error handling, query building, and modular architecture.

## Features

### 1. Express Project Generation
- 🎯 Creates a complete Express.js project structure with advanced error handling
- ⚡ Automatically installs all required dependencies
- 📦 Sets up TypeScript configuration
- 🏗️ Implements modular architecture patterns
- 🔧 Includes query builder for MongoDB operations
- 🛡️ Comprehensive error handling system
- 🚦 Global error handling middleware

### 2. Module Generation
- 🚀 Quick module generation with a single command
- 📁 Creates complete module structure with all necessary files
- 🏷️ TypeScript support out of the box
- 🎯 Follows Express.js best practices
- 🧩 Generates boilerplate code for all module components

## Project Structure

```
project-name/
├── src/
├── node_modules/
│   ├── app.ts
│   ├── server.ts
│   └── app/
│       ├── builder/
│       │   └── QueryBuilder.ts
│       ├── config/
│       │   └── index.ts
│       ├── error/
│       │   ├── AppError.ts
│       │   ├── AuthError.ts
│       │   ├── handleAppError.ts
│       │   ├── handleAuthError.ts
│       │   ├── handleCastError.ts
│       │   ├── handleDuplicateError.ts
│       │   ├── handleMongooseValidationError.ts
│       │   ├── handleNotFoundError.ts
│       │   ├── handleZodError.ts
│       │   └── NotFoundError.ts
│       ├── interface/
│       │   └── error.ts
│       ├── middlewares/
│       │   ├── globalErrorHandler.ts
│       │   ├── notFound.ts
│       │   └── validateRequest.ts
│       ├── modules/
│       │   ├── home/
│       │   │   ├── home.controller.ts
│       │   │   └── home.route.ts
│       ├── routes/
│       │   └── index.ts
│       └── utils/
│           ├── catchAsync.ts
│           └── sendResponse.ts
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

## Key Components

### Builder
- **QueryBuilder**: Handles MongoDB query operations with support for:
  - Search functionality
  - Filtering
  - Sorting
  - Pagination
  - Field selection

### Error Handling System
- **Custom Error Classes**:
  - `AppError`: Base error class
  - `AuthError`: Authentication errors
  - `NotFoundError`: Resource not found errors
- **Error Handlers**:
  - MongoDB cast errors
  - Duplicate key errors
  - Validation errors
  - Zod validation errors
  - Authentication errors
  - Generic app errors

### Middleware
- **globalErrorHandler**: Central error processing
- **validateRequest**: Request validation using Zod
- **notFound**: 404 error handling

### Utils
- **catchAsync**: Async error wrapper
- **sendResponse**: Standardized response formatter

### Modules
Each module follows a consistent structure:
- **constant.ts**: Module constants and enums
- **controller.ts**: Request handlers
- **interface.ts**: TypeScript interfaces
- **model.ts**: Mongoose model
- **route.ts**: Express routes
- **service.ts**: Business logic
- **validation.ts**: Zod validation schemas

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Modular Express"
4. Click Install

## Usage

### Creating a New Express Project

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "Create New Express Project" and select the command
3. Enter your project name when prompted
4. Wait for the project to be created and dependencies to be installed

### Creating a New Module

1. Open your Express.js project in VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
3. Type "Create Module" and select the command
4. Enter your module name when prompted

## Project Dependencies

```json
{
  "dependencies": {
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "http-status": "^1.6.2",
    "mongoose": "^8.9.2",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.10.2",
    "eslint": "^9.17.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.1",
    "prettier": "^3.4.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.7.2",
    "typescript-eslint": "^8.18.2"
  }
}
```

## Best Practices

1. **Error Handling**:
   - Use appropriate error classes for different types of errors
   - Always wrap async routes with catchAsync
   - Implement proper validation using Zod schemas

2. **Query Building**:
   - Use QueryBuilder for complex MongoDB queries
   - Implement proper pagination and filtering
   - Use field selection to optimize response size

3. **Module Structure**:
   - Keep business logic in service layer
   - Use controllers for request/response handling only
   - Implement proper validation schemas
   - Define clear interfaces for type safety

## Commands

This extension contributes the following commands:

* `modular-express.createNewExpressProject`: Creates a new Express.js project with complete setup
* `modular-express.createNewModule`: Creates a new module in an existing project

## Known Issues

None at the moment. If you find any issues, please report them on our GitHub repository.

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT

---

**Enjoy building scalable Express applications!**
