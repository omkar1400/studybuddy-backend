# StudyBuddy Backend - API Documentation

## 🚀 Overview

StudyBuddy is a RESTful API built with Node.js, Express, and PostgreSQL that helps students plan, organize, and track their study sessions efficiently.

**Author:** Omkar Singh (8781929)  
**Course:** PROG2500 - Full Stack Development

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **CORS:** Enabled for cross-origin requests

---

## 🗄 Database Schema

### Users Table
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

**Relationships:**
- 1 User → Many Subjects (1:M)
- 1 User → Many Study Sessions (1:M)
- 1 Subject → Many Study Sessions (1:M)

---

## 🔧 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Local Setup

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
PORT=5000
NODE_ENV=development

# For local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=studybuddy

# For Render (cloud deployment)
# DATABASE_URL=postgresql://user:password@host:port/database

JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

4. **Create the database**
```bash
# Using psql
psql -U postgres
CREATE DATABASE studybuddy;
\q
```

5. **Initialize database tables**
```bash
npm run init-db
```

6. **Start the server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server will run at `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register New User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-02-04T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
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

## 👨‍💻 Developer Notes

### Sprint 1 Requirements Met ✅

- ✅ Node.js and Express setup
- ✅ PostgreSQL database with 3 tables
- ✅ RESTful API endpoints (CRUD)
- ✅ Authentication (JWT)
- ✅ Data relationships (1:M)
- ✅ Ready for deployment to Render
- ✅ Proper error handling
- ✅ API documentation

### Next Steps (Sprint 2 & 3)

- [ ] Build React frontend
- [ ] Connect frontend to backend API
- [ ] Deploy frontend to Render/Netlify
- [ ] Add advanced features (filtering, sorting, etc.)

---

## 📞 Support

For questions or issues:
- Email: omkar.singh@example.com
- Student ID: 8781929

---

**Built with ❤️ for PROG2500 - Full Stack Development**
