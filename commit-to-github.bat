@echo off
echo ========================================
echo StudyBuddy Git Commit Script
echo ========================================
echo.

cd /d "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy"

echo Checking git status...
git status
echo.

echo Adding all files...
git add .
echo.

echo Committing changes...
git commit -m "Sprint 1 Complete: Backend API with Express, MySQL, JWT Authentication, and full CRUD operations for Users, Subjects, and Study Sessions"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo Done! Check your GitHub repository.
echo ========================================
pause
