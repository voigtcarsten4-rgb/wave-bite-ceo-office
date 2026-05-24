@echo off
chcp 65001 >nul
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html samantha.js
git commit -m "fix(v10): Lucy callClaude robust mit kompaktem System-Prompt + Retry-Logik" ^
  -m "- SHORT_SYS Kontextzeile statt mehrzeiligem System (Apps Script size/cache quirk umgangen)" ^
  -m "- Up to 2 Attempts mit 800ms Pause bei 'Unbekannte POST-Aktion' Response" ^
  -m "- addLearning in eigenes try/catch um catch-Cascade zu vermeiden" ^
  -m "- Cache-Buster samantha.js v10-claude-stable"
git tag -a v10-claude-stable -m "Lucy Chat Sonnet stable" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
