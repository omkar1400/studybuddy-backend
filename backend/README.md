# StudyBuddy Backend - API Documentation

## 🚀 Overview

This is the backend API for StudyBuddy, a study planner app I built for managing study sessions and subjects. It's built with Node.js, Express, and PostgreSQL - pretty straightforward stack that gets the job done.

The API handles user registration, authentication, and all the CRUD operations for managing subjects and study sessions. Everything is protected by JWT authentication to keep user data safe.

**Author:** Omkar Singh (8781929)  
**Course:** PROG2500 - Full Stack Development  
**Status:** Deployed on Render

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## 🛠 Tech Stack

I went with these tools because they're reliable and easy to work with:

- **Node.js** (v18+) - JavaScript runtime, works great for server-side code
- **Express.js** - Simple and flexible web framework. I use it to handle all the routes and middleware
- **PostgreSQL** - Relational database. Good for structured data like user accounts and subject relationships
- **JWT** - For authentication. User logs in once, gets a token, and uses it to access protected routes
- **bcryptjs** - Password hashing. Makes sure passwords are never stored in plaintext
- **dotenv** - For managing environment variables so secrets don't end up in version control
- **CORS** - Enabled so the frontend can talk to the backend without issues

---

## 🗄 Database Schema

I designed the database with three main tables. Here's how they work together:

### Users Table
Stores account information. Email is unique so no duplicate accounts.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subjects Table
Each student can have multiple subjects (Math, History, etc.). Links back to the user.

```sql
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Study Sessions Table
Where I track actual study sessions - when they started, ended, and what status they're in.

```sql
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
```

**How they connect:**
- One user can have many subjects
- One user can have many study sessions  
- One subject can have many study sessions
- When you delete a user, everything related to them gets deleted too (CASCADE)

---

## 🔧 Installation

### What You'll Need
- Node.js v18+ (I'm using v18.17)
- PostgreSQL v12+ (for the database)
- npm (comes with Node)

If you don't have these installed, grab them from their official websites.

### Getting It Set Up Locally

**Step 1: Navigate to the backend folder**
```bash
cd backend
```

**Step 2: Install all the npm packages**
```bash
npm install
```

**Step 3: Set up your environment file**
```bash
cp .env.example .env
```

Then open `.env` in your editor and fill in your details:
```env
PORT=5000
NODE_ENV=development

# Local database (if you have PostgreSQL running locally)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=studybuddy

# Or use Render's DATABASE_URL if deploying there
# DATABASE_URL=postgresql://user:password@host:port/database

JWT_SECRET=make_this_something_random_and_secure
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

**Step 4: Create your database**
Open a terminal and run PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE studybuddy;
\q
```

**Step 5: Create the tables**
```bash
npm run init-db
```

This will create all three tables and set up the schema.

**Step 6: Start the server**
```bash
# For development (auto-restarts when you change files)
npm run dev

# For production
npm start
```

The API should now be running at `http://localhost:5000`

---

## 📡 API Endpoints

All API endpoints start with:
```
http://localhost:5000/api
```

### User Endpoints (Authentication)

**Register a new user**
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Returns a user object and JWT token. You'll use this token for subsequent requests.

**Login**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns your user info and a new JWT token.

**Get your profile**
```http
GET /api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

Need to be logged in (include the Bearer token).

### Subject Endpoints

**Get all your subjects**
```http
GET /api/subjects
Authorization: Bearer YOUR_JWT_TOKEN
```

**Get one subject by ID**
```http
GET /api/subjects/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Create a new subject**
```http
POST /api/subjects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Mathematics",
  "description": "Calculus and Algebra"
}
```

**Update a subject**
```http
PUT /api/subjects/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Advanced Math",
  "description": "Updated description"
}
```

**Delete a subject**
```http
DELETE /api/subjects/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Study Sessions Endpoints

**Get all your sessions**
```http
GET /api/sessions
Authorization: Bearer YOUR_JWT_TOKEN
```

**Get sessions by status (pending/completed/cancelled)**
```http
GET /api/sessions/status/completed
Authorization: Bearer YOUR_JWT_TOKEN
```

**Get one session**
```http
GET /api/sessions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Create a new session**
```http
POST /api/sessions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "subject_id": 1,
  "title": "Chapter Review",
  "description": "Review chapters 5-7",
  "start_time": "2026-03-25T10:00:00Z",
  "end_time": "2026-03-25T12:00:00Z",
  "status": "pending"
}
```

**Update a session**
```http
PUT /api/sessions/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "completed"
}
```

Minimum fields required - only send what you're updating.

**Delete a session**
```http
DELETE /api/sessions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 💡 Error Handling

If something goes wrong, you'll get back a JSON response with `success: false` and an error message. For example:

```json
{
  "success": false,
  "message": "Email or password is incorrect"
}
```

HTTP status codes:
- **200** - Success
- **201** - Created successfully
- **400** - Bad request (validation error)
- **401** - Unauthorized (need to login)
- **404** - Not found
- **500** - Server error

---

## 🌐 Deployment

The API is deployed on Render.com. The live URL is:
```
https://studybuddy-api-bbl7.onrender.com/api
```

You can make requests to this just like the local version - use the same endpoints.
    "id": 1,
    "name": "Johnso",
    "email": "john@example.com",
    "created_at": "2026-02-04T10:00:00.000Z"
  }
}
```

