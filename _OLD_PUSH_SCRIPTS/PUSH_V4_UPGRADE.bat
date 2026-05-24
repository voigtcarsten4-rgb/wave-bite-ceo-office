@echo off
chcp 65001 >nul
echo ================================================
echo  CEO Office - V4 Upgrade Push
echo ================================================
cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo.
echo [0/4] Clearing git lock if present...
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo Lock file removed.
) else (
    echo No lock file found.
)

echo.
echo [1/4] Staging changes...
git add index.html
echo STAGE EXIT: %ERRORLEVEL%

echo.
echo [2/4] Committing...
git commit -m "feat: Cream Design + Ionos Mail + Gmail Sent + Mobile Fix + Section Collapse"
echo COMMIT EXIT: %ERRORLEVEL%

echo.
echo [3/4] Pushing to GitHub...
git push origin main
echo PUSH EXIT: %ERRORLEVEL%

echo.
echo ================================================
if %ERRORLEVEL% == 0 (
    echo  PUSH ERFOLGREICH!
    echo  Live: https://voigtcarsten4-rgb.github.io/ceo-office/
) else (
    echo  FEHLER beim Push! Exit Code: %ERRORLEVEL%
)
echo ================================================
pause
