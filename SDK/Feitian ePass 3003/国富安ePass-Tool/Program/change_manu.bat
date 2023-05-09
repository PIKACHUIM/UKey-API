@echo off
taskkill /f /im gfa_serverd.exe
copy %1 mtoken_gm3000.dll
gfa_serverd.exe

