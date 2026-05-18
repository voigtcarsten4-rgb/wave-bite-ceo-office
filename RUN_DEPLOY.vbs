Dim sRepo, sPS1, sCmd
sRepo = "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"
sPS1  = sRepo & "\deploy_git.ps1"
sCmd  = "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & sPS1 & """"

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run sCmd, 0, False
WScript.Echo "Deploy gestartet. Bitte 60 Sekunden warten, dann deploy_log.txt pruefen."
