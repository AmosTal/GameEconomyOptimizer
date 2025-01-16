@echo off
setlocal enabledelayedexpansion

echo Game Economy Simulation Tool - Setup Script
echo ===========================================
echo Checking system requirements...

REM Verbose Python check
echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    echo Ensure Python is added to PATH during installation.
    pause
    exit /b 1
)

REM Verbose Node.js check
echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo Ensure "Add to PATH" is selected during installation.
    pause
    exit /b 1
)

echo Checking npm installation...
npm --version
if errorlevel 1 (
    echo ERROR: npm is not installed.
    echo This usually means Node.js installation was incomplete.
    echo Reinstall Node.js and ensure npm is included.
    pause
    exit /b 1
)

REM Create virtual environment with verbose output
echo Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment.
    echo Possible causes:
    echo - Insufficient permissions
    echo - Python installation issue
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment.
    pause
    exit /b 1
)

REM Install Python requirements with detailed output
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies.
    echo Possible causes:
    echo - Network issues
    echo - Incompatible package versions
    echo - Pip installation problem
    pause
    exit /b 1
)

REM Start backend server
echo Starting Backend Server...
start "Backend Server" cmd /k "venv\Scripts\python backend\app.py"

REM Navigate to frontend
cd frontend

REM Install frontend dependencies
echo Installing Frontend dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies.
    echo Possible causes:
    echo - Network issues
    echo - Npm configuration problem
    pause
    exit /b 1
)

REM Start frontend development server
echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm start"

echo ============================================
echo Setup Complete!
echo Backend Server: http://localhost:5000
echo Frontend Server: http://localhost:3000
echo ============================================

pause
