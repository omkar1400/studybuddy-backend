# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## 1. npm install Issues

### Error: "npm: command not found"
**Problem:** Node.js is not installed or not in PATH

**Solution:**
1. Download Node.js from https://nodejs.org/ (LTS version)
2. Install with default settings
3. Restart terminal/PowerShell
4. Verify: `node --version` should show v18.x.x or higher

### Error: "Cannot find module"
**Problem:** Dependencies not installed properly

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 2. PostgreSQL Connection Issues

### Error: "password authentication failed"
**Problem:** Wrong password in .env file

**Solution:**
1. Open `.env`
2. Update `DB_PASSWORD=your_correct_password`
3. Restart server: `npm run dev`

### Error: "database 'studybuddy' does not exist"
**Problem:** Database not created

**Solution:**
```bash
# Windows - Open Command Prompt
psql -U postgres
CREATE DATABASE studybuddy;
\q
```

### Error: "ECONNREFUSED ::1:5432"
**Problem:** PostgreSQL is not running

**Solution:**
```bash
# Windows - Start PostgreSQL service
# Open Services app (Win + R, type 'services.msc')
# Find 'postgresql-x64-16' 
# Right-click → Start

# Or use command line:
pg_ctl start -D "C:\Program Files\PostgreSQL\16\data"
```

### Error: "role 'postgres' does not exist"
**Problem:** PostgreSQL user not set up correctly

**Solution:**
```bash
# Create postgres user
createuser -s postgres
```

---

## 3. Server Start Issues

### Error: "Port 5000 already in use"
**Problem:** Another application is using port 5000

**Solution:**

**Option 1:** Kill the process using port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

**Option 2:** Use a different port
```bash
# Edit .env
PORT=5001

# Restart server
npm run dev
```

### Error: "Cannot find module './config/db'"
**Problem:** Wrong directory or file path issues

**Solution:**
```bash
# Make sure you're in the backend directory
cd backend

# Verify file exists
dir config\db.js

# Try running again
npm run dev
```

---

## 4. Database Initialization Issues

### Error: "relation 'users' already exists"
**Problem:** Tables already created, trying to create again

**Solution:**
This is actually OK! It means tables exist. But if you want to start fresh:

```bash
# Connect to database
psql -U postgres -d studybuddy

# Drop all tables
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
\q

# Reinitialize
npm run init-db
```

### Error: "Cannot read property 'rows' of undefined"
**Problem:** Database query failed

**Solution:**
1. Check database connection is working
2. Verify `.env` has correct credentials
3. Check PostgreSQL is running
4. Look at server logs for more details

---

## 5. API Testing Issues

### Error: "401 Unauthorized"
**Problem:** Missing or invalid JWT token

**Solution:**
```bash
# 1. Login first to get token
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 2. Copy the token from response
# 3. Use it in Authorization header
curl -X GET http://localhost:5000/api/subjects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Error: "404 Not Found"
**Problem:** Wrong URL or route doesn't exist

**Solution:**
Double-check your URL:
- ✅ Correct: `http://localhost:5000/api/users/login`
- ❌ Wrong: `http://localhost:5000/users/login` (missing /api)
- ❌ Wrong: `http://localhost:5000/api/user/login` (user vs users)

### Error: "500 Internal Server Error"
**Problem:** Server-side error

**Solution:**
1. Check server terminal for error details
2. Common causes:
   - Database connection lost
   - Invalid data sent in request
   - Missing required fields
3. Look at the error message in server logs

---

## 6. Git Issues

### Error: "fatal: not a git repository"
**Problem:** Git not initialized

**Solution:**
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
```

### Error: "Permission denied (publickey)"
**Problem:** SSH key not set up

**Solution:**
Use HTTPS instead:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/studybuddy-backend.git
git push -u origin main
```

### Error: "Updates were rejected"
**Problem:** Remote has changes you don't have locally

**Solution:**
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Please tell me who you are"
**Problem:** Git identity not configured

