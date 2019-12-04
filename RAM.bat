@echo off
call InitApp.bat
ping localhost -n 5
Start http://localhost:2000/