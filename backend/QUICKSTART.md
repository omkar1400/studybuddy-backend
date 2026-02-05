# 🚀 Quick Start Guide - StudyBuddy Backend

## For Omkar - Getting Started

### Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v18 or higher) - Check: `node --version`
- ✅ PostgreSQL installed - Check: `psql --version`
- ✅ Git installed - Check: `git --version`
- ✅ GitHub account created
- ✅ Render account created (free tier)

---

## Step-by-Step Setup (30 minutes)

### 1. Install Dependencies (5 min)

```bash
# Navigate to backend folder
cd "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy\backend"

# Install all packages
npm install
```

You should see:
```
added 75 packages
```

---

### 2. Set Up Local PostgreSQL (5 min)

#### Option A: Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `studybuddy`
4. Click "Save"

#### Option B: Using Command Line
```bash
# Open Command Prompt or PowerShell
psql -U postgres

# Inside psql:
CREATE DATABASE studybuddy;
\q
```

---

### 3. Configure Environment (2 min)

The `.env` file is already created! Just verify it:
- Open `.env` in VS Code
- Change `DB_PASSWORD` to your PostgreSQL password
- Save the file

---

### 4. Initialize Database Tables (2 min)

```bash
npm run init-db
```

You should see:
```
✅ Users table created
✅ Subjects table created
✅ StudySessions table created
✅ Indexes created
🎉 Database initialization completed successfully!
```

---

### 5. Start the Server (1 min)

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
📝 Environment: development
✅ Connected to PostgreSQL database
```

**Your API is now running at: http://localhost:5000**

---

### 6. Test the API (5 min)

Open a new terminal and run:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Register a test user
curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d "{\"name\":\"Omkar\",\"email\":\"omkar@test.com\",\"password\":\"test123\"}"
```

If it works, you'll get a JSON response with a token!

---

### 7. Set Up Git (5 min)

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: StudyBuddy Backend API"
```

---

### 8. Create GitHub Repository (3 min)

1. Go to https://github.com/new
2. Repository name: `studybuddy-backend`
3. Description: "StudyBuddy Backend API - PROG2500"
4. Make it **Public**
5. Click "Create repository"

Then connect your local repo:
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/studybuddy-backend.git
git branch -M main
git push -u origin main
```

---

### 9. Deploy to Render (10 min)

Follow the `DEPLOYMENT.md` guide step by step:

1. **Create PostgreSQL Database on Render**
   - New → PostgreSQL
   - Name: studybuddy-db
   - Copy the Internal Database URL

2. **Deploy Web Service**
   - New → Web Service
   - Connect GitHub repo
   - Add environment variables (use the database URL from step 1)
   - Deploy!

3. **Initialize Production Database**
   - Go to Shell tab
   - Run: `npm run init-db`

---

## Testing Your Deployment

Once deployed (should take 5-10 minutes):

```bash
# Replace YOUR-APP-NAME with your Render app name
curl https://YOUR-APP-NAME.onrender.com/health
```

Should return:
```json
{
  "success": true,
  "message": "Server and database are healthy"
}
```

---

## Common Issues & Quick Fixes

### "Cannot connect to PostgreSQL"
- Check PostgreSQL is running: `pg_ctl status`
- Verify password in `.env` is correct
- Make sure database `studybuddy` exists

### "npm: command not found"
- Node.js is not installed or not in PATH
- Download from: https://nodejs.org/

### "Port 5000 already in use"
- Another app is using port 5000
- Change PORT in `.env` to 5001
- Or stop the other app

### Git push asks for password every time
- Use HTTPS URL: `https://github.com/username/repo.git`
- Or set up SSH keys (advanced)

---

## File Structure Overview

```
backend/
├── config/
│   ├── db.js           ← PostgreSQL connection
│   └── initDb.js       ← Creates tables
├── controllers/
│   ├── userController.js     ← Login/Register logic
│   ├── subjectController.js  ← Subject CRUD
│   └── sessionController.js  ← Study session CRUD
├── middleware/
│   └── auth.js         ← JWT verification
├── routes/
│   ├── users.js        ← /api/users routes
│   ├── subjects.js     ← /api/subjects routes
│   └── sessions.js     ← /api/sessions routes
├── .env                ← Your local config (DO NOT commit!)
├── .env.example        ← Template for .env
├── .gitignore          ← Files Git should ignore
├── package.json        ← Dependencies and scripts
├── server.js           ← Main entry point
└── README.md           ← Full documentation
```

---

## Daily Development Workflow

```bash
# 1. Start your day
git pull origin main
npm run dev

# 2. Make changes to code
# ... edit files ...

# 3. Test locally
curl http://localhost:5000/api/...

# 4. Commit your changes
git add .
git commit -m "Descriptive message about what you changed"
git push origin main

# 5. Render auto-deploys!
# Wait 2-3 minutes, then test production
```

---

## What to Demo in Class (Sprint 1)

Be ready to show:

1. **GitHub Repository**
   - Show commit history (multiple commits!)
   - Show code structure

2. **Live Deployment**
   - Open: `https://your-app.onrender.com`
   - Show health endpoint working

3. **API Endpoints**
   - Register a user (live)
   - Login and get token
   - Create a subject
   - Create a study session

4. **Code Explanation**
   - "Show me where routes are defined" → `routes/` folder
   - "How do you handle auth?" → `middleware/auth.js`
   - "Where's the database connection?" → `config/db.js`

---

## Need Help?

- 📚 Read: `README.md` for full documentation
- 🚀 Deploy: Follow `DEPLOYMENT.md` step-by-step
- 🧪 Test: Use examples in `TESTING.md`
- 💻 Git: Check `GIT_SETUP.md` for Git commands

---

## Submission Checklist

Before submitting Sprint 1:

- [ ] Local development works (can register/login/CRUD)
- [ ] Code pushed to GitHub (10+ commits)
- [ ] Deployed to Render successfully
- [ ] All API endpoints tested and working
- [ ] Can access live URL
- [ ] Database tables initialized on Render
- [ ] README has deployment URL
- [ ] Ready to demo in class

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Initialize database tables
npm run init-db

# Check git status
git status

# Make a commit
git add .
git commit -m "Your message"
git push

# View logs (if server crashes)
# Check the terminal output

# Stop the server
# Press Ctrl+C in the terminal
```

---

**You're all set! 🎉**

Start with step 1 and work through each step. If you get stuck, check the detailed guides or ask for help during lab hours.

Good luck with Sprint 1!
