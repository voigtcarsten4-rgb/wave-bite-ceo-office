@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git rm --cached wava.js 2>nul
del /f /q wava.js 2>nul
git add -A
git commit -m "feat(Samantha v3): Action-Engine + Jarvis-Bar + Plugin-Bibliothek + Live-Mail/Cal-Insights" -m "- 9 echte Workflow-Actions (ILB-Antrag, B2B-Wasserlage 64 Kontakte, WFB-Follow-up, DHDL-Prep, Notar-MSA, LinkedIn-Post, David-Phantom, Sozialhilfe, Cashflow-Snapshot)" -m "- Jarvis Command-Bar (Ctrl+J) mit Fuzzy-Search ueber alle Actions+Docs+Navigation" -m "- Plugin-Bibliothek: 23 Plugins / 200+ Skills katalogisiert + kontextueller Use-Case" -m "- Tasks-Tab mit Toggle/Delete (Bug-Fix: stopPropagation auf row-icons)" -m "- Insights-Engine scannt Calendar+Inbox live (heute/morgen/Therapie Schuelin/kritische Mails)" -m "- 8 Tabs statt 5 (Heute/Actions/Tasks/Notes/Docs/Chat/Plugins/Health)" -m "- Toast-Notifications nach Action-Ausfuehrung" -m "- Faktenbuch + B2B-Wasserlage-PDF + CEO-Briefing in docs/"
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 6 /nobreak
exit
