@echo off
title Financia Fullstack Dev

echo Starting backend...
start cmd /k "cd backend && npm install && node server.js"

timeout /t 2

echo Starting frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo Both frontend and backend started!
pause
