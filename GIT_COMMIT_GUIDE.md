# Git Commit Instructions for StudyBuddy

## Step 1: Open Command Prompt or Git Bash
Navigate to your project directory:
```bash
cd "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy"
```

## Step 2: Check Git Status
See what files need to be committed:
```bash
git status
```

## Step 3: Add All Files to Staging
```bash
git add .
```

## Step 4: Commit with a Descriptive Message
```bash
git commit -m "Complete Sprint 1: Backend API with Express, MySQL, and Authentication"
```

## Step 5: Push to GitHub
If this is your first push:
```bash
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL_HERE
git push -u origin main
```

If the remote is already set up:
```bash
git push origin main
```

## Additional Commits (for better commit history)

To show regular development progress, you can make separate commits:

### Commit 1: Initial setup
```bash
git add package.json .gitignore .env.example
git commit -m "Initialize project with Node.js and dependencies"
```

### Commit 2: Database configuration
```bash
git add config/
git commit -m "Add database configuration and connection setup"
```

### Commit 3: User authentication
```bash
git add controllers/userController.js routes/users.js middleware/auth.js
git commit -m "Implement user registration and login with JWT"
```

### Commit 4: Subjects CRUD
```bash
git add controllers/subjectController.js routes/subjects.js
git commit -m "Add CRUD operations for subjects"
```

### Commit 5: Study Sessions CRUD
```bash
git add controllers/sessionController.js routes/sessions.js
git commit -m "Implement study sessions management"
```

### Commit 6: Server and final touches
```bash
git add server.js README.md
git commit -m "Complete server setup and documentation"
```

### Push all commits
```bash
git push origin main
```

## Verify Your Repository
After pushing, visit your GitHub repository URL to verify all files are uploaded.

## Common Issues and Solutions

### If you get "remote already exists":
```bash
git remote remove origin
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### If you need to create a new GitHub repository:
1. Go to github.com
2. Click "New repository"
3. Name it "StudyBuddy"
4. Do NOT initialize with README
5. Copy the repository URL
6. Use it in the commands above

### If you get authentication errors:
- Use a Personal Access Token instead of password
- Or use GitHub Desktop application for easier authentication
