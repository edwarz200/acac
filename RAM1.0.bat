@echo off
call Mongod_oculto.VBS
Start http://localhost:2000/
call InitAppSupervisor.bat