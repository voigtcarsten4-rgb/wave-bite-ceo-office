@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
if exist ".git\HEAD.lock" del /f /q ".git\HEAD.lock"
git reset >nul 2>&1
git add index.html PUSH_V20.bat
git commit -m "feat(v20): Nav-Pills als anchor href + sticky CTA Bar + Marketing-Detail-Dashboard buttons everywhere" -m "- 18 Nav-Pills von div onclick auf a href umgestellt (funktionieren ohne JS via Hash-Anchor)" -m "- Sticky CTA Bar top-right mit STUDIO + MARKETING-OS + LEONARDO Buttons (immer sichtbar)" -m "- Studio-Header bekommt MARKETING DETAIL-DASHBOARD + LEONARDO STUDIO Buttons" -m "- Marketing-Sektion Titel bekommt prominenten MARKETING DETAIL-DASHBOARD Button + Inline Open" -m "- Cache-Busting Meta-Tags (no-cache no-store must-revalidate, pragma, expires 0) + version meta"
git tag -a v20-bulletproof -m "Bulletproof nav + everywhere marketing links" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 5 /nobreak
exit
