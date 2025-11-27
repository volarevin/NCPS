@echo off
title NCPS - Stopping Application
color 0C

echo ========================================
echo   Stopping NCPS Application
echo ========================================
echo.

echo Closing all Node processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   Application Stopped Successfully!
echo ========================================
echo.
pause
