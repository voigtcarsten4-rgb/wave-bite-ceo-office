$ErrorActionPreference = "Continue"
$repo = "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"
Set-Location $repo

Write-Host "=== CEO OFFICE DEPLOY — Mobile Fix + Kalender ==="

# Remove lock file if exists
if (Test-Path ".git\index.lock") {
    Remove-Item ".git\index.lock" -Force
    Write-Host "Lock file removed"
}

# Git config
& git config user.email "voigtcarsten4@gmail.com"
& git config user.name "Carsten Voigt"

# Reset staged deletions
& git reset HEAD -- .

# Add all key files
$files = @(
    "index.html",
    "ceo-calendar-planner.html",
    "wavebite-leonardo-studio.html",
    "manifest.json",
    "sw.js",
    "favicon.ico",
    "icon-192.png",
    "icon-512.png",
    "boat.png",
    "wavebite-boat.png.jpg",
    "wasserlage-icon-192.png",
    "wasserlage-icon-512.png",
    "Dashboard_Icon.png",
    "Wasserlage_Icon.png",
    "DEPLOY_NOW.bat",
    "PUSH_CEO_STUDIO.bat",
    "RUN_DEPLOY.vbs",
    "deploy_git.ps1",
    "DEPLOY_MOBILE_FIX.ps1"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $result = & git add $f 2>&1
        Write-Host "add $f : $result"
    }
}

# Show status
Write-Host ""
Write-Host "=== GIT STATUS ==="
& git status --short

# Commit
Write-Host ""
Write-Host "=== COMMITTING ==="
$commitOut = & git commit -m "feat: Mobile-Optimierung + Kalender-Fix + Master Bridge Integration 2026-05-18" 2>&1
Write-Host $commitOut

# Push
Write-Host ""
Write-Host "=== PUSHING to ceo-office ==="
Write-Host "URL: https://voigtcarsten4-rgb.github.io/ceo-office/"
$pushOut = & git push origin main 2>&1
Write-Host $pushOut

Write-Host ""
Write-Host "=== DONE ==="
Write-Host "Live URL: https://voigtcarsten4-rgb.github.io/ceo-office/"
Read-Host "Druecke Enter zum Schliessen"
