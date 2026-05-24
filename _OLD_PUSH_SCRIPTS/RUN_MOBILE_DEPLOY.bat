@echo off
title CEO Office — Mobile Animation + Intelligenz Fix Deploy
cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo === CEO OFFICE DEPLOY: Mobile Animation + JARVIS Kalender-Intelligenz ===
echo.

rem Remove git lock if exists
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo Lock-Datei entfernt.
)

rem Git config
git config user.email "voigtcarsten4@gmail.com"
git config user.name "Carsten Voigt"

rem Reset staged deletions
git reset HEAD -- .

rem Add all key files
git add index.html
git add ceo-calendar-planner.html
git add wavebite-leonardo-studio.html
git add manifest.json
git add sw.js
git add favicon.ico
git add icon-192.png
git add icon-512.png
git add boat.png
git add Dashboard_Icon.png
git add Wasserlage_Icon.png

echo.
echo === GIT STATUS ===
git status --short

echo.
echo === COMMIT ===
git commit -m "fix: Mobile orbit-animation + JARVIS Kalender-Intelligenz Panel 2026-05-18"

echo.
echo === PUSH zu ceo-office ===
echo URL: https://voigtcarsten4-rgb.github.io/ceo-office/
git push origin main

echo.
echo === FERTIG ===
echo Live Dashboard: https://voigtcarsten4-rgb.github.io/ceo-office/
echo.
pause
