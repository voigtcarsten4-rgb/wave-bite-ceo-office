$git = "C:\Program Files\Git\cmd\git.exe"
$repo = "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"
Set-Location $repo

if (Test-Path ".git\index.lock") {
    Remove-Item ".git\index.lock" -Force
    Write-Host "Lock removed."
}

& $git config user.email "voigtcarsten4@gmail.com"
& $git config user.name "Carsten Voigt"
& $git add "index.html"
Write-Host "STAGE: $LASTEXITCODE"
& $git commit -m "fix(mobile): quick-actions-bar row layout 900px, padding-bottom fix, dash-grid span reset"
Write-Host "COMMIT: $LASTEXITCODE"
& $git push origin main
Write-Host "PUSH: $LASTEXITCODE"
