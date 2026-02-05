# Setup Guide - StudyBuddy Backend

## Quick Start (Local Development)

### 1. Install Node.js and MySQL

**Node.js:**
- Download from https://nodejs.org/ (v18 or higher)
- Verify installation: `node --version`

**MySQL:**
- Download from https://dev.mysql.com/downloads/mysql/
- Or install via XAMPP/WAMP (includes MySQL)
- Or use MySQL Workbench

### 2. Clone/Navigate to Project

```bash
cd "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy"
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express (web framework)
- mysql2 (database driver)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- cors (cross-origin requests)
- dotenv (environment variables)
- express-validator (input validation)

### 4. Set Up Database

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql

# Or on Windows:
mysql -u root -p < database/schema.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open `database/schema.sql`
4. Click "Execute" (lightning bolt icon)

#### Option C: Copy-Paste SQL
1. Open `database/schema.sql`
2. Copy all SQL commands
3. Paste into MySQL console/workbench
4. Execute

### 5. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Or on Windows:
copy .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=studybuddy
JWT_SECRET=my_super_secret_key_12345
NODE_ENV=development
```

**Important:** Replace `your_mysql_password` with your actual MySQL password!

### 6. Start the Server

#### Development Mode (auto-restart on changes):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 5000
📍 Local: http://localhost:5000
```

### 7. Test the API

Open your browser or use curl:
```bash
curl http://localhost:5000
```

You should see a welcome message with available endpoints.

## Testing with Postman/Insomnia

1. Download Postman: https://www.postman.com/downloads/
2. Import the requests from `API_TESTING.md`
3. Start testing the endpoints!

### Quick Test Flow:

1. **Register a user:**
   ```
   POST http://localhost:5000/api/users/register
   Body: {"name":"Test","email":"test@test.com","password":"test123"}
   ```

2. **Login:**
   ```
   POST http://localhost:5000/api/users/login
   Body: {"email":"test@test.com","password":"test123"}
   ```
   Save the `token` from the response!

3. **Create a subject:**
   ```
   POST http://localhost:5000/api/subjects
   Headers: Authorization: Bearer YOUR_TOKEN
   Body: {"name":"Math","description":"Calculus"}
   ```

4. **Get subjects:**
   ```
   GET http://localhost:5000/api/subjects
   Headers: Authorization: Bearer YOUR_TOKEN
   ```

## Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install`

### Issue: "Database connection failed"
**Solutions:**
- Check MySQL is running
- Verify database credentials in `.env`
- Make sure `studybuddy` database exists
- Run `database/schema.sql` if tables don't exist

### Issue: "EADDRINUSE: Port 5000 already in use"
**Solutions:**
- Change PORT in `.env` to 3000 or another port
- Or stop the process using port 5000

### Issue: "JWT_SECRET is not defined"
**Solution:** Make sure `.env` file exists and has JWT_SECRET

### Issue: MySQL "Access denied"
**Solutions:**
- Check DB_PASSWORD in `.env`
- Reset MySQL root password if needed
- Make sure user has proper permissions

## Project Structure Explained

```
StudyBuddy/
├── config/
│   └── db.js                  # Database connection setup
├── controllers/
│   ├── authController.js      # User registration/login logic
│   ├── subjectController.js   # Subject CRUD operations
│   └── sessionController.js   # Study session CRUD operations
├── middleware/
│   └── auth.js                # JWT authentication middleware
├── routes/
│   ├── users.js               # User API routes
│   ├── subjects.js            # Subject API routes
│   └── sessions.js            # Session API routes
├── database/
│   └── schema.sql             # Database schema and sample data
├── .env                       # Environment variables (create this)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── server.js                  # Main application entry point
├── package.json               # Project dependencies
├── README.md                  # Project documentation
├── API_TESTING.md             # API testing guide
├── DEPLOYMENT.md              # Deployment instructions
└── SETUP.md                   # This file
```

## Development Workflow

1. **Start MySQL** (if not already running)
2. **Run the server:** `npm run dev`
3. **Test endpoints** using Postman/Insomnia
4. **Make changes** to code (auto-restarts with nodemon)
5. **Commit changes** regularly to Git

## Git Workflow for Assignment

```bash
# Initialize repository (if not done)
git init

# Add all files
git add .

# Commit with meaningful message
git commit -m "Add user authentication endpoints"

# Continue working and committing regularly
git commit -m "Add subject CRUD operations"
git commit -m "Add study session management"
git commit -m "Add input validation"

# Push to GitHub
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

**Important for Grading:** Make multiple commits throughout development to show your progress!

## Ready for Demo?

Before your Sprint 1 demo, make sure:
- [ ] Server starts without errors
- [ ] Database connection works
- [ ] Can register a new user
- [ ] Can login and receive JWT token
- [ ] Can create/read/update/delete subjects
- [ ] Can create/read/update/delete study sessions
- [ ] Code is pushed to GitHub with commit history
- [ ] (Optional) Deployed to Render with live URL

## Next Steps

After completing Sprint 1 Backend:
1. Complete Sprint 2 (React Frontend)
2. Complete Sprint 3 (Frontend-Backend Integration)
3. Final deployment for full-stack application

## Need Help?

- Check `API_TESTING.md` for endpoint examples
- Check `DEPLOYMENT.md` for deployment help
- Review error messages in terminal
- Check MySQL logs for database issues
- Ask your instructor during lab sessions

Good luck with your Sprint 1! 🚀
