@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
if exist ".git\HEAD.lock" del /f /q ".git\HEAD.lock"
git reset >nul 2>&1
git add index.html PUSH_V19.bat
git commit -m "feat(v19): Nav-Pills hardcoded + Marketing-Detail-Dashboard Hero + Click-Delegation" -m "- STUDIO + MARKETING + MKT-OS Pills jetzt fix im Nav-HTML (nicht mehr JS-Inject)" -m "- Robuster Click-Handler via Event-Delegation (data-target Attribut)" -m "- Service-Worker auto-kill direkt nach <body> fuer Cache-Frische" -m "- Prominenter Marketing Detail-Dashboard Hero Card mit 3 Buttons (Im Dashboard / Neuer Tab / Leonardo)"
git tag -a v19-nav-hardcoded -m "Nav hartverdrahtet" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 5 /nobreak
exit
