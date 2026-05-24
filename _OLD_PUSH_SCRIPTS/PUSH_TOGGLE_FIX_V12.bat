@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html
git commit -m "fix(v12): Section-Toggle Bug - Click nur auf .sec-toggle Button, nicht ganzes Title" ^
  -m "- Innere Buttons (Tracking Dashboard, etc.) loesten sonst Section-Collapse aus" ^
  -m "- localStorage 'sec_*' Marker beim Boot aufgeraeumt (stale closed states)" ^
  -m "- ev.stopPropagation() auf Toggle-Btn" ^
  -m "- Cache-Buster samantha.js?v=v12-toggle-fix"
git tag -a v12-toggle-fix -m "Section toggle fixed" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
