@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html
git commit -m "fix(v15): Alle 12 Pegelstationen wie Detail-Dashboard (FRANKFURT1 ODER war orange)"
git tag -a v15-allstations -m "12 stations 1:1 detail" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
