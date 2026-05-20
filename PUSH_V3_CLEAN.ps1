# WaveByte CEO Office v3.0 - Clean Push Script
Set-Location "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

Write-Host "=== WaveByte CEO Office v3.0 Push ===" -ForegroundColor Cyan

# Remove lock files if present
if (Test-Path ".git\index.lock") { Remove-Item ".git\index.lock" -Force; Write-Host "[OK] index.lock removed" -ForegroundColor Green }
if (Test-Path ".git\HEAD.lock")  { Remove-Item ".git\HEAD.lock"  -Force; Write-Host "[OK] HEAD.lock removed"  -ForegroundColor Green }

# Git identity
git config user.email "voigtcarsten4@gmail.com"
git config user.name  "Carsten Voigt"

# Stage
git add index.html wavebyte-financial-os.html
Write-Host ""
Write-Host "=== GIT STATUS ===" -ForegroundColor Yellow
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
} else {
    Write-Host "ERROR - Check GitHub credentials" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
