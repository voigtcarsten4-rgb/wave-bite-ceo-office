@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  WAVE BITE CEO OFFICE - v9.5 LUCY XL + CLAUDE-API
echo  - Lucy XL (155k, 1961 LOC, 10 Tabs inkl. Chat)
echo  - callClaude() via Apps Script Bridge V3.2 action=claude
echo  - 17 Actions / 23 Plugins / 29 Docs / Jarvis Command Palette
echo ============================================================
echo.

if exist ".git\index.lock" (
    echo [1/6] entferne haengenden index.lock
    del /f /q ".git\index.lock"
)

echo [2/6] staging
git reset >nul 2>&1
git add index.html samantha.js

echo [3/6] status
git status --short

echo.
echo [4/6] commit
git commit -m "feat(v9.5): Lucy XL wiederhergestellt (155k) + Claude-API Hook + Jarvis Palette" ^
  -m "- samantha.js: Full XL-Version aus Commit b2c91db wiederhergestellt (1961 LOC)" ^
  -m "- 10 Tabs: Heute/Foresight/Mails/Actions/Tasks/Notes/Docs/Chat/Plugins/Health" ^
  -m "- callClaude(message, history) - POST BRIDGE/exec?action=claude - Anthropic Sonnet via Apps Script Proxy" ^
  -m "- SYSTEM_PROMPT mit komplettem Wave-Bite-Faktenkontext (Cap Table, Forecast, LOIs, Blockers)" ^
  -m "- ruleBasedReply Fallback fuer 20+ Frage-Patterns (loi/cap-table/funding/burn/dhdl/wolzig/marcus/david/wipo/wfb...)" ^
  -m "- Jarvis Command-Palette (Ctrl+J) mit Fuzzy-Search ueber alle Tabs/Actions/Plugins" ^
  -m "- 17 ACTIONS, 23 PLUGINS, 29 DOCS aus Lucy-Public-API erreichbar" ^
  -m "- Cache-Buster: ?v=2026-05-21-v5-XL-claude" ^
  -m "- API-Key NICHT im Frontend - nur Apps Script Properties (sicher)"

echo [5/6] tag v9.5-lucy-xl
git tag -a v9.5-lucy-xl -m "Lucy XL + Claude-API-Hook + Jarvis Palette wiederhergestellt" 2>nul

echo [6/6] push
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt

echo.
echo ============================================================
echo  FERTIG. Live-URL:
echo  https://voigtcarsten4-rgb.github.io/ceo-office/
echo  Strg+F5 nach 1-2 Min, dann Avatar unten rechts klicken
echo  oder Ctrl+J = Jarvis Command Palette
echo ============================================================
timeout /t 10 /nobreak
exit
