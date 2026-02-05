# 🚀 QUICK START CHECKLIST - StudyBuddy Sprint 1

## ⏱️ Total Time Needed: 1-2 hours

---

## 📋 PHASE 1: Local Setup (30 minutes)

### Step 1: Install Software ✅
- [ ] Node.js installed (v18+) - Download from https://nodejs.org
- [ ] MySQL installed - XAMPP, WAMP, or standalone MySQL
- [ ] Git installed - Download from https://git-scm.com
- [ ] Postman installed (optional) - For API testing

### Step 2: Project Setup ✅
```bash
# Navigate to project
cd "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy"

# Install dependencies
npm install
```

### Step 3: Database Setup ✅
- [ ] Start MySQL server
- [ ] Create database: Run `database/schema.sql`
  ```sql
  -- In MySQL:
  source database/schema.sql
  ```
- [ ] Verify tables created: `SHOW TABLES;`

### Step 4: Environment Configuration ✅
- [ ] Create `.env` file from `.env.example`
- [ ] Update database credentials in `.env`
  ```env
  DB_USER=root
  DB_PASSWORD=your_mysql_password
  DB_NAME=studybuddy
  JWT_SECRET=any_random_string_here
  ```

### Step 5: Test Server ✅
```bash
# Start server
npm start

# Expected output:
# ✅ Database connected successfully
# 🚀 Server is running on port 5000
```

- [ ] Open browser: http://localhost:5000
- [ ] See welcome message

---

## 🧪 PHASE 2: Test APIs (15 minutes)

### Quick API Test Workflow ✅

1. **Register a User**
   ```bash
   POST http://localhost:5000/api/users/register
   Body: {
     "name": "Test User",
     "email": "test@test.com",
     "password": "test123"
   }
   ```
   - [ ] Status 201
   - [ ] Copy the `token` from response

2. **Create a Subject**
   ```bash
   POST http://localhost:5000/api/subjects
   Headers: Authorization: Bearer YOUR_TOKEN
   Body: {
     "name": "Math",
     "description": "Calculus"
   }
   ```
   - [ ] Status 201
   - [ ] Note the subject `id`

3. **Create a Study Session**
   ```bash
   POST http://localhost:5000/api/sessions
   Headers: Authorization: Bearer YOUR_TOKEN
   Body: {
     "subject_id": 1,
     "title": "Study Calculus",
     "description": "Review derivatives",
     "start_time": "2026-02-10 14:00:00",
     "end_time": "2026-02-10 16:00:00",
     "status": "pending"
   }
   ```
   - [ ] Status 201

4. **Get All Sessions**
   ```bash
   GET http://localhost:5000/api/sessions
   Headers: Authorization: Bearer YOUR_TOKEN
   ```
   - [ ] Status 200
   - [ ] See your created session

### Use Postman (Easier!)
- [ ] Import `StudyBuddy.postman_collection.json`
- [ ] Set BASE_URL to `http://localhost:5000`
- [ ] Run through all requests
- [ ] Save TOKEN after login

---

## 📦 PHASE 3: Git & GitHub (20 minutes)

### Step 1: Initialize Git ✅
```bash
git init
git config user.name "Omkar Singh"
git config user.email "your_email@example.com"
```

### Step 2: Make Commits ✅
```bash
# Commit 1: Setup
git add package.json .gitignore .env.example README.md database/ config/
git commit -m "Initial setup: project configuration and database schema"

# Commit 2: Authentication
git add middleware/ controllers/authController.js routes/users.js
git commit -m "Add JWT authentication with registration and login"

# Commit 3: Subjects
git add controllers/subjectController.js routes/subjects.js
git commit -m "Add subject management with CRUD operations"

# Commit 4: Sessions
git add controllers/sessionController.js routes/sessions.js
git commit -m "Add study session management with validation"

# Commit 5: Server
git add server.js
git commit -m "Add Express server with error handling"

# Commit 6: Documentation
git add *.md *.json
git commit -m "Add comprehensive documentation and testing files"
```

### Step 3: Push to GitHub ✅
- [ ] Create repository on GitHub
- [ ] Make it **PUBLIC**
- [ ] Name it: `studybuddy`

```bash
git remote add origin https://github.com/YOUR_USERNAME/studybuddy.git
git branch -M main
git push -u origin main
```

- [ ] Verify on GitHub website

---

## ☁️ PHASE 4: Deploy to Render (30-45 minutes)

### Step 1: Create MySQL Database ✅
1. [ ] Go to https://render.com/dashboard
2. [ ] Click "New +" → "MySQL"
3. [ ] Name: `studybuddy-db`
4. [ ] Create Database
5. [ ] **Save connection details!**

### Step 2: Initialize Database ✅
- [ ] Connect to Render MySQL
- [ ] Run `database/schema.sql`
- [ ] Verify tables exist

### Step 3: Deploy Web Service ✅
1. [ ] Click "New +" → "Web Service"
2. [ ] Connect GitHub repository
3. [ ] Configure:
   - Name: `studybuddy-api`
   - Build: `npm install`
   - Start: `npm start`
   - Instance: Free