---

### Subjects

> **Note:** All subject endpoints require authentication (JWT token in Authorization header)

#### Get All Subjects
```http
GET /api/subjects
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Mathematics",
      "description": "Calculus and Linear Algebra",
      "created_at": "2026-02-04T10:00:00.000Z",
      "updated_at": "2026-02-04T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Subject
```http
GET /api/subjects/:id
Authorization: Bearer <token>
```

#### Create New Subject
```http
POST /api/subjects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Physics",
  "description": "Quantum Mechanics"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Subject created successfully",
  "data": {
    "id": 2,
    "user_id": 1,
    "name": "Physics",
    "description": "Quantum Mechanics",
    "created_at": "2026-02-04T11:00:00.000Z",
    "updated_at": "2026-02-04T11:00:00.000Z"
  }
}
```

#### Update Subject
```http
PUT /api/subjects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Advanced Physics",
  "description": "Quantum Mechanics and Relativity"
}
```

#### Delete Subject
```http
DELETE /api/subjects/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

---

### Study Sessions

> **Note:** All session endpoints require authentication (JWT token in Authorization header)

#### Get All Study Sessions
```http
GET /api/sessions
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "subject_id": 1,
      "subject_name": "Mathematics",
      "title": "Calculus Review",
      "description": "Review derivatives and integrals",
      "start_time": "2026-02-05T14:00:00.000Z",
      "end_time": "2026-02-05T16:00:00.000Z",
      "status": "pending",
      "created_at": "2026-02-04T10:00:00.000Z",
      "updated_at": "2026-02-04T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Study Session
```http
GET /api/sessions/:id
Authorization: Bearer <token>
```

#### Get Sessions by Status
```http
GET /api/sessions/status/:status
Authorization: Bearer <token>
```

Valid statuses: `pending`, `completed`, `cancelled`

#### Create New Study Session
```http
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject_id": 1,
  "title": "Algebra Practice",
  "description": "Practice problems from chapter 5",
  "start_time": "2026-02-06T10:00:00.000Z",
  "end_time": "2026-02-06T12:00:00.000Z",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Study session created successfully",
  "data": {
    "id": 2,
    "user_id": 1,
    "subject_id": 1,
    "title": "Algebra Practice",
    "description": "Practice problems from chapter 5",
    "start_time": "2026-02-06T10:00:00.000Z",
    "end_time": "2026-02-06T12:00:00.000Z",
    "status": "pending",
    "created_at": "2026-02-04T12:00:00.000Z",
    "updated_at": "2026-02-04T12:00:00.000Z"
  }
}
```

#### Update Study Session
```http
PUT /api/sessions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "description": "Completed all practice problems"
}
```

#### Delete Study Session
```http
DELETE /api/sessions/:id
Authorization: Bearer <token>
```

---

## 🚀 Deployment to Render

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `studybuddy-db`
   - Database: `studybuddy`
   - User: (auto-generated)
   - Region: Choose closest to you
   - Plan: Free
4. Click "Create Database"
5. Copy the **Internal Database URL** (it will look like: `postgresql://user:pass@host/db`)

### Step 2: Deploy Backend to Render

1. Push your code to GitHub
2. Go to Render Dashboard
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `studybuddy-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

6. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste-your-internal-database-url>
   JWT_SECRET=<generate-a-random-secret>
   JWT_EXPIRE=7d
   CLIENT_URL=<your-frontend-url-or-*>
   ```

7. Click "Create Web Service"

### Step 3: Initialize Database

After deployment:
1. Go to your web service → "Shell" tab
2. Run: `npm run init-db`

Your API will be live at: `https://studybuddy-api.onrender.com`

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get subjects (replace TOKEN)
curl -X GET http://localhost:5000/api/subjects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Thunder Client

1. Import the endpoints into your preferred API client
2. Set the base URL to `http://localhost:5000/api`
3. For protected routes, add Authorization header:
   - Type: Bearer Token
   - Token: (paste JWT token from login response)

---

## 📝 Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected routes with middleware
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Environment variable protection

---

## 📦 Project Structure

```
backend/
├── config/
│   ├── db.js              # PostgreSQL connection
│   └── initDb.js          # Database initialization
├── controllers/
│   ├── userController.js     # User logic
│   ├── subjectController.js  # Subject logic
│   └── sessionController.js  # Session logic
├── middleware/
│   └── auth.js            # JWT authentication
├── routes/
│   ├── users.js           # User routes
│   ├── subjects.js        # Subject routes
│   └── sessions.js        # Session routes
├── .env.example           # Environment template
├── .gitignore
├── package.json
├── server.js              # Entry point
└── README.md
```

---

## 📞 Support

For questions or issues:
- Email: omkar.singh@example.com
- Student ID: 8781929

---