@echo off

rem enable microsoft edge browser
CheckNetIsolation LoopbackExempt -a -n=Microsoft.MicrosoftEdge_8wekyb3d8bbwe

sc stop gfa_service
sc delete gfa_service
taskkill /f /im gfa_serverd.exe

if "%PROCESSOR_ARCHITECTURE%"=="x86" goto 32
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto 64

:32
echo 32
sc create gfa_service binpath= "C:\Program Files\GFA\gfa_sec_plugin\gfa_service.exe" start= auto displayname= "国富安安全插件服务" 
sc start gfa_service
goto end

:64
echo 64
sc create gfa_service binpath= "C:\Program Files (x86)\GFA\gfa_sec_plugin\gfa_service.exe" start= auto displayname= "国富安安全插件服务" 
sc start gfa_service
:end