# StudyBuddy - Study Session Planner

A full-stack web application that helps students plan, organize, and track their study sessions efficiently.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Subject Management**: Create, read, update, and delete study subjects
- **Study Session Tracking**: Schedule and manage study sessions with status tracking
- **RESTful API**: Clean and organized API endpoints

## Technology Stack

### Backend
- Node.js
- Express.js
- MySQL / MariaDB
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL or MariaDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd StudyBuddy
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=studybuddy
JWT_SECRET=your_jwt_secret_key
```

4. Set up the database
```bash
# Run the database schema script
mysql -u your_user -p < database/schema.sql
```

5. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Subjects
- `GET /api/subjects` - Get all subjects for logged-in user
- `POST /api/subjects` - Create a new subject
- `PUT /api/subjects/:id` - Update a subject
- `DELETE /api/subjects/:id` - Delete a subject

### Study Sessions
- `GET /api/sessions` - Get all study sessions for logged-in user
- `GET /api/sessions/:id` - Get a specific study session
- `POST /api/sessions` - Create a new study session
- `PUT /api/sessions/:id` - Update a study session
- `DELETE /api/sessions/:id` - Delete a study session

## Database Schema

### Users Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, hashed)
- `created_at` (TIMESTAMP)

### Subjects Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY)
- `name` (VARCHAR)
- `description` (TEXT)
- `created_at` (TIMESTAMP)

### StudySessions Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY)
- `subject_id` (INT, FOREIGN KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `start_time` (DATETIME)
- `end_time` (DATETIME)
- `status` (ENUM: 'pending', 'completed', 'cancelled')
- `created_at` (TIMESTAMP)

## Project Structure

```
StudyBuddy/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── subjectController.js
│   └── sessionController.js
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── users.js
│   ├── subjects.js
│   └── sessions.js
├── database/
│   └── schema.sql         # Database schema
├── .env                   # Environment variables
├── .gitignore
├── server.js              # Main application file
└── package.json

```

## Author

**Omkar Singh** - Student ID: 8781929

## Course Information

PROG2500 - Open Source Full Stack Development
Conestoga College

## License

This project is licensed under the ISC License.
