@echo off
chcp 65001 >nul
cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"
echo [1] Staging index.html...
"C:\Program Files\Git\cmd\git.exe" add index.html
echo STAGE: %ERRORLEVEL%
echo [2] Committing...
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: GitHub-Links korrekt, meta-description norobots, canvas IntersectionObserver Performance-Guard"
echo COMMIT: %ERRORLEVEL%
echo [3] Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo PUSH: %ERRORLEVEL%
echo DONE.
