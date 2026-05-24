@echo off
cd /d "%~dp0"
echo === Cleaning git locks ===
if exist ".git\index.lock" del /f /q ".git\index.lock"
if exist ".git\HEAD.lock" del /f /q ".git\HEAD.lock"
if exist ".git\index" del /f /q ".git\index"
echo === Rebuilding index from HEAD ===
git reset
git status
echo === Staging index.html ===
git add index.html PUSH_V17.bat
echo === Committing v17 ===
git commit -m "feat(v17): NEXT-GEN STUDIO + autonomes Marketing-Cockpit" -m "- 13 AI-Tools (Video/Image/Voice/Music/Auto) klickbar mit Status-Pills" -m "- 4 Hero-Buttons + Modal-Iframe fuer AI Marketing OS + Leonardo Studio" -m "- Lucy-Hooks pro Tool, Marketing Intel Panel mit Trend-Watch + Competitor + 7-Tage-Plan + Opportunity-Scan"
echo === Tagging ===
git tag -a v17-studio-integration -m "Studio + Marketing OS integration"
echo === Pushing ===
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
