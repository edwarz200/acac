@echo off
call Mongod_oculto_x64.bat
Start http://localhost:2000/
call InitAppSupervisor.bat