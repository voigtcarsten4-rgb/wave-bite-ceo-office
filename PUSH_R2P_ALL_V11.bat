@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html
git commit -m "fix(v11): Alle OcLq-URL Hardcodes auf R2P (Claude-Bridge V3.3) - Auto-Setup-Block + GMAIL_BRIDGE_URL"
git tag -a v11-r2p-all -m "All bridge URLs unified on R2P (Claude live)" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
