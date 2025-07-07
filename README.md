# Project Mark Challenge - Topic REST API

A Node.js REST API built with Express and TypeScript that manages topics, users, and resources with authentication and authorization.

## Features

- **Topic Management**: Create, read, update, and delete topics with versioning and hierarchical relationships
- **User Management**: User authentication, authorization with role-based permissions
- **Resource Management**: Manage resources associated with topics
- **Security**: JWT authentication, helmet for security headers, CORS support
- **Validation**: Request validation using Zod schemas
- **Architecture**: Clean architecture with repositories, services, and controllers

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd projectmarkchallengeb
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with hot-reload using nodemon.

### Production Mode
```bash
npm start
```
This will run the compiled JavaScript from the `dist` folder.

### Admin Token
After initializing the application, you will receive the following message in your console:
```bash
🔑 Admin token generated: <JWT_TOKEN>
```
Use this token for admin operations, such as creating the starting admin users. This token will expire 24hs after creation.

### Other Scripts
- `npm run clean` - Remove the dist folder
- `npm test` - Run tests using Jest

## API Endpoints

The API runs on `http://localhost:3000` (default port) and includes the following endpoints:

### Health Check
- `GET /health` - Returns server status

### Authentication
- `POST /api/users/login` - User login

### Topics
- `POST /api/topics` - Create a new topic (requires authentication and write permission)
- `GET /api/topics` - Get all topics (requires authentication and read permission)
- `GET /api/topics/:id` - Get topic by ID (requires authentication and read permission)
- `GET /api/topics/:id/versions/:version` - Get specific topic version (requires authentication and read permission)
- `PUT /api/topics/:id` - Update topic (requires authentication and write permission)
- `DELETE /api/topics/:id` - Delete topic (requires authentication and delete permission)
- `GET /api/topics/:id/hierarchy` - Get topic hierarchy (requires authentication and read permission)
- `GET /api/topics/path/:sourceId/:targetId` - Find shortest path between topics (requires authentication and read permission)

### Resources
- `POST /api/resources` - Create a new resource (requires authentication and write permission)
- `GET /api/resources` - Get all resources (requires authentication and read permission)
- `GET /api/resources/:id` - Get resource by ID (requires authentication and read permission)
- `GET /api/resources/topic/:topicId` - Get resources by topic (requires authentication and read permission)
- `PUT /api/resources/:id` - Update resource (requires authentication and write permission)
- `DELETE /api/resources/:id` - Delete resource (requires authentication and delete permission)

### Users
- `POST /api/users` - Create a new user (requires authentication and manageUsers permission)
- `GET /api/users` - Get all users (requires authentication and manageUsers permission)
- `GET /api/users/:id` - Get user by ID (requires authentication and read permission)
- `PUT /api/users/:id` - Update user (requires authentication and manageUsers permission)
- `DELETE /api/users/:id` - Delete user (requires authentication and manageUsers permission)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. First, login using the `/api/users/login` endpoint
2. Include the JWT token in the Authorization header for subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## Permissions

The API implements role-based authorization with the following permissions:
- `read` - Read access to resources
- `write` - Create and update resources
- `delete` - Delete resources
- `manageUsers` - Manage user accounts

## Request Validation

All POST and PUT requests are validated using Zod schemas. Make sure to send properly formatted JSON data according to the expected schemas.

## Error Handling

The API includes comprehensive error handling:
- 404 errors for non-existent routes
- Validation errors for invalid request data
- Authentication and authorization errors
- General server errors

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── routes/          # Route definitions
├── middleware/      # Authentication, validation, error handling
├── validators/      # Request validation schemas
├── factories/       # Object factories
└── index.ts         # Application entry point
```

## Development

The project uses:
- TypeScript for type safety
- Express.js for the web framework
- Jest for testing
- Nodemon for development hot-reload
- ESLint and Prettier for code quality (if configured)

## Testing

Run the test suite:
```bash
npm test
```

## Environment Variables

Make sure to set up the following environment variables (create a `.env` file in the root directory):
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Port number for the server (default: 3000)
- Database connection details (if applicable)
