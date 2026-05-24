# WaveByte CEO Office — Button Fixes + Mobile Fix + Financial OS Push
Set-Location "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

Write-Host "=== WaveByte CEO Office — Fixes Push ===" -ForegroundColor Cyan

if (Test-Path ".git\index.lock") { Remove-Item ".git\index.lock" -Force; Write-Host "[OK] lock removed" -ForegroundColor Green }
if (Test-Path ".git\HEAD.lock")  { Remove-Item ".git\HEAD.lock"  -Force; Write-Host "[OK] HEAD lock removed" -ForegroundColor Green }

git config user.email "voigtcarsten4@gmail.com"
git config user.name  "Carsten Voigt"

git add index.html wavebyte-financial-os.html

Write-Host ""
Write-Host "=== STATUS ===" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "=== COMMIT ===" -ForegroundColor Yellow
git commit -m "fix: Mobile overflow exec sections, Financial OS deployed, all buttons wired, Wasserlage button, KPI Report linked"

Write-Host ""
Write-Host "=== PUSH ===" -ForegroundColor Yellow
git push origin main

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! Live in ~60 seconds:" -ForegroundColor Green
    Write-Host "https://voigtcarsten4-rgb.github.io/ceo-office/" -ForegroundColor Cyan
    Write-Host "Financial OS: https://voigtcarsten4-rgb.github.io/ceo-office/wavebyte-financial-os.html" -ForegroundColor Cyan
} else {
    Write-Host "ERROR - Check credentials" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
