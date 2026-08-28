@echo off
title Starting JanSamadhan Next.js App...
cd /d "%~dp0"

echo =========================================
echo    Starting JanSamadhan Development App
echo =========================================
echo.
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000

echo Starting Next.js development server...
echo.
npm run dev

pause
