@echo off

sc stop gfa_service
sc delete gfa_service
taskkill /f /im gfa_serverd.exe