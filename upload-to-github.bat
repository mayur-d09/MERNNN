@echo off
echo 🅿️ Smart Parking System - GitHub Upload
echo =====================================
echo.

echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Creating commit...
git commit -m "🅿️ Smart Urban Parking Management System - MERN Stack"

echo Setting main branch...
git branch -M main

echo.
echo ⚠️  IMPORTANT: Replace YOUR_USERNAME with your actual GitHub username!
echo.
set /p username="Enter your GitHub username: "

echo Adding remote origin...
git remote add origin https://github.com/%username%/smart-parking-system-mern.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Upload complete!
echo.
echo Your repository URL: https://github.com/%username%/smart-parking-system-mern
echo.
echo Next steps:
echo 1. Go to vercel.com to deploy frontend
echo 2. Go to railway.app to deploy backend  
echo 3. Set up MongoDB Atlas for database
echo.
pause