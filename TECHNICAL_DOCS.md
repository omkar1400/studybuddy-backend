# Technical Documentation - StudyBuddy Backend

## Architecture Overview

### MVC Pattern
The application follows the Model-View-Controller (MVC) architectural pattern:

- **Model**: Database schema (MySQL tables)
- **View**: JSON responses (RESTful API)
- **Controller**: Business logic handlers

### Request Flow
```
Client Request
    ↓
Express Router
    ↓
Authentication Middleware (if required)
    ↓
Controller
    ↓
Database (MySQL)
    ↓
JSON Response
```

## Database Design

### Entity-Relationship Diagram (ERD)

```
Users (1) ←--→ (Many) Subjects
  ↓
  |
  | (1)
  ↓
  → (Many) StudySessions ←-- (Many to 1) → Subjects
```

### Table Relationships

**Users → Subjects**: One-to-Many
- A user can have multiple subjects
- Each subject belongs to one user
- Foreign Key: `Subjects.user_id` references `Users.id`
- ON DELETE CASCADE: Deleting a user deletes all their subjects

**Users → StudySessions**: One-to-Many
- A user can have multiple study sessions
- Each session belongs to one user
- Foreign Key: `StudySessions.user_id` references `Users.id`
- ON DELETE CASCADE: Deleting a user deletes all their sessions

**Subjects → StudySessions**: One-to-Many
- A subject can have multiple study sessions
- Each session is linked to one subject
- Foreign Key: `StudySessions.subject_id` references `Subjects.id`
- ON DELETE CASCADE: Deleting a subject deletes all related sessions

### Data Integrity Features

1. **Primary Keys**: Auto-incrementing IDs for all tables
2. **Foreign Keys**: Enforced relationships with CASCADE delete
3. **Unique Constraints**: User email must be unique
4. **NOT NULL Constraints**: Required fields cannot be null
5. **ENUM Type**: Status field has predefined values
6. **Indexes**: Added on foreign keys and frequently queried fields

## API Architecture

### RESTful Principles

The API follows REST conventions:

| HTTP Method | Operation | Example |
|------------|-----------|---------|
| GET | Read/Retrieve | GET /api/subjects |
| POST | Create | POST /api/subjects |
| PUT | Update | PUT /api/subjects/1 |
| DELETE | Delete | DELETE /api/subjects/1 |

### Response Format

All responses follow a consistent JSON structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 5  // For list endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database/server issues |

## Authentication System

### JWT (JSON Web Tokens)

**Token Structure:**
```
Header.Payload.Signature
```

**Payload Contains:**
- User ID
- Email
- Expiration time (7 days)

**Token Flow:**
1. User registers/logs in
2. Server generates JWT with user info
3. Client stores token (localStorage/cookies)
4. Client sends token in Authorization header
5. Server verifies token on protected routes
6. Request processed if token valid

### Password Security

**bcrypt Hashing:**
- Salt rounds: 10
- Passwords never stored in plain text
- One-way hashing (cannot be reversed)
- Unique hash even for same password

**Registration Flow:**
```javascript
1. Receive password from client
2. Generate salt: bcrypt.genSalt(10)
3. Hash password: bcrypt.hash(password, salt)
4. Store hashed password in database
```

**Login Flow:**
```javascript
1. Receive email and password
2. Query database for user
3. Compare: bcrypt.compare(inputPassword, storedHash)
4. Generate JWT if passwords match
```

## Middleware

### Authentication Middleware (`middleware/auth.js`)

**Purpose**: Verify JWT token and extract user information

**How it works:**
```javascript
1. Extract token from Authorization header
2. Verify token using JWT_SECRET
3. Decode token to get user info
4. Attach user info to req.user
5. Call next() to proceed to controller
6. Or return 401 if token invalid
```

**Usage:**
```javascript
router.get('/subjects', auth, subjectController.getAllSubjects);
//                      ↑
//                Authentication required
```

### CORS Middleware

**Purpose**: Allow cross-origin requests from frontend

**Configuration:**
```javascript
app.use(cors());
// Allows requests from any origin
// In production, specify allowed origins
```

### JSON Parser Middleware

**Purpose**: Parse JSON request bodies

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

## Controllers

### Controller Structure

Each controller exports functions that:
1. Receive request (req) and response (res)
2. Extract data from req.body, req.params, req.user
3. Validate input data
4. Perform database operations
5. Send JSON response

### Error Handling Pattern

```javascript
try {
  // Database operations
  const [result] = await promisePool.query(...);
  
  // Success response
  res.json({ success: true, data: result });
  
} catch (error) {
  // Log error
  console.error('Error:', error);
  
  // Error response
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: error.message
  });
}
```

## Database Connection

### Connection Pooling

**Why pooling?**
- Reuses database connections
- Better performance
- Handles multiple concurrent requests
- Automatic connection management

**Configuration:**
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,  // Max 10 connections
  waitForConnections: true,
  queueLimit: 0  // No limit on queue
});
```

### Promise-Based Queries

**Using mysql2/promise:**
```javascript
const [rows, fields] = await promisePool.query(sql, params);
//      ↑      ↑
//    Results  Metadata
```

**Prepared Statements** (prevents SQL injection):
```javascript
// BAD (vulnerable to SQL injection)
const sql = `SELECT * FROM Users WHERE email = '${email}'`;

