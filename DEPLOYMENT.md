# Deployment Guide - StudyBuddy Backend

## Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- MySQL database (can use Render's managed MySQL or external service)

## Step 1: Push to GitHub

1. Initialize Git repository (if not done already):
```bash
git init
git add .
git commit -m "Initial commit: StudyBuddy backend setup"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/studybuddy.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up MySQL Database on Render

1. Go to https://render.com/dashboard
2. Click "New +" and select "MySQL"
3. Configure your database:
   - Name: `studybuddy-db`
   - Database: `studybuddy`
   - User: (auto-generated)
   - Region: Choose closest to you
4. Click "Create Database"
5. **Important:** Save the connection details (Internal Database URL)

## Step 3: Initialize Database Schema

1. Once database is created, click "Connect" 
2. Use the provided connection command or use a MySQL client
3. Run the schema.sql file:
```bash
mysql -h <hostname> -u <username> -p<password> < database/schema.sql
```

Or copy-paste the SQL from `database/schema.sql` into the web console.

## Step 4: Deploy Web Service on Render

1. Go back to Render Dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - Name: `studybuddy-api`
   - Region: Same as database
   - Branch: `main`
   - Root Directory: Leave empty
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

   **Environment Variables:**
   Click "Add Environment Variable" for each:
   
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=<your-render-mysql-host>
   DB_USER=<your-render-mysql-user>
   DB_PASSWORD=<your-render-mysql-password>
   DB_NAME=studybuddy
   JWT_SECRET=<generate-a-random-secret-key>
   ```

   **How to get database credentials:**
   - Go to your MySQL database in Render
   - Click "Info" or "Connect"
   - Copy the Internal Database URL or individual credentials
   - For DB_HOST: Use the internal hostname (ends with .render.com)

   **Generate JWT_SECRET:**
   ```bash
   # In terminal/command prompt:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. Click "Create Web Service"

## Step 5: Verify Deployment

1. Wait for the deployment to complete (3-5 minutes)
2. Once deployed, you'll see a URL like: `https://studybuddy-api.onrender.com`
3. Test the API:
   ```bash
   curl https://studybuddy-api.onrender.com
   ```
   You should see the welcome message.

4. Test user registration:
   ```bash
   curl -X POST https://studybuddy-api.onrender.com/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
   ```

## Step 6: Update README with Live URL

Update your README.md to include the live deployment URL for submission.

## Troubleshooting

### Database Connection Issues
- Verify DB_HOST uses the internal hostname (not external)
- Check that all database credentials are correct
- Ensure database is in the same region as web service

### Environment Variables
- Make sure JWT_SECRET is set
- Verify all DB_* variables match your database
- Check for typos in variable names

### Build Failures
- Check build logs in Render dashboard
- Ensure package.json has all required dependencies
- Verify Node version compatibility

### App Crashes
- Check application logs in Render dashboard
- Look for database connection errors
- Verify schema.sql was run successfully

## Alternative: Using External MySQL

If you prefer to use an external MySQL service (like PlanetScale, Railway, or AWS RDS):

1. Create database on your chosen platform
2. Run the schema.sql on that database
3. Use the connection credentials in Render's environment variables

## Free Tier Limitations

Render free tier includes:
- 750 hours/month (enough for continuous running)
- App sleeps after 15 minutes of inactivity
- Cold starts take 30-60 seconds after sleep

For production apps, consider upgrading to a paid plan.

## Monitoring Your App

- View logs: Render Dashboard → Your Service → Logs
- Check health: Visit your-app-url/
- Monitor database: Render Dashboard → MySQL Database → Metrics

## Next Steps

After successful deployment:
1. Test all API endpoints with your live URL
2. Document the live URL for your instructor
3. Continue with Sprint 2 (Frontend development)
4. You'll connect the React frontend to this deployed backend in Sprint 3

## Submission Note

For your assignment submission, include:
- GitHub repository URL
- Live deployment URL (from Render)
- Any special instructions or notes
