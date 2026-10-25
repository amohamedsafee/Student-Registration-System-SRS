# PowerShell Automated Backup Script for LLC SRS Database
param (
    [string]$DbName = "llc_registration",
    [string]$DbUser = "root",
    [string]$DbPass = "",
    [string]$BackupDir = "$PSScriptRoot\..\backups"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$OutputFile = "$BackupDir\llc_backup_$Timestamp.sql"

Write-Host "[$((Get-Date).ToString())] Backing up database '$DbName'..." -ForegroundColor Cyan

$dumpArgs = @(
    "-u", $DbUser,
    "--single-transaction",
    "--quick",
    "--routines",
    "--triggers",
    $DbName
)

if ($DbPass) {
    $dumpArgs += "-p$DbPass"
}

$mysqldumpCmd = "mysqldump"
if (!(Get-Command "mysqldump" -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\xampp\mysql\bin\mysqldump.exe") {
        $mysqldumpCmd = "C:\xampp\mysql\bin\mysqldump.exe"
    }
}

# Run mysqldump
& $mysqldumpCmd @dumpArgs > $OutputFile

if ((Get-Item $OutputFile).Length -gt 1024) {
    Write-Host "[$((Get-Date).ToString())] Backup successful: $OutputFile ($((Get-Item $OutputFile).Length) bytes)" -ForegroundColor Green
} else {
    Write-Error "Backup file is empty or corrupted."
}
