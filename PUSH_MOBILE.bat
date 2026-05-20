@echo off
chcp 65001 >nul
cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"
if exist ".git\index.lock" del /f ".git\index.lock" && echo LOCK REMOVED
echo [1] Staging...
"C:\Program Files\Git\cmd\git.exe" add index.html
echo STAGE: %ERRORLEVEL%
echo [2] Committing...
"C:\Program Files\Git\cmd\git.exe" commit -m "fix(mobile): quick-actions-bar row layout 900px, padding-bottom fix, dash-grid span reset"
echo COMMIT: %ERRORLEVEL%
echo [3] Pushing...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo PUSH: %ERRORLEVEL%
echo DONE.
