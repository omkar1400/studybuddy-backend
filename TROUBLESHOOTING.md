# Troubleshooting Guide - StudyBuddy Backend

## Quick Diagnostics

### Is Everything Working?
Run this checklist to verify your setup:

```bash
# 1. Check Node.js
node --version
# Should show: v18.x.x or higher

# 2. Check npm
npm --version
# Should show: 9.x.x or higher

# 3. Check MySQL
mysql --version
# Should show MySQL version

# 4. Check if dependencies installed
ls node_modules
# Should show many folders

# 5. Check if .env exists
ls -la | grep .env
# Should show .env file (not just .env.example)

# 6. Try starting server
npm start
# Should connect to database and start server
```

---

## Common Errors & Solutions

### Error 1: "Cannot find module 'express'"

**Symptom:**
```
Error: Cannot find module 'express'
```

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

**Why it works:** Installs all packages listed in package.json

---

### Error 2: "Database connection failed"

**Symptom:**
```
❌ Database connection failed: ER_ACCESS_DENIED_ERROR
```

**Possible Causes:**
1. Wrong database credentials
2. MySQL server not running
3. Database doesn't exist

**Solutions:**

**Check 1: Verify MySQL is Running**
```bash
# Windows (if using XAMPP)
# Start XAMPP Control Panel and start MySQL

# Or check if MySQL process is running
tasklist | findstr mysql
```

**Check 2: Verify Database Credentials**
```bash
# Open .env file and verify:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password  # NOT "your_password_here"
DB_NAME=studybuddy
```

**Check 3: Test Database Connection**
```bash
# Try connecting with MySQL CLI
mysql -u root -p

# If that works, create database:
CREATE DATABASE IF NOT EXISTS studybuddy;
USE studybuddy;
SHOW TABLES;
```

**Check 4: Run Schema**
```bash
mysql -u root -p studybuddy < database/schema.sql
```

---

### Error 3: "EADDRINUSE: Port 5000 already in use"

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Cause:** Another application is using port 5000

**Solution 1: Change Port**
Edit `.env`:
```env
PORT=3000  # Or any other available port
```

**Solution 2: Kill Process Using Port**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

### Error 4: "JWT_SECRET is not defined"

**Symptom:**
```
TypeError: Cannot read property 'JWT_SECRET' of undefined
```

**Cause:** Missing or incorrect .env file

**Solution:**
```bash
# 1. Make sure .env file exists (not just .env.example)
ls .env

# 2. Check .env content
cat .env

# 3. Ensure JWT_SECRET is set
JWT_SECRET=my_super_secret_key_12345

# 4. Restart server
npm start
```

---

### Error 5: "Token is not valid"

**Symptom:**
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

**Possible Causes:**
1. Token not sent in header
2. Wrong header format
3. Token expired
4. JWT_SECRET changed

**Solutions:**

**Check 1: Verify Header Format**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                ↑
            Must have "Bearer " prefix
```

**Check 2: Get Fresh Token**
- Login again to get a new token
- Tokens expire after 7 days

**Check 3: Copy Token Correctly**
- Include entire token
- No spaces before/after
- No quotes around token

---

### Error 6: "Access denied for user"

**Symptom:**
```
Error: Access denied for user 'root'@'localhost'
```

**Cause:** Wrong MySQL password

**Solution:**
```bash
# Reset MySQL root password

# Method 1: Using MySQL Workbench
# Open Workbench → Server → Users and Privileges → Change password

# Method 2: Using Command Line
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;

# Then update .env with new password
```

---

### Error 7: "Table doesn't exist"

**Symptom:**
```
Error: Table 'studybuddy.Users' doesn't exist
```

**Cause:** Database schema not created

**Solution:**
```bash
# Navigate to project directory
cd C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy

# Run schema
mysql -u root -p studybuddy < database/schema.sql

# Or manually:
mysql -u root -p
USE studybuddy;
source database/schema.sql;
```

---

### Error 8: "Cannot POST /api/users/register"

**Symptom:**
```json
{
  "success": false,
  "message": "Route not found"
}
```

**Possible Causes:**
1. Server not running
2. Wrong URL
3. Wrong HTTP method

**Solutions:**

**Check 1: Server Running?**
```bash
npm start
# Should see: Server is running on port 5000
```

**Check 2: Correct URL?**
```
✅ http://localhost:5000/api/users/register
❌ http://localhost:5000/users/register (missing /api)
❌ http://localhost:3000/api/users/register (wrong port)
```

**Check 3: Correct Method?**
```
✅ POST /api/users/register
❌ GET /api/users/register
```

---

### Error 9: "Unexpected end of JSON input"

**Symptom:**
```
SyntaxError: Unexpected end of JSON input
```

**Cause:** Malformed JSON in request body

**Solution:**
```javascript
// ❌ BAD (missing quotes, trailing comma)
{
  name: John,
  email: "john@test.com",
}

// ✅ GOOD
{
  "name": "John",
  "email": "john@test.com"
}
```

---

### Error 10: "Cannot read property 'id' of undefined"

**Symptom:**
```
TypeError: Cannot read property 'id' of undefined
```

**Cause:** User not authenticated (missing middleware)

**Solution:**
Check that route has `auth` middleware:
```javascript
// ❌ BAD - No auth
router.get('/subjects', subjectController.getAllSubjects);

