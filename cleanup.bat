@echo off
echo Cleaning up unnecessary .md files from StudyBuddy...

cd "C:\Users\jeelp\Documents\Sem_4\Prog2500 Full Stack\Friends\Omkar\StudyBuddy"

REM Root folder cleanup
del API_TESTING.md
del DEPLOYMENT.md
del GIT_GUIDE.md
del QUICKSTART.md
del RENDER_DEPLOYMENT.md
del SETUP.md
del START_HERE.md
del TECHNICAL_DOCS.md
del TROUBLESHOOTING.md

echo Root folder cleaned.

REM Backend folder cleanup
cd backend
del DEPLOYMENT.md
del GIT_SETUP.md
del INDEX.md
del QUICKSTART.md
del SUBMISSION.md
del TESTING.md
del TROUBLESHOOTING.md

echo Backend folder cleaned.
echo.
echo Done! Only README.md files kept.
pause
