@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  WAVE BITE CEO OFFICE - v9.8 LUCY CHAT LIVE
echo  - Bridge-URL Mismatch gefixt (AKfycbzR2P... statt OcLq...)
echo  - Lucy Chat nutzt jetzt geupdatete Bridge mit action=claude
echo ============================================================
echo.
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html samantha.js
git status --short
git commit -m "fix(v9.8): Lucy BRIDGE-URL korrigiert auf live-Claude-Bridge (R2P statt OcLq)" ^
  -m "- samantha.js BRIDGE-Konstante auf die mit action=claude Handler aktualisierte Web-App umgestellt" ^
  -m "- Cache-Buster v7-claude-live forciert Reload" ^
  -m "- Anthropic Sonnet 4.5 via Apps Script Bridge V3.3 jetzt im Chat live"
git tag -a v9.8-lucy-claude-live -m "Lucy Chat ueber Anthropic Sonnet 4.5 live" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
echo.
echo FERTIG. Strg+F5 auf https://voigtcarsten4-rgb.github.io/ceo-office/
timeout /t 8 /nobreak
exit
