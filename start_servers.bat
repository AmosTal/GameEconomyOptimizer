@echo off
REM Ensure virtual environment is activated
if not defined VIRTUAL_ENV (
    call venv\Scripts\activate
)

REM Run the Python script to start servers
python start_servers.py

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python not found. Please install Python 3.8+.
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not found. Please install Node.js.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate
if errorlevel 1 (
    echo Error: Failed to activate virtual environment.
    echo Creating new virtual environment...
    python -m venv venv
    call venv\Scripts\activate
)

REM Install/Update Python dependencies
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install Python dependencies.
    pause
    exit /b 1
)

REM Start Backend Server
start "Backend Server" cmd /k "venv\Scripts\python backend\app.py"

REM Navigate to Frontend and start server
cd frontend
start "Frontend Server" cmd /k "npm start"

echo Servers started successfully!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000

pause
