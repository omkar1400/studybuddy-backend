# Render Deployment Guide - StudyBuddy PostgreSQL

## ✅ Files Updated Successfully!

All your files have been converted from MySQL to PostgreSQL. Here's what was changed:

### Modified Files:
1. ✅ `package.json` - Changed mysql2 → pg
2. ✅ `config/db.js` - PostgreSQL connection with SSL
3. ✅ `database/schema.sql` - PostgreSQL syntax
4. ✅ `controllers/authController.js` - Query syntax ($1, $2, $3)
5. ✅ `controllers/subjectController.js` - Query syntax
6. ✅ `controllers/sessionController.js` - Query syntax
7. ✅ `.env` - Added DATABASE_URL

## 🚀 Next Steps to Deploy on Render

### Step 1: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - Name: `studybuddy-db`
   - Database: `studybuddy`
   - Region: Choose closest (e.g., Oregon)
   - Plan: **Free**
4. Click **"Create Database"**
5. **COPY the "Internal Database URL"** (it looks like: `postgres://user:pass@host/db`)

### Step 2: Initialize Your Database

1. In Render, go to your PostgreSQL database
2. Click **"Connect"** → **"PSQL Command"**
3. Copy and run this command in your terminal to connect:
   ```bash
   # They'll give you a command like this:
   PGPASSWORD=xxx psql -h xxx.oregon-postgres.render.com -U studybuddy_user studybuddy_db
   ```
4. Once connected, copy ALL contents from `database/schema.sql` and paste into psql
5. Verify tables created:
   ```sql
   \dt
   ```
   You should see: Users, Subjects, StudySessions

### Step 3: Push Your Code to GitHub

```bash
# In your StudyBuddy folder:
git add .
git commit -m "Convert to PostgreSQL for Render"
git push origin main
```

### Step 4: Deploy Web Service on Render

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `studybuddy-api`
   - **Region**: Same as your database (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: (leave blank - IMPORTANT!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables** - Click "Advanced":
   ```
   DATABASE_URL = [paste the Internal Database URL from Step 1]
   JWT_SECRET = [paste a random string - see below]
   NODE_ENV = production
   ```

   To generate JWT_SECRET, run in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Click **"Create Web Service"**

### Step 5: Wait for Deployment

- Render will build and deploy (takes 2-5 minutes)
- Watch the logs for any errors
- Once you see "✅ PostgreSQL Database connected successfully", you're good!

### Step 6: Test Your API

Your API will be at: `https://studybuddy-api.onrender.com`

Test it:
```bash
# Health check
curl https://studybuddy-api.onrender.com/

# Register
curl -X POST https://studybuddy-api.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST https://studybuddy-api.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## 🔧 Troubleshooting

### Build Error: "Cannot find package.json"
- **Solution**: Make sure "Root Directory" is BLANK when creating the Web Service

### Connection Error: "Database connection failed"
- **Solution**: 
  1. Use "Internal Database URL", NOT "External"
  2. Verify DATABASE_URL is set in Environment Variables
  3. Make sure database and web service are in the same region

### Error: "syntax error at or near '?'"
- **Solution**: You might have missed updating a controller file. All `?` should be `$1, $2, $3`

### App crashes immediately
- **Solution**: Check Render logs. Usually missing JWT_SECRET or DATABASE_URL

## 📝 Important Notes

1. **Free tier sleeps after 15 minutes** - First request after sleep will be slow
2. **Use Internal Database URL** for better performance
3. **Keep JWT_SECRET secure** - Never commit to GitHub
4. **.env is ignored by git** - Set variables in Render dashboard
5. **Database and app in same region** - Reduces latency

## 🎉 You're Done!

Once deployed, your API is live and ready to use!

Your endpoints:
- `POST /api/users/register` - Register
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get profile (needs auth token)
- `GET /api/subjects` - Get subjects (needs auth token)
- `POST /api/subjects` - Create subject (needs auth token)
- `GET /api/sessions` - Get sessions (needs auth token)
- `POST /api/sessions` - Create session (needs auth token)

Remember to add the token in headers for protected routes:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Good luck! 🚀