// GOOD (parameterized query)
const sql = 'SELECT * FROM Users WHERE email = ?';
const [users] = await promisePool.query(sql, [email]);
```

## Security Features

### 1. SQL Injection Prevention
- All queries use parameterized statements
- User input never directly in SQL strings

### 2. Password Security
- bcrypt hashing with salt
- Passwords never logged or exposed

### 3. JWT Authentication
- Secure token-based auth
- Tokens expire after 7 days
- Secret key stored in environment variable

### 4. Input Validation
- Check for required fields
- Validate data types
- Sanitize user input

### 5. Authorization
- Users can only access their own data
- All queries check user_id

### 6. Environment Variables
- Sensitive data in .env file
- .env excluded from Git (.gitignore)

## Performance Optimizations

### 1. Database Indexes
```sql
INDEX idx_email ON Users(email)
INDEX idx_user_id ON Subjects(user_id)
INDEX idx_user_id ON StudySessions(user_id)
INDEX idx_subject_id ON StudySessions(subject_id)
```

### 2. Connection Pooling
- Reuses database connections
- Reduces connection overhead

### 3. Async/Await
- Non-blocking operations
- Better performance under load

### 4. Selective Queries
- Only fetch needed columns
- Use WHERE clauses

## Code Organization

### Separation of Concerns

**Routes** (`routes/*.js`):
- Define API endpoints
- Apply middleware
- No business logic

**Controllers** (`controllers/*.js`):
- Handle business logic
- Validate input
- Database operations
- Send responses

**Middleware** (`middleware/*.js`):
- Reusable request processing
- Authentication
- Validation

**Config** (`config/*.js`):
- Database configuration
- Environment setup

## Environment Variables

### Why Environment Variables?

1. **Security**: Keep secrets out of code
2. **Flexibility**: Different configs for dev/prod
3. **Portability**: Easy deployment

### Required Variables

```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment
DB_HOST=localhost            # Database host
DB_USER=root                 # Database user
DB_PASSWORD=password         # Database password
DB_NAME=studybuddy           # Database name
JWT_SECRET=secret_key        # JWT signing key
```

## Testing Strategy

### Manual Testing
1. Postman/Insomnia collection
2. API_TESTING.md document
3. Sample requests for each endpoint

### Testing Checklist
- [ ] User registration
- [ ] User login
- [ ] Token authentication
- [ ] CRUD operations for subjects
- [ ] CRUD operations for sessions
- [ ] Authorization (users can't access others' data)
- [ ] Error handling
- [ ] Input validation

## Deployment Considerations

### Production Checklist
- [ ] Environment variables set
- [ ] Database schema deployed
- [ ] JWT_SECRET is random and secure
- [ ] CORS configured for frontend domain
- [ ] Error logging enabled
- [ ] Database connection pooling
- [ ] HTTPS enabled (Render provides this)

### Render-Specific
- Uses internal database hostname
- Automatic HTTPS
- Environment variables in dashboard
- Logs available in web interface

## Common Patterns Used

### 1. Async/Await Pattern
```javascript
const getData = async () => {
  try {
    const result = await asyncOperation();
    return result;
  } catch (error) {
    handleError(error);
  }
};
```

### 2. Destructuring Assignment
```javascript
const { name, email } = req.body;
const [rows] = await query(...);
```

### 3. Arrow Functions
```javascript
exports.getAll = async (req, res) => {
  // Function body
};
```

### 4. Template Literals
```javascript
console.log(`Server running on port ${PORT}`);
```

### 5. Middleware Chaining
```javascript
router.get('/', auth, validate, controller);
//              ↑     ↑        ↑
//           Middleware chain
```

## Future Enhancements (Beyond Sprint 1)

### Sprint 2 - Frontend
- React frontend
- User interface
- Forms and validation
- State management

### Sprint 3 - Integration
- Connect frontend to backend
- Authentication flow
- CRUD operations from UI
- Deployment of full stack

### Potential Features
- Email verification
- Password reset
- Study session reminders
- Progress tracking
- Study statistics
- Calendar integration
- Collaborative study groups

## Troubleshooting Guide

### Issue: "Cannot connect to database"
**Check:**
- MySQL is running
- Credentials in .env are correct
- Database exists
- Network/firewall settings

### Issue: "Token not valid"
**Check:**
- Token sent in Authorization header
- Format: "Bearer TOKEN"
- JWT_SECRET matches between requests
- Token not expired

### Issue: "404 Not Found"
**Check:**
- Route path is correct
- HTTP method matches
- Server is running
- Port is correct

## Learning Outcomes Achieved

### CLO1: RESTful APIs
✅ Scalable Node.js/Express architecture
✅ RESTful endpoint design
✅ Proper HTTP methods and status codes

### CLO2: Database
✅ MySQL relational database
✅ Foreign key relationships
✅ Data integrity constraints

### CLO5: Security
✅ JWT authentication
✅ Password hashing (bcrypt)
✅ Authorization checks
✅ SQL injection prevention

### CLO6: Deployment
✅ Deployment-ready configuration
✅ Environment variables
✅ Production-ready error handling
✅ Render deployment guide

---

For questions or issues, refer to:
- SETUP.md (setup instructions)
- API_TESTING.md (endpoint testing)
- DEPLOYMENT.md (deployment guide)
- README.md (project overview)
