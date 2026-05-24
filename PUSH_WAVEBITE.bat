@echo off
REM ===========================================================
REM  PUSH V21.3 zu wave-bite-ceo-office (add + commit + push)
REM ===========================================================
setlocal enableextensions
set "REPO_DIR=%~dp0"
set "LIVE_URL=https://voigtcarsten4-rgb.github.io/wave-bite-ceo-office/"
set "BRANCH=main"
title PUSH V21.3 - wave-bite-ceo-office
cd /d "%REPO_DIR%"

echo.
echo +---------------------------------------------------------+
echo ^|  PUSH V21.3 NAV-FIX zu wave-bite-ceo-office             ^|
echo +---------------------------------------------------------+
echo.

echo [0/5] Lock-Cleanup...
if exist ".git\index.lock" del /f ".git\index.lock" 2>nul
if exist ".git\HEAD.lock"  del /f ".git\HEAD.lock"  2>nul
if exist ".git\config.lock" del /f ".git\config.lock" 2>nul
echo.

REM Sicherstellen dass remote wavebite existiert
git remote remove wavebite 2>nul
git remote add wavebite https://github.com/voigtcarsten4-rgb/wave-bite-ceo-office.git

echo [1/5] git add ALL...
git add index.html samantha.js marketing-dashboard-detail.html wave-bite-asset-library.json PUSH_WAVEBITE.bat PUSH_V21_LUCY.bat PUSH_V21_LUCY.ps1 PUSH_NOW.bat LIVE_TEST_V21.ps1 BACKUPS
echo.

echo [2/5] git commit...
git commit -m "V21.3 Nav-Fix: flex-wrap + alle 22 Pills sichtbar + klickbar, v20-cta-bar deaktiviert, injectNavPills disabled"
echo.

echo [3/5] Push origin/%BRANCH%...
git push origin HEAD:%BRANCH%
echo.

echo [4/5] Push wavebite/%BRANCH% --force...
git push wavebite HEAD:%BRANCH% --force
if errorlevel 1 (
  echo [X] Push fehlgeschlagen
  pause
  exit /b 1
)
echo [OK] Push zu wave-bite-ceo-office erfolgreich.
echo.

echo [5/5] Warte 75 s + oeffne Live-URL...
timeout /t 75 /nobreak >nul
start "" "%LIVE_URL%"
echo.

echo Office: %LIVE_URL%
echo.
pause
endlocal
