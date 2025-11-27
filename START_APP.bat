@echo off
title NCPS - Starting Application
color 0A

echo ========================================
echo   Starting NCPS Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "NCPS Backend" cmd /k "cd system\server && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend...
start "NCPS Frontend" cmd /k "cd system\main && npm run dev"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend:  Running on http://localhost:5000
echo Frontend: Running on http://localhost:5173
echo.
echo Press any key to exit this window...
echo (The application windows will remain open)
pause >nul
