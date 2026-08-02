[Setup]
AppId={{D37F2188-75A0-4F29-8422-C89C7172A2E6}}
AppName=NeXtLock
AppVersion=1.0.0
AppPublisher=Nimesh Alwis
DefaultDirName={autopf}\NeXtLock
DisableDirPage=no
DefaultGroupName=NeXtLock
AllowNoIcons=yes
OutputDir=dist
OutputBaseFilename=NeXtLock-Setup-v1.0.0
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
UninstallDisplayIcon={app}\NeXtLock.exe
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\win-unpacked\NeXtLock.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "dist\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\NeXtLock"; Filename: "{app}\NeXtLock.exe"
Name: "{group}\{cm:UninstallProgram,NeXtLock}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\NeXtLock"; Filename: "{app}\NeXtLock.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\NeXtLock.exe"; Description: "{cm:LaunchProgram,NeXtLock}"; Flags: nowait postinstall skipifsilent
