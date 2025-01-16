# PowerShell Setup Script for Game Economy Simulation Tool

# Enable detailed logging
$ErrorActionPreference = 'Stop'

# Function to check command availability
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try { 
        if (Get-Command $command) { return $true }
    }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# Logging function
function Write-Log {
    param($Message, $Color = 'Green')
    Write-Host $Message -ForegroundColor $Color
}

# Validate prerequisites
Write-Log "Checking System Prerequisites..." Yellow

# Check Python
try {
    $pythonVersion = python --version
    Write-Log "Python: $pythonVersion" Green
}
catch {
    Write-Log "Error: Python not found or not in PATH" Red
    Write-Log "Please install Python 3.8+ and ensure it's added to PATH" Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Log "Node.js: $nodeVersion" Green
}
catch {
    Write-Log "Error: Node.js not found or not in PATH" Red
    Write-Log "Please install Node.js and ensure it's added to PATH" Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Log "npm: $npmVersion" Green
}
catch {
    Write-Log "Error: npm not found" Red
    Write-Log "Please reinstall Node.js to include npm" Red
    exit 1
}

# Create virtual environment
Write-Log "Creating Python Virtual Environment..." Yellow
try {
    python -m venv venv
    Write-Log "Virtual Environment Created Successfully" Green
}
catch {
    Write-Log "Failed to create virtual environment" Red
    Write-Log $_.Exception.Message Red
    exit 1
}

# Activate virtual environment
Write-Log "Activating Virtual Environment..." Yellow
try {
    .\venv\Scripts\Activate.ps1
    Write-Log "Virtual Environment Activated" Green
}
catch {
    Write-Log "Failed to activate virtual environment" Red
    Write-Log $_.Exception.Message Red
    exit 1
}

# Install Python dependencies
Write-Log "Installing Python Dependencies..." Yellow
try {
    pip install -r requirements.txt
    Write-Log "Python Dependencies Installed Successfully" Green
}
catch {
    Write-Log "Failed to install Python dependencies" Red
    Write-Log $_.Exception.Message Red
    exit 1
}

# Start Backend Server
Write-Log "Starting Backend Server..." Yellow
Start-Process powershell -ArgumentList "-Command", "python backend\app.py" -NoNewWindow

# Navigate to Frontend
Set-Location frontend

# Install Frontend Dependencies
Write-Log "Installing Frontend Dependencies..." Yellow
try {
    npm install
    Write-Log "Frontend Dependencies Installed Successfully" Green
}
catch {
    Write-Log "Failed to install frontend dependencies" Red
    Write-Log $_.Exception.Message Red
    exit 1
}

# Start Frontend Server
Write-Log "Starting Frontend Server..." Yellow
Start-Process powershell -ArgumentList "-Command", "npm start" -NoNewWindow

Write-Log "Setup Complete!" Green
Write-Log "Backend Server: http://localhost:5000" Cyan
Write-Log "Frontend Server: http://localhost:3000" Cyan

# Keep the window open
Read-Host "Press Enter to exit"
