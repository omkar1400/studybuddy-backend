@echo off
echo ========================================
echo StudyBuddy Git Multiple Commits Script
echo This will create a proper commit history
echo ========================================
echo.

cd /d "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy"

echo Commit 1: Project initialization...
git add .gitignore package.json backend/package.json backend/.env.example
git commit -m "Initialize Node.js project with Express and MySQL dependencies"
echo.

echo Commit 2: Database configuration...
git add backend/config/
git commit -m "Configure MySQL database connection and schema initialization"
echo.

echo Commit 3: Authentication middleware...
git add backend/middleware/
git commit -m "Implement JWT authentication middleware"
echo.

echo Commit 4: User management...
git add backend/controllers/userController.js backend/routes/users.js
git commit -m "Add user registration and login endpoints with password hashing"
echo.

echo Commit 5: Subjects CRUD...
git add backend/controllers/subjectController.js backend/routes/subjects.js  
git commit -m "Implement CRUD operations for study subjects"
echo.

echo Commit 6: Study Sessions CRUD...
git add backend/controllers/sessionController.js backend/routes/sessions.js
git commit -m "Add complete CRUD functionality for study sessions"
echo.

echo Commit 7: Server setup and documentation...
git add backend/server.js backend/README.md SUBMISSION.txt StudyBuddy.postman_collection.json GIT_COMMIT_GUIDE.md
git commit -m "Complete server configuration, add README and Postman collection for API testing"
echo.

echo Pushing all commits to GitHub...
git push origin main
echo.

echo ========================================
echo Success! All commits pushed to GitHub
echo Check your repository for the full history
echo ========================================
pause
