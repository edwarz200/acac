dim fso: set fso = CreateObject("Scripting.FileSystemObject")
dim CurrentDirectory
CurrentDirectory = fso.GetAbsolutePathName(".")
dim Directory
Directory = CurrentDirectory & "\Close.bat"

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & Directory & Chr(34), 0
Set WshShell = Nothing