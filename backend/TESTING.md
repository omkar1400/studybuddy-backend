# API Testing Guide

## Quick Test Commands

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Omkar Singh",
    "email": "omkar@test.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "omkar@test.com",
    "password": "password123"
  }'
```

**Save the token from the response!**

### 3. Create a Subject
```bash
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Data Structures",
    "description": "Algorithms and complexity analysis"
  }'
```

### 4. Get All Subjects
```bash
curl -X GET http://localhost:5000/api/subjects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Create a Study Session
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "subject_id": 1,
    "title": "Binary Trees Practice",
    "description": "Practice tree traversal algorithms",
    "start_time": "2026-02-06T14:00:00Z",
    "end_time": "2026-02-06T16:00:00Z",
    "status": "pending"
  }'
```

### 6. Get All Study Sessions
```bash
curl -X GET http://localhost:5000/api/sessions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Update Study Session Status
```bash
curl -X PUT http://localhost:5000/api/sessions/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "completed"
  }'
```

### 8. Get Sessions by Status
```bash
curl -X GET http://localhost:5000/api/sessions/status/pending \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Delete a Subject
```bash
curl -X DELETE http://localhost:5000/api/subjects/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 10. Delete a Study Session
```bash
curl -X DELETE http://localhost:5000/api/sessions/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Postman Collection

Import these endpoints into Postman:

**Base URL:** `http://localhost:5000/api`

**Variables:**
- `{{baseUrl}}` = `http://localhost:5000/api`
- `{{token}}` = (set after login)

### Collection:

1. **POST** `/users/register`
2. **POST** `/users/login`
3. **GET** `/users/profile` (requires token)
4. **GET** `/subjects` (requires token)
5. **POST** `/subjects` (requires token)
6. **GET** `/subjects/:id` (requires token)
7. **PUT** `/subjects/:id` (requires token)
8. **DELETE** `/subjects/:id` (requires token)
9. **GET** `/sessions` (requires token)
10. **POST** `/sessions` (requires token)
11. **GET** `/sessions/:id` (requires token)
12. **PUT** `/sessions/:id` (requires token)
13. **DELETE** `/sessions/:id` (requires token)
14. **GET** `/sessions/status/:status` (requires token)

## Expected Test Flow

1. Register a new user → Get token
2. Create 2-3 subjects
3. Create study sessions for those subjects
4. Get all sessions → Verify they're returned
5. Update a session status to "completed"
6. Get sessions by status → Verify filtering works
7. Delete a session
8. Delete a subject → Verify cascade delete of related sessions
