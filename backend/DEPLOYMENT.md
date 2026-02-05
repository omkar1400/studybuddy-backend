# Deployment Guide - Render.com

## Prerequisites
- GitHub account
- Render.com account (free tier available)
- Code pushed to GitHub

---

## Part 1: Create PostgreSQL Database

### Step 1: Create Database
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `studybuddy-db`
   - **Database:** `studybuddy`
   - **User:** (auto-generated)
   - **Region:** Select closest region
   - **PostgreSQL Version:** 16 (latest)
   - **Datadog API Key:** Leave empty
   - **Plan:** Free
4. Click **"Create Database"**
5. Wait for database to provision (2-3 minutes)

### Step 2: Get Database Connection Details
1. On the database page, find **"Connections"** section
2. Copy **"Internal Database URL"** 
   - Format: `postgresql://user:password@host/database`
   - Example: `postgresql://studybuddy_user:abc123@dpg-xyz.oregon-postgres.render.com/studybuddy`
3. **SAVE THIS URL** - you'll need it for the web service!

---

## Part 2: Deploy Backend API

### Step 1: Push Code to GitHub

```bash
cd backend

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - StudyBuddy Backend API with PostgreSQL"

# Create GitHub repository (go to github.com and create new repo)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/studybuddy-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** → Connect GitHub
4. Find and select your `studybuddy-backend` repository
5. Click **"Connect"**

### Step 3: Configure Web Service

**Basic Settings:**
- **Name:** `studybuddy-api`
- **Region:** Same as your database
- **Branch:** `main`
- **Root Directory:** (leave empty if backend is at root, or enter `backend` if in subfolder)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **"Free"** plan

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
NODE_ENV=production
DATABASE_URL=<PASTE_YOUR_INTERNAL_DATABASE_URL_HERE>
JWT_SECRET=your-super-secret-random-string-change-this
JWT_EXPIRE=7d
CLIENT_URL=*
```

**Important:** 
- Replace `DATABASE_URL` with the URL you copied from Step 2
- Replace `JWT_SECRET` with a random secret (you can generate one at https://randomkeygen.com/)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the logs - you should see:
   ```
   ==> Starting service...
   ==> Installing dependencies...
   ==> Starting application...
   🚀 Server is running on port 10000
   ✅ Connected to PostgreSQL database
   ```

### Step 6: Initialize Database Tables

Once deployed:

1. Go to your web service page
2. Click **"Shell"** tab
3. Run this command:
   ```bash
   npm run init-db
   ```
4. You should see:
   ```
   ✅ Users table created
   ✅ Subjects table created
   ✅ StudySessions table created
   ✅ Indexes created
   🎉 Database initialization completed successfully!
   ```

---

## Part 3: Test Your Deployed API

Your API will be live at: `https://studybuddy-api.onrender.com`

### Test with cURL:

```bash
# Health check
curl https://studybuddy-api.onrender.com/health

# Register a user
curl -X POST https://studybuddy-api.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST https://studybuddy-api.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Part 4: Common Issues & Solutions

### Issue 1: "Application failed to respond"
**Solution:** Check logs for errors. Common causes:
- Missing environment variables
- Database connection failed
- Port configuration issue

### Issue 2: Database connection timeout
**Solution:** 
- Ensure you're using the **Internal Database URL** (not External)
- Check that web service and database are in the same region

### Issue 3: "Cannot find module"
**Solution:**
- Ensure `package.json` is in the root directory
- Check build command is `npm install`
- Clear build cache and redeploy

### Issue 4: Tables not created
**Solution:**
- Run `npm run init-db` in the Shell tab
- Check database logs for errors

---

## Part 5: Update Deployment (Future Changes)

Every time you push to GitHub:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Render will **automatically redeploy** your service!

---

## Part 6: Monitor Your Application

### View Logs
- Go to your web service → **"Logs"** tab
- Watch for errors or issues

### Check Database
- Go to your database → **"Metrics"** tab
- Monitor connections and storage

### Test Endpoints
- Use Postman or cURL to test all endpoints
- Check response times and error rates

---

## Part 7: Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (sufficient for development)
- ✅ Automatic sleep after 15 min inactivity
- ✅ Wakes up on request (may take 30-60 seconds)
- ❌ Database expires after 90 days (upgrade for persistence)

**For Production:**
- Consider upgrading to Starter plan ($7/month)
- Keeps service always active
- Better performance

---

## Checklist for Sprint 1 Submission

Before submitting:

- [ ] Backend deployed to Render
- [ ] Database tables initialized
- [ ] All API endpoints working
- [ ] Health check returns success
- [ ] Can register and login users
- [ ] Can create subjects and sessions
- [ ] README.md has deployment URL
- [ ] Git history shows regular commits
- [ ] Code pushed to GitHub
- [ ] Ready to demo in class

---

## Your Live API URL

After deployment, your API will be at:

```
https://studybuddy-api.onrender.com
```

Test it:
```bash
curl https://studybuddy-api.onrender.com/health
```

You should get:
```json
{
  "success": true,
  "message": "Server and database are healthy",
  "timestamp": "2026-02-04T..."
}
```

---

## Need Help?

If you encounter issues:
1. Check Render logs for error messages
2. Verify all environment variables are set
3. Test locally first with PostgreSQL
4. Contact instructor during lab hours

---

**🎉 Congratulations! Your backend is now live on Render!**