4. [ ] Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=<from Render MySQL>
   DB_USER=<from Render MySQL>
   DB_PASSWORD=<from Render MySQL>
   DB_NAME=studybuddy
   JWT_SECRET=<random string>
   ```

5. [ ] Click "Create Web Service"
6. [ ] Wait 3-5 minutes for deployment

### Step 4: Test Live API ✅
- [ ] Copy your Render URL (e.g., `https://studybuddy-api.onrender.com`)
- [ ] Test in browser or Postman
- [ ] Register a new user
- [ ] Create subjects and sessions

---

## 📝 PHASE 5: Prepare for Demo (10 minutes)

### Practice Answering These Questions ✅

1. **"Show me where you defined your routes"**
   - [ ] Can navigate to `routes/` folder
   - [ ] Can explain what each route file does

2. **"How does authentication work?"**
   - [ ] Can show `middleware/auth.js`
   - [ ] Can explain JWT token flow

3. **"Show me your database schema"**
   - [ ] Can open `database/schema.sql`
   - [ ] Can explain the three tables and relationships

4. **"How do you prevent SQL injection?"**
   - [ ] Can show parameterized queries in controllers
   - [ ] Can explain prepared statements

5. **"What happens when you delete a user?"**
   - [ ] Can explain CASCADE delete
   - [ ] Can show in schema

### Have Ready ✅
- [ ] Server running locally (`npm start`)
- [ ] Postman with saved requests
- [ ] GitHub repository URL
- [ ] Render deployment URL
- [ ] Database running

---

## 📤 PHASE 6: Submission (5 minutes)

### Step 1: Fill Out SUBMISSION.txt ✅
- [ ] GitHub URL: `https://github.com/YOUR_USERNAME/studybuddy`
- [ ] Render URL: `https://studybuddy-api.onrender.com`
- [ ] Check all completed features
- [ ] Add any notes

### Step 2: Final Checks ✅
- [ ] GitHub has multiple commits (5+)
- [ ] Commit messages are descriptive
- [ ] Repository is PUBLIC
- [ ] README is complete
- [ ] `.env` is NOT in repository
- [ ] Latest code runs without errors
- [ ] Live deployment works

### Step 3: Submit ✅
- [ ] Upload `SUBMISSION.txt` to Brightspace/D2L
- [ ] Double-check GitHub URL is correct
- [ ] Ready for live demo

---

## 🎯 GRADING RUBRIC CHECKLIST

### Deployment & Integrity (10 points) ✅
- [ ] Deployed to Render (not just localhost)
- [ ] Live URL accessible
- [ ] GitHub has multiple commits
- [ ] Commits have good messages
- [ ] Git history shows development process

### Sprint Completion (40 points) ✅
- [ ] User registration works
- [ ] User login works
- [ ] Subject CRUD complete
- [ ] Session CRUD complete
- [ ] Authentication works
- [ ] All endpoints functional
- [ ] Code runs without errors

### Technical Understanding (30 points) ✅
- [ ] Can navigate own code
- [ ] Can explain routes
- [ ] Can explain authentication
- [ ] Can explain database
- [ ] Can answer technical questions

### Participation (20 points) ✅
- [ ] Attended workshop sessions
- [ ] Ready for live demo
- [ ] Can demonstrate project

---

## ⚠️ COMMON ISSUES & QUICK FIXES

### Issue: npm install fails
```bash
# Delete node_modules and try again
rm -rf node_modules
npm install
```

### Issue: Database won't connect
- [ ] MySQL server is running?
- [ ] Credentials in `.env` correct?
- [ ] Database `studybuddy` exists?

### Issue: Server won't start
- [ ] Port 5000 already in use? Change in `.env`
- [ ] All dependencies installed? Run `npm install`
- [ ] .env file exists?

### Issue: "Cannot find module"
```bash
npm install
```

### Issue: Git push rejected
```bash
git pull origin main
# Resolve conflicts if any
git push origin main
```

### Issue: Render deployment fails
- [ ] All environment variables set?
- [ ] Database schema uploaded?
- [ ] Using internal DB hostname?

---

## 📞 HELP RESOURCES

If stuck:
1. Check `SETUP.md` for detailed instructions
2. Check `API_TESTING.md` for endpoint examples
3. Check `DEPLOYMENT.md` for Render help
4. Check `TECHNICAL_DOCS.md` for architecture
5. Check `GIT_GUIDE.md` for Git help
6. Ask instructor during lab

---

## ✨ SUCCESS CRITERIA

You're ready when:
- ✅ Server runs locally
- ✅ All API endpoints work
- ✅ Database is set up correctly
- ✅ Code on GitHub with multiple commits
- ✅ Deployed to Render
- ✅ Can explain your code
- ✅ Ready to demo

---

## 🎉 YOU'RE DONE!

Time to submit and ace that demo! 🚀

**Good luck!**

---

## DEMO DAY CHECKLIST

On the day of your demo:
- [ ] Laptop charged
- [ ] Server can start quickly
- [ ] Postman ready with saved requests
- [ ] GitHub open in browser
- [ ] Render deployment open in browser
- [ ] Confident about your code
- [ ] Ready to answer questions

**Remember**: The instructor wants you to succeed! Show your work confidently. 💪
