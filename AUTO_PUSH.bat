@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "feat(v7-stable): permanenter Cache-Killer + Auto-Version-Check + Backup-Tag" -m "- Meta http-equiv Cache-Control: no-cache, no-store, must-revalidate, max-age=0" -m "- Pragma: no-cache · Expires: 0" -m "- build-version Meta-Tag v7-2026-05-21 fuer Auto-Reload-Erkennung" -m "- Auto-Version-Check Script: prueft beim Boot raw.githubusercontent.com build-version vs. lokal. Bei Drift → SW+Caches loeschen → Hard-Reload mit Versions-Query. Sessionstorage-Guard: max 1x pro Minute." -m "- Titel: 'Lucy Edition' statt 'JARVIS Edition'" -m "- Result: Desktop-Shortcuts laden ab sofort immer die neueste Version automatisch"
git tag -a v7.0-stable -m "Wave Bite CEO Office v7 Stable · Lucy + USS Enterprise + Wave Bite Universe + Cache-Killer · 2026-05-21" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
