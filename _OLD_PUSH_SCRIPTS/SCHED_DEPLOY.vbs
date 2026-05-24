' Schedule deploy_git.ps1 to run immediately via Task Scheduler COM
Dim oService, oTaskDef, oTrigger, oAction, oSettings, oRegInfo
Dim sPS1, sTaskName

sPS1      = "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live\deploy_git.ps1"
sTaskName = "WaveBiteDeploy_Now"

Set oService = CreateObject("Schedule.Service")
oService.Connect

' Delete old task if exists
On Error Resume Next
oService.GetFolder("\").DeleteTask sTaskName, 0
On Error GoTo 0

Set oTaskDef  = oService.NewTask(0)

' Registration info
Set oRegInfo = oTaskDef.RegistrationInfo
oRegInfo.Description = "WaveBite CEO Office Deploy"
oRegInfo.Author      = "Claude"

' Settings
Set oSettings = oTaskDef.Settings
oSettings.StartWhenAvailable = True
oSettings.ExecutionTimeLimit  = "PT10M"

' Trigger: start in 5 seconds
Dim oTimeTrigger
Set oTimeTrigger = oTaskDef.Triggers.Create(1) ' TASK_TRIGGER_TIME = 1
Dim dStart
dStart = Now() + TimeSerial(0, 0, 5)
oTimeTrigger.StartBoundary = Year(dStart) & "-" & Right("0" & Month(dStart),2) & "-" & Right("0" & Day(dStart),2) & "T" & Right("0" & Hour(dStart),2) & ":" & Right("0" & Minute(dStart),2) & ":" & Right("0" & Second(dStart),2)
oTimeTrigger.ExecutionTimeLimit = "PT5M"
oTimeTrigger.Enabled = True

' Action: powershell -File deploy_git.ps1
Set oAction = oTaskDef.Actions.Create(0) ' TASK_ACTION_EXEC = 0
oAction.Path      = "powershell.exe"
oAction.Arguments = "-ExecutionPolicy Bypass -NonInteractive -File """ & sPS1 & """"
oAction.WorkingDirectory = "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

' Principal: run as current user
oTaskDef.Principal.RunLevel = 0 ' TASK_RUNLEVEL_LUA (no elevation)

' Register and run immediately
Dim oReg
Set oReg = oService.GetFolder("\")
oReg.RegisterTaskDefinition sTaskName, oTaskDef, 6, Null, Null, 3 ' TASK_CREATE_OR_UPDATE=6, TASK_LOGON_INTERACTIVE_TOKEN=3

' Run it now
Dim oTask
Set oTask = oService.GetFolder("\").GetTask(sTaskName)
oTask.Run(Null)

WScript.Echo "Deploy-Task gestartet! Warte ~60s dann deploy_log.txt pruefen."
