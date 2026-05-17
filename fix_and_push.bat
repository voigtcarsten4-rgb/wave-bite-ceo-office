@echo off
chcp 65001 >nul
echo ================================================
echo  CEO Office - Fix Local File + Push
echo ================================================
cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo.
echo [0/5] Clearing git lock if present...
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo Lock file removed.
) else (
    echo No lock file found.
)

echo.
echo [1/5] Restoring index.html from HEAD (fix truncation)...
git checkout -- index.html
echo RESTORE EXIT: %ERRORLEVEL%

echo.
echo [2/5] Checking file size...
for %%A in (index.html) do echo File size: %%~zA bytes

echo.
echo [3/5] Staging...
git add index.html push_to_github.bat fix_and_push.bat
echo STAGE EXIT: %ERRORLEVEL%

echo.
echo [4/5] Committing...
git commit -m "fix: restore index.html from HEAD after truncation"
echo COMMIT EXIT: %ERRORLEVEL%

echo.
echo [5/5] Push to GitHub...
git push origin main
echo PUSH EXIT: %ERRORLEVEL%

echo.
echo ================================================
echo  Status: DONE
echo  Live: https://voigtcarsten4-rgb.github.io/ceo-office/
echo ================================================
pause
