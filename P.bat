@echo off
cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
git config user.email "voigtcarsten4@gmail.com"
git config user.name "Carsten Voigt"
git reset HEAD -- .
git add index.html
git status
git commit -m "fix: Mobile animation + JARVIS Calendar Intelligence 2026-05-18"
git push origin main
echo DONE - check above for errors
pause
