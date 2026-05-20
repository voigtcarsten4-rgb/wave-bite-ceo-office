@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "fix(office): Risk-statische-Matrix raus, Demo-KPIs durch Live-Platzhalter ersetzt, 13 Buttons mit echten Aktionen (Pitch/Businessplan/EXIST/SHA/LOIs PDFs in docs/), Bridge-URL als Default, Demo-Kalender-Events deaktiviert"
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
