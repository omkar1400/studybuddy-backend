# Git Setup and Deployment Checklist

## Step 1: Initialize Git Repository

```bash
# Navigate to backend folder
cd "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy\backend"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: StudyBuddy Backend with PostgreSQL"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `studybuddy-backend`
4. Description: "StudyBuddy API - Backend for study session planner (PROG2500)"
5. Select **Public**
6. **DO NOT** check any boxes (README, .gitignore, license)
7. Click **"Create repository"**

## Step 3: Connect Local Repo to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/studybuddy-backend.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Verify Push

1. Refresh your GitHub repository page
2. You should see all files:
   - config/
   - controllers/
   - middleware/
   - routes/
   - package.json
   - server.js
   - README.md
   - etc.

## Step 5: Make Regular Commits (IMPORTANT!)

Throughout development, make regular commits to show progress:

```bash
# After adding a feature
git add .
git commit -m "Add user authentication endpoints"
git push

# After fixing a bug
git add .
git commit -m "Fix subject deletion cascade issue"
git push

# After adding documentation
git add .
git commit -m "Add API documentation and testing guide"
git push
```

**Good commit messages:**
- ✅ "Add user registration and login endpoints"
- ✅ "Implement subject CRUD operations"
- ✅ "Configure PostgreSQL connection for Render"
- ✅ "Add JWT authentication middleware"
- ✅ "Create study sessions controller with validation"

**Bad commit messages:**
- ❌ "Update"
- ❌ "Fix stuff"
- ❌ "Changes"

## Step 6: Deploy to Render (After Git Setup)

Once code is on GitHub, follow the deployment guide:
1. Create PostgreSQL database on Render
2. Create Web Service connected to your GitHub repo
3. Add environment variables
4. Deploy and initialize database

## Recommended Commit Schedule

**Day 1:**
- [ ] Initial project setup
- [ ] Database configuration
- [ ] Basic Express server

**Day 2:**
- [ ] User authentication endpoints
- [ ] Subject CRUD operations
- [ ] Database initialization script

**Day 3:**
- [ ] Study sessions CRUD operations
- [ ] Authentication middleware
- [ ] Error handling

**Day 4:**
- [ ] Testing and bug fixes
- [ ] Documentation
- [ ] Deployment preparation

## Git Commands Cheat Sheet

```bash
# Check status
git status

# View commit history
git log --oneline

# View changes before committing
git diff

# Undo changes to a file (before commit)
git checkout -- filename

# View remote repository
git remote -v

# Pull latest changes (if working with others)
git pull origin main

# Create a new branch (for experiments)
git checkout -b feature-name
```

## Common Git Issues & Solutions

### Issue: "Permission denied (publickey)"
**Solution:**
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/studybuddy-backend.git
```

### Issue: "Updates were rejected"
**Solution:**
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Issue: Accidentally committed .env file
**Solution:**
```bash
# Remove from git but keep locally
git rm --cached .env
git commit -m "Remove .env from version control"
git push
```

## Pre-Submission Checklist

Before submitting Sprint 1:

- [ ] Code is pushed to GitHub
- [ ] At least 10+ meaningful commits
- [ ] Commit messages are descriptive
- [ ] .env file is NOT in repository
- [ ] README.md is complete with deployment URL
- [ ] All code is tested and working
- [ ] Deployed to Render successfully
- [ ] Database is initialized
- [ ] Can access API endpoints

## Final Check

Run these commands to verify everything:

```bash
# Check if everything is committed
git status
# Should say: "nothing to commit, working tree clean"

# Check commit history
git log --oneline
# Should show multiple commits with good messages

# Verify remote is set
git remote -v
# Should show your GitHub repository URL

# Test one more push
git push origin main
# Should say: "Everything up-to-date"
```

## Submission Format

Create a text file: `sprint1-submission.txt`

```
Student: Omkar Singh
Student ID: 8781929
Course: PROG2500 - Full Stack Development

GitHub Repository: https://github.com/YOUR_USERNAME/studybuddy-backend
Live API URL: https://studybuddy-api.onrender.com

All requirements completed and tested.
Ready for live code review.
```

Upload this file to the submission folder on D2L.

---

**Remember:** The rubric checks for "healthy history of regular commits" - don't wait until the last day to commit everything!

Good luck with your Sprint 1 submission! 🚀