**Solution:**
```bash
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

---

## 7. Render Deployment Issues

### Error: "Build failed"
**Problem:** npm install failed on Render

**Solution:**
1. Check `package.json` is in root directory
2. Verify build command is `npm install`
3. Check Render logs for specific error
4. Common fix: Clear build cache in Render settings

### Error: "Application failed to respond"
**Problem:** Server not starting on Render

**Solution:**
1. Check environment variables are set:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
2. Verify start command is `npm start` (not `npm run dev`)
3. Check Render logs for errors
4. Make sure `PORT` is read from environment: `process.env.PORT`

### Error: "Connection timeout" when accessing API
**Problem:** Database connection failed

**Solution:**
1. Use **Internal Database URL** (not External)
2. Ensure SSL is enabled in db.js:
   ```javascript
   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
   ```
3. Check database and web service are in same region

### Error: "Relation does not exist"
**Problem:** Database tables not created

**Solution:**
1. Go to your Render web service
2. Click "Shell" tab
3. Run: `npm run init-db`
4. Wait for success message

---

## 8. JWT/Authentication Issues

### Error: "Token is not valid"
**Problem:** Expired or malformed token

**Solution:**
1. Login again to get fresh token
2. Make sure you're copying the full token
3. Check JWT_SECRET is the same in .env and production

### Error: "User not found"
**Problem:** User doesn't exist or wrong user ID

**Solution:**
1. Verify user exists: Login first
2. Check token is valid
3. Make sure you're logged in as the right user

---

## 9. CORS Issues

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Problem:** Frontend can't access backend

**Solution:**
Already handled in code, but if you see this:
1. Check CORS is enabled in server.js
2. Verify `CLIENT_URL` in .env
3. For development, can use `CLIENT_URL=*`

---

## 10. Data Validation Issues

### Error: "Please provide all required fields"
**Problem:** Missing required data in request

**Solution:**
Check your request includes all required fields:

**Register:**
```json
{
  "name": "required",
  "email": "required",
  "password": "required"
}
```

**Create Subject:**
```json
{
  "name": "required",
  "description": "optional"
}
```

**Create Session:**
```json
{
  "subject_id": "required",
  "title": "required",
  "start_time": "required",
  "end_time": "required",
  "status": "optional"
}
```

---

## Debugging Tips

### 1. Check Server Logs
Always look at terminal where server is running for error details

### 2. Test Database Connection
```bash
psql -U postgres -d studybuddy -c "SELECT NOW();"
```

### 3. Test Individual Endpoints
Use curl or Postman to test one endpoint at a time

### 4. Verify Environment Variables
```bash
# Windows PowerShell
echo $env:NODE_ENV

# Or check in code
console.log(process.env.DATABASE_URL);
```

### 5. Check File Paths
Make sure all files are in the right directories

### 6. Restart Everything
When in doubt:
```bash
# Stop server (Ctrl+C)
# Restart PostgreSQL
# Clear cache
npm cache clean --force
# Reinstall
npm install
# Restart server
npm run dev
```

---

## Still Having Issues?

### Before Asking for Help:

1. ✅ Read the error message carefully
2. ✅ Check this troubleshooting guide
3. ✅ Look at server logs for details
4. ✅ Try the suggested solutions
5. ✅ Search the error on Google/Stack Overflow

### When Asking for Help:

Provide:
1. Exact error message (copy/paste)
2. What you were trying to do
3. What you've already tried
4. Screenshots if relevant
5. Your code (if asking about specific function)

### Getting Help:

- **In Class:** Ask instructor during lab hours
- **Email:** Include error details and screenshots
- **Stack Overflow:** Search or ask new question
- **Render Docs:** https://render.com/docs

---

## Prevention Tips

### To Avoid Issues:

1. ✅ Always check logs when something fails
2. ✅ Test locally before deploying
3. ✅ Keep .env file updated
4. ✅ Make regular git commits
5. ✅ Read error messages carefully
6. ✅ Don't copy/paste code without understanding
7. ✅ Use the exact file structure provided
8. ✅ Follow guides step by step

### Backup Plan:

```bash
# If everything breaks, start fresh:

# 1. Save your .env file somewhere safe
# 2. Delete backend folder
# 3. Re-create from instructions
# 4. Copy back your .env
# 5. npm install
# 6. npm run init-db
# 7. npm run dev
```

---

## Quick Diagnostic Checklist

Run through this when something's wrong:

```bash
# 1. Is Node.js installed?
node --version
# Should show: v18.x.x or higher

# 2. Is PostgreSQL running?
psql -U postgres -c "SELECT 1;"
# Should show: (1 row)

# 3. Does database exist?
psql -U postgres -c "\l" | findstr studybuddy
# Should show: studybuddy

# 4. Are dependencies installed?
dir node_modules
# Should show many folders

# 5. Is .env configured?
type .env
# Should show your settings

# 6. Can server start?
npm run dev
# Should show: Server is running

# 7. Is git set up?
git status
# Should NOT say: fatal: not a git repository

# 8. Is code on GitHub?
git remote -v
# Should show: origin https://github.com/...
```

If all these pass, your environment is set up correctly!

---

**Remember:** Most issues are simple configuration problems. Take your time, read error messages, and follow the guides step by step.

Good luck! 🚀
