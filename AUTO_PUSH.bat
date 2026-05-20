@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "fix(office+financial+bridge): Fix-Pack V2 2026-05-20 (Cookie/Risk/State/Calendar/FinancialOS-v2/Bridge-V3.1-LIVE)"
git push origin main > push_log.txt 2>&1
type push_log.txt
echo.
echo === DONE - waiting 10s ===
timeout /t 10 /nobreak
exit
