# Finance Dashboard Backend

This project is a REST API built using Node.js, Express, and MongoDB. It is designed to manage personal finance data such as income and expenses. The system also includes user authentication and role-based access control.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB and Mongoose
* JSON Web Tokens (JWT) for authentication
* bcrypt for password hashing
* express-validator for request validation

---

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd finance-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

---

## Environment Variables

Create a `.env` file and add:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

---

## Deployment (Render)

To deploy the project on Render:

* Build Command: leave empty
* Start Command: `npm start`
* Publish Directory: leave empty

If you get the error:

```
Publish directory npm start does not exist
```

clear the Publish Directory field and redeploy.

Environment variables required on Render:

* MONGO_URI
* JWT_SECRET

---

## Project Structure

```
config/        → Database connection setup  
controllers/   → Business logic  
middleware/    → Authentication and role handling  
models/        → Database schemas  
routes/        → API routes  
docs/          → Swagger documentation (if separated)  
```

---

## API Endpoints

### Auth

* POST /api/auth/register → Register a new user
* POST /api/auth/login → Login and get a JWT token

---

### Users (Admin Only)

* GET /api/users → Get all users (supports pagination)
* POST /api/users/create → Create a new user
* PUT /api/users/:id/role → Update user role
* PUT /api/users/:id/status → Activate or deactivate a user

---

### Records

* GET /api/records → Get records with filters and pagination
* POST /api/records → Create a new record
* PUT /api/records/:id → Update a record
* DELETE /api/records/:id → Soft delete a record

Filters supported:

* startDate, endDate
* category, type
* page, limit

---

### Dashboard

* GET /api/dashboard/summary → Get total income, expense, and balance
* GET /api/dashboard/categories → Get totals grouped by category
* GET /api/dashboard/trends → Get monthly trends
* GET /api/dashboard/weekly-trends → Get weekly trends
* GET /api/dashboard/recent → Get recent transactions

---

## Roles and Permissions

* Viewer

  * Can view their own records and dashboard data

* Analyst

  * Can create and view their own records
  * Can access dashboard analytics

* Admin

  * Full access to users and records

---

## Key Implementation Details

* Authentication is handled using JWT and is stateless
* Passwords are hashed using bcrypt
* Role-based access is implemented using middleware
* Records are soft deleted using an `isDeleted` field
* All queries exclude deleted records
* Input validation is handled using express-validator

---

## Limitations

* No refresh token mechanism (tokens expire after 1 hour)
* No rate limiting or advanced security features
* Some dashboard queries can be further optimized
* Admin does not have a global view of all user records
* No automated tests are included

---

## API Documentation

Swagger documentation is available at:

```
/api-docs
```

---

## Notes

This project was built to demonstrate backend concepts such as API design, authentication, role-based access control, and working with MongoDB.

---

## Author

Sai Vinay Guttula
