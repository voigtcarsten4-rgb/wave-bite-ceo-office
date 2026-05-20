@echo off
chcp 65001 >nul
title CEO Office — Push Mobile Fix + JARVIS Intel
cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo === CEO OFFICE: PUSH MOBILE ANIMATION + JARVIS KALENDER ===
echo.

rem Remove git lock if exists
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo Lock entfernt.
)
if exist ".git\HEAD.lock" (
    del /f ".git\HEAD.lock"
    echo HEAD.lock entfernt.
)

rem Git identity
git config user.email "voigtcarsten4@gmail.com"
git config user.name "Carsten Voigt"

rem Reset staged deletions
git reset HEAD -- .

rem Stage the updated dashboard
git add index.html

rem Show status
echo.
echo === GIT STATUS ===
git status --short

rem Commit (skip if nothing new)
echo.
echo === COMMIT ===
git commit -m "fix: Mobile orbit-animation + JARVIS Kalender-Intelligenz Panel 2026-05-18" 2>nul || echo Commit bereits vorhanden - fahre fort mit Push...

rem Push
echo.
echo === PUSH ===
git push origin main

echo.
echo ============================================
echo  FERTIG!
echo  Live: https://voigtcarsten4-rgb.github.io/ceo-office/
echo ============================================
echo.
pause
