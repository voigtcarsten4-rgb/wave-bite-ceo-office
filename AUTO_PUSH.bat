@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "feat(tracking): Live Tracking Center mit per-Stream KPIs, QR-Stats, Downloads, PWA-Installs - Bridge V3.2"
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
