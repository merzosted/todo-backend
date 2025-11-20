# Todo Backend API

A RESTful API for managing todos with user authentication, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication with JWT tokens
- User signup and login
- Password reset via email
- Full CRUD operations for todos
- Toggle todo completion status
- Error logging to MongoDB
- Proper error handling on all routes
- TypeScript only (no JavaScript files)

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service for password reset

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Gmail account for email service

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

3. Set up MongoDB Atlas:
   - Create a free cluster at https://www.mongodb.com/cloud/atlas
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for development)
   - Copy the connection string to MONGODB_URI

4. Set up Gmail App Password:
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password
   - Use this password in EMAIL_PASSWORD

## Running the Application

Development mode with auto-reload:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

**POST /api/auth/signup**
- Register a new user
- Body: `{ name, email, password }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`

**POST /api/auth/forgot-password**
- Request password reset email
- Body: `{ email }`

**PUT /api/auth/reset-password/:resetToken**
- Reset password with token
- Body: `{ password }`

### Todos (All require authentication)

**GET /api/todos**
- Get all todos for logged-in user

**POST /api/todos**
- Create a new todo
- Body: `{ title }`

**PUT /api/todos/:id**
- Update a todo
- Body: `{ title?, completed? }`

**DELETE /api/todos/:id**
- Delete a todo

**PATCH /api/todos/:id/toggle**
- Toggle todo completion status

## Project Structure

```
src/
├── config/
│   └── db.ts                 # Database connection
├── controllers/
│   ├── auth.controller.ts    # Authentication logic
│   └── todo.controller.ts    # Todo CRUD logic
├── middleware/
│   ├── auth.middleware.ts    # JWT verification
│   └── errorHandler.middleware.ts  # Error handling & logging
├── models/
│   ├── user.ts              # User schema
│   ├── todo.ts              # Todo schema
│   └── errorLog.ts          # Error log schema
├── routes/
│   ├── auth.routes.ts       # Auth routes
│   └── todo.routes.ts       # Todo routes
└── index.ts                 # Main server file
```

## Error Handling

All errors are:
- Caught and handled properly in all routes
- Logged to MongoDB in the `errorlogs` collection
- Returned with appropriate HTTP status codes
- Include stack traces in development mode

## Database Collections

1. **users** - User accounts with authentication
2. **todos** - Todo items linked to users
3. **errorlogs** - Application error logs

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Input validation
- CORS enabled
- Environment variables for sensitive data

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

Example cURL:
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Todo (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My first todo"}'
```

## Assumptions

- Email service uses Gmail SMTP (can be changed in .env)
- Password reset tokens expire after 10 minutes
- JWT tokens expire after 7 days
- All timestamps are in UTC
- MongoDB Atlas free tier is sufficient for development

## License

MIT
