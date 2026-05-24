@echo off
setlocal enableextensions
set "REPO_DIR=%~dp0"
set "LIVE_URL=https://voigtcarsten4-rgb.github.io/wave-bite-ceo-office/"
set "BRANCH=main"
title PUSH V21.3 - wave-bite-ceo-office
cd /d "%REPO_DIR%"

echo.
echo +---------------------------------------------------------+
echo ^|  PUSH V21.3 zu wave-bite-ceo-office                     ^|
echo +---------------------------------------------------------+
echo.

if exist ".git\index.lock" del /f ".git\index.lock" 2>nul
if exist ".git\HEAD.lock"  del /f ".git\HEAD.lock"  2>nul
if exist ".git\config.lock" del /f ".git\config.lock" 2>nul

git remote remove wavebite 2>nul
git remote add wavebite https://github.com/voigtcarsten4-rgb/wave-bite-ceo-office.git

echo [1/6] git update-index (force re-check timestamps)...
git update-index --really-refresh 2>nul
git update-index --refresh
echo.

echo [2/6] git diff (was ist anders)...
git diff --stat HEAD -- index.html samantha.js marketing-dashboard-detail.html wave-bite-asset-library.json
echo.

echo [3/6] git add -A (alle Aenderungen!)...
git add -A
echo.

echo [4/6] git commit...
git commit -m "V21.3.1 Nav-Fix: scrollTo statt scrollIntoView (Bug-Fix), html scroll-behavior smooth"
echo.

echo [5/6] Push origin/%BRANCH%...
git push origin HEAD:%BRANCH%
echo.

echo [6/6] Push wavebite/%BRANCH% --force...
git push wavebite HEAD:%BRANCH% --force
if errorlevel 1 (echo [X] Push fehlgeschlagen & pause & exit /b 1)
echo [OK] Push erfolgreich.
echo.

echo Warte 75 s + oeffne Live-URL...
timeout /t 75 /nobreak >nul
start "" "%LIVE_URL%?cb=v213fix"
echo.
echo Office: %LIVE_URL%
pause
endlocal