// ✅ GOOD - With auth
router.get('/subjects', auth, subjectController.getAllSubjects);
```

---

## Git & GitHub Issues

### Issue: "Permission denied (publickey)"

**Symptom:**
```
git@github.com: Permission denied (publickey).
```

**Solution:**
Use HTTPS instead of SSH:
```bash
# Instead of:
git remote add origin git@github.com:username/repo.git

# Use:
git remote add origin https://github.com/username/repo.git
```

---

### Issue: "Repository not found"

**Symptom:**
```
fatal: repository 'https://github.com/username/repo.git/' not found
```

**Solutions:**
1. Check repository name is correct
2. Check repository is public
3. Check you're logged into correct GitHub account

---

### Issue: "Git push rejected"

**Symptom:**
```
! [rejected]        main -> main (fetch first)
```

**Solution:**
```bash
git pull origin main
# Resolve any conflicts
git push origin main
```

---

## Render Deployment Issues

### Issue: "Build failed"

**Check Build Logs:**
1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. Look for error messages

**Common Causes:**
- Missing dependencies in package.json
- Wrong Node version
- Build command incorrect

**Solution:**
```json
// In package.json, ensure:
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

---

### Issue: "Application failed to start"

**Check Application Logs:**
Look for:
- Database connection errors
- Missing environment variables
- Port binding issues

**Common Solutions:**

**1. Environment Variables:**
- Check all DB_* variables are set
- Use INTERNAL database URL (not external)
- JWT_SECRET is set

**2. Database Connection:**
```
DB_HOST should be: dpg-xxx.oregon-postgres.render.com
NOT: localhost
```

---

### Issue: "502 Bad Gateway"

**Causes:**
1. App crashed after starting
2. Database connection failed
3. Port configuration wrong

**Solutions:**
1. Check logs for errors
2. Verify database credentials
3. Don't set PORT in environment (Render sets this)

---

### Issue: "Database connection timeout"

**Solution:**
Use internal database hostname:
```env
# ✅ GOOD (from Render MySQL info)
DB_HOST=dpg-xxx.oregon-postgres.render.com

# ❌ BAD
DB_HOST=localhost
DB_HOST=127.0.0.1
```

---

## Testing Issues

### Issue: Postman shows "Could not get response"

**Checks:**
1. Server running?
2. Correct URL?
3. Firewall blocking?

**Solution:**
```bash
# Test with curl first
curl http://localhost:5000
# Should get response

# If curl works but Postman doesn't:
# - Disable Postman proxy
# - Check Postman SSL settings
# - Restart Postman
```

---

### Issue: "CORS error in browser"

**Symptom:**
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Cause:** CORS not enabled (but it should be in server.js)

**Solution:**
Check server.js has:
```javascript
const cors = require('cors');
app.use(cors());
```

---

## Development Workflow Issues

### Issue: Changes not reflecting

**Cause:** Server not restarted

**Solution:**
```bash
# If using npm start:
# Stop server (Ctrl+C)
npm start

# Or use nodemon (auto-restart):
npm run dev
```

---

### Issue: "nodemon: command not found"

**Cause:** nodemon not installed

**Solution:**
```bash
npm install nodemon --save-dev
```

---

## Getting Help

If none of these solutions work:

1. **Check the logs:**
   - Terminal output
   - Render logs
   - MySQL error log

2. **Verify basics:**
   - Did you run `npm install`?
   - Does `.env` file exist?
   - Is MySQL running?
   - Did you run the schema?

3. **Search the error:**
   - Copy exact error message
   - Search on Google
   - Check Stack Overflow

4. **Ask for help:**
   - Instructor during lab
   - Classmates
   - Include error message and what you've tried

5. **Document files:**
   - README.md
   - SETUP.md
   - API_TESTING.md
   - DEPLOYMENT.md

---

## Emergency Recovery

### Starting Fresh (Local)

```bash
# 1. Delete node_modules
rm -rf node_modules

# 2. Delete package-lock.json
rm package-lock.json

# 3. Reinstall
npm install

# 4. Recreate .env
cp .env.example .env
# Edit .env with your credentials

# 5. Drop and recreate database
mysql -u root -p
DROP DATABASE IF EXISTS studybuddy;
CREATE DATABASE studybuddy;
exit

# 6. Run schema
mysql -u root -p studybuddy < database/schema.sql

# 7. Restart server
npm start
```

---

### Starting Fresh (Render)

1. Delete web service
2. Delete database
3. Create new database
4. Run schema on new database
5. Create new web service
6. Set all environment variables
7. Deploy

---

## Prevention Tips

1. **Commit Often:** Save your work with Git
2. **Test Locally First:** Before deploying
3. **Keep .env Backup:** But NOT in Git
4. **Document Changes:** Comment your code
5. **Read Error Messages:** They often tell you what's wrong
6. **Check Examples:** Refer to API_TESTING.md
7. **Ask Early:** Don't wait until the last minute

---

## Still Stuck?

Create an issue report with:
```
1. What were you trying to do?
2. What command did you run?
3. What error did you get? (exact message)
4. What have you tried?
5. Screenshots if relevant
```

Good luck! 🍀
