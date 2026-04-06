# Finance Dashboard System - Backend

A REST API built with Node.js, Express, and MongoDB for a finance dashboard system. It handles user authentication, role-based access control, and tracking of income and expenses.

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- express-validator for request validation

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the required environment variables.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables (see `.env.example`):

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string  # Use MongoDB Atlas for production
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
```

## Deployment to Render

Your Render service failed because Publish Directory was set to "npm start" (which is the Start Command, not a directory).

**Fix in Render Dashboard:**
1. Build Command: (leave **empty**)
2. Start Command: `npm start`
3. Publish Directory: (leave **empty**) - serves from root

**Environment Variables in Render:**
```
MONGO_URI  # MongoDB Atlas URI (e.g., mongodb+srv://...)
JWT_SECRET # Strong secret key
```

**Common Error:** "Publish directory npm start does not exist!" → Clear Publish Directory.

After changes, redeploy (connect GitHub repo if not already).


- `/config` - Database configuration and connection setup
- `/controllers` - Request handlers for business logic
- `/middleware` - Authentication, role checking, and validation logic
- `/models` - Mongoose database schemas
- `/routes` - API route definitions

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive a JWT

### Users (Admin Only)
- `GET /api/users` - Get all users (supports `page` and `limit` queries)
- `POST /api/users/create` - Create a new user with a specific role
- `PUT /api/users/:id/role` - Update a user's role
- `PUT /api/users/:id/status` - Activate or deactivate a user

### Records
- `GET /api/records` - Get records (supports `startDate`, `endDate`, `category`, `type`, `page`, and `limit`)
- `POST /api/records` - Create a new income or expense record
- `PUT /api/records/:id` - Update an existing record
- `DELETE /api/records/:id` - Soft delete a record

### Dashboard
- `GET /api/dashboard/summary` - Get total income, expenses, and net balance
- `GET /api/dashboard/categories` - Get category-wise totals
- `GET /api/dashboard/trends` - Get monthly trends
- `GET /api/dashboard/weekly-trends` - Get weekly trends
- `GET /api/dashboard/recent` - Get recent transactions

## Roles and Permissions

- **Viewer**: Read-only access. Can view their own records and dashboard data.
- **Analyst**: Read-only access. Can view their own records and dashboard data.
- **Admin**: Full access. Can create, read, update, and delete users and records.

## Key Implementation Notes

- Authentication is entirely stateless using JWTs.
- User roles and active status are fetched directly from the database during request validation, meaning token payloads are not blindly trusted.
- Deleting a record performs a soft delete (setting `isDeleted: true`) rather than physically removing the document from the database.
- All record queries automatically filter out soft-deleted documents.
- Input validation runs through `express-validator` before reaching the controllers.

## Limitations

- Dashboard aggregations are partially handled in memory after database fetches, which could be fully optimized in the MongoDB pipeline.
- The system currently lacks a refresh token mechanism; sessions expire strictly after 1 hour.
- Access control logic currently isolates records by user ID, meaning admins do not have a global view of all company records.
- There are currently no automated unit or integration tests.
