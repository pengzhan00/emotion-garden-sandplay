@echo off
REM ============================================================
REM 情绪花园 — 数字沙盘  Windows Build Script
REM ============================================================
REM Usage: build.bat
REM Requirements: Node.js (https://nodejs.org)
REM ============================================================

setlocal enabledelayedexpansion
title 情绪花园 Windows Build

echo ==========================================
echo  情绪花园 — 数字沙盘 Windows Build Script
echo ==========================================
echo.

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking Node.js version...
node --version
echo.

REM Check if node_modules exist, if not install dependencies
echo [2/4] Installing dependencies...
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
) else (
    echo   Dependencies already installed. Run "npm install" to update.
)
echo.

REM Copy the HTML file from project root
echo [3/4] Copying HTML resources...
set PROJECT_ROOT=..\..
set HTML_FILE=%PROJECT_ROOT%\情绪花园_数字沙盘.html

if exist "%HTML_FILE%" (
    copy /Y "%HTML_FILE%" "情绪花园_数字沙盘.html" >nul
    echo   ✓ Copied 情绪花园_数字沙盘.html
) else (
    echo WARNING: %HTML_FILE% not found!
    echo   The app will try to load from current directory.
)

REM Copy src/ directory for modular CSS/JS assets
if exist "%PROJECT_ROOT%\src\" (
    if not exist "src" mkdir src
    xcopy /E /Y "%PROJECT_ROOT%\src\*" "src\" >nul
    echo   ✓ Copied src/ assets
)
echo.

REM Create assets directory if not exists
if not exist "assets" mkdir assets
echo   ✓ Assets directory ready
echo.

REM Build
echo [4/4] Building Windows package...
echo.
echo   Choose build option:
echo   -------------------------------
echo   1) Build installer (NSIS)
echo   2) Build portable .exe
echo   3) Package only (no installer)
echo   4) Start app (no build)
echo   -------------------------------
echo.

set /p BUILD_CHOICE="Enter choice [1-4]: "

if "%BUILD_CHOICE%"=="1" (
    echo.
    echo Building NSIS installer...
    call npx electron-builder --win
    goto :done
)
if "%BUILD_CHOICE%"=="2" (
    echo.
    echo Building portable .exe...
    call npx electron-builder --win portable
    goto :done
)
if "%BUILD_CHOICE%"=="3" (
    echo.
    echo Packaging app...
    call npx electron-builder --dir
    goto :done
)
if "%BUILD_CHOICE%"=="4" (
    echo.
    echo Starting app...
    call npx electron .
    goto :done
)

echo Invalid choice. Starting app as default...
call npx electron .

:done
echo.
echo ==========================================
echo  Build Complete!
echo ==========================================
echo.
echo  Output directory: dist\
echo.
pause
