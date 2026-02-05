# API Testing Guide for StudyBuddy

This document contains example API requests you can use to test the StudyBuddy API using tools like Postman, Insomnia, or curl.

## Base URL
```
http://localhost:5000
```

## 1. User Registration

### Register a new user
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 2. User Login

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Important:** Save the `token` from the response. You'll need it for all authenticated requests.

## 3. Get User Profile

### Get current user's profile
```
GET /api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

## 4. Subjects

### Get all subjects
```
GET /api/subjects
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create a new subject
```
POST /api/subjects
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Mathematics",
  "description": "Calculus and Linear Algebra"
}
```

### Get a specific subject
```
GET /api/subjects/1
Authorization: Bearer YOUR_TOKEN_HERE
```

### Update a subject
```
PUT /api/subjects/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Advanced Mathematics",
  "description": "Calculus, Linear Algebra, and Differential Equations"
}
```

### Delete a subject
```
DELETE /api/subjects/1
Authorization: Bearer YOUR_TOKEN_HERE
```

## 5. Study Sessions

### Get all study sessions
```
GET /api/sessions
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create a new study session
```
POST /api/sessions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "subject_id": 1,
  "title": "Calculus Review",
  "description": "Review derivatives and integrals",
  "start_time": "2026-02-10 14:00:00",
  "end_time": "2026-02-10 16:00:00",
  "status": "pending"
}
```

**Status Options:** `pending`, `completed`, `cancelled`

### Get a specific study session
```
GET /api/sessions/1
Authorization: Bearer YOUR_TOKEN_HERE
```

### Update a study session
```
PUT /api/sessions/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Advanced Calculus Review",
  "description": "Review derivatives, integrals, and limits",
  "status": "completed"
}
```

### Delete a study session
```
DELETE /api/sessions/1
Authorization: Bearer YOUR_TOKEN_HERE
```

## Testing with curl

### Register
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Subjects (replace TOKEN with your actual token)
```bash
curl -X GET http://localhost:5000/api/subjects \
  -H "Authorization: Bearer TOKEN"
```

### Create Subject
```bash
curl -X POST http://localhost:5000/api/subjects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mathematics","description":"Calculus and Linear Algebra"}'
```

## Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No authentication token, access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Subject not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide name, email, and password"
}
```

## Testing Workflow

1. **Register** a new user
2. **Login** to get the authentication token
3. **Create** 2-3 subjects
4. **Create** study sessions for those subjects
5. **Update** a study session status to "completed"
6. **Get** all sessions to see the updated list
7. **Delete** a test session

This workflow will help you verify all CRUD operations are working correctly!
