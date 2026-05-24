@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
if exist ".git\HEAD.lock" del /f /q ".git\HEAD.lock"
git reset >nul 2>&1
del /f /q v18_max_expansion.js new_studio_block.html new_studio_js.html 2>nul
git add index.html PUSH_V18.bat
git commit -m "feat(v18): Studio MAX-Expansion + Nav-Pills + Marketing-OS integriert" -m "- 7 AI-Rollen (Creative Director, Video Producer, Music Composer, Voice Artist, Brand Manager, Social Strategist, QA-Gate)" -m "- 8 Layer System (Foundation -> Analytics)" -m "- Prompt Library (Video/Image/Voice/Social) mit Copy + Lucy-Refine" -m "- 8-Step Pipeline (Moodboard bis Schedule, je Tool + Zeit)" -m "- 12-Point Brand Quality Gate mit Live-Progress + Lucy-Check" -m "- Tabs (Rollen/Layers/Prompts/Pipeline/Brand) als interaktiver Switcher" -m "- Nav-Pills: STUDIO + MARKETING ergaenzt (autoinjected)" -m "- Studio Full-Scan Lucy-Button"
git tag -a v18-studio-max -m "Studio MAX + Marketing-OS integriert" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 6 /nobreak
exit
