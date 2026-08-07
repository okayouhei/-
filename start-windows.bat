@echo off
setlocal
cd /d "%~dp0"
echo Instagram account link app will start at http://localhost:3000
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js 18 or later from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)
npm start
pause
