import subprocess
import sys
import os
import threading
import time
import platform
import shutil
import signal

# Global flag to control server lifecycle
SERVERS_RUNNING = True

def check_dependency(dependency):
    """Check if a system dependency is installed"""
    path = shutil.which(dependency)
    print(f"Checking {dependency}: {path}")
    return path is not None

def create_venv():
    """Create virtual environment with explicit checks"""
    project_root = os.path.dirname(os.path.abspath(__file__))
    venv_path = os.path.join(project_root, 'venv')
    
    # Check if venv already exists
    if os.path.exists(venv_path):
        print(f"Virtual environment already exists at {venv_path}")
        return
    
    # Create virtual environment
    try:
        subprocess.run([sys.executable, '-m', 'venv', venv_path], check=True)
        print(f"Created virtual environment at {venv_path}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to create virtual environment: {e}")
        sys.exit(1)

def terminate_processes(backend_process, frontend_process):
    """Safely terminate all server processes"""
    global SERVERS_RUNNING
    SERVERS_RUNNING = False
    
    print("\nShutting down servers...")
    
    # Terminate backend
    if backend_process:
        try:
            os.kill(backend_process.pid, signal.SIGTERM)
        except Exception as e:
            print(f"Error terminating backend: {e}")
    
    # Terminate frontend
    if frontend_process:
        try:
            os.kill(frontend_process.pid, signal.SIGTERM)
        except Exception as e:
            print(f"Error terminating frontend: {e}")
    
    # Wait a moment for processes to shut down
    time.sleep(2)
    
    # Force kill if still running
    if backend_process and backend_process.poll() is None:
        backend_process.kill()
    if frontend_process and frontend_process.poll() is None:
        frontend_process.kill()
    
    print("All servers stopped.")
    sys.exit(0)

def run_command(command, cwd=None, name='', shell=True):
    """Run a command and print its output in real-time"""
    print(f"Starting {name}...")
    print(f"Command: {command}")
    print(f"Working Directory: {cwd}")
    
    try:
        process = subprocess.Popen(
            command, 
            cwd=cwd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT, 
            text=True,
            shell=shell,
            universal_newlines=True
        )
        
        def print_output():
            try:
                for line in iter(process.stdout.readline, ''):
                    print(f"{name}: {line.strip()}")
            except Exception as e:
                print(f"Error in {name} output thread: {e}")
        
        # Start a thread to read output
        output_thread = threading.Thread(target=print_output)
        output_thread.daemon = True
        output_thread.start()
        
        return process
    except Exception as e:
        print(f"Failed to start {name}: {e}")
        return None

def main():
    global SERVERS_RUNNING
    
    # Maximum runtime (in seconds)
    MAX_RUNTIME = 300  # 5 minutes
    
    # Ensure we're in the project root
    project_root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_root)

    # Check system dependencies
    if not check_dependency('npm'):
        print("Error: npm is not installed. Please install Node.js and npm.")
        sys.exit(1)

    # Create virtual environment
    create_venv()

    # Prepare environment for subprocess calls
    venv_python = os.path.join(project_root, 'venv', 'Scripts', 'python.exe')
    venv_pip = os.path.join(project_root, 'venv', 'Scripts', 'pip.exe')

    # Upgrade pip
    subprocess.run([venv_python, '-m', 'pip', 'install', '--upgrade', 'pip'], check=True)

    # Install Python dependencies
    subprocess.run([venv_pip, 'install', '-r', 'requirements.txt'], check=True)

    # Frontend dependencies
    frontend_path = os.path.join(project_root, 'frontend')
    
    # Clean install frontend dependencies
    print("Cleaning and installing frontend dependencies...")
    subprocess.run(['npm', 'ci'], cwd=frontend_path, shell=True, check=True)

    # Backend server
    backend_process = run_command(
        f'{venv_python} backend/app.py', 
        name='BACKEND'
    )

    # Wait a moment to ensure backend is up
    time.sleep(2)

    # Frontend server
    print("Starting frontend server...")
    frontend_process = run_command(
        'npm start', 
        cwd=frontend_path, 
        name='FRONTEND'
    )

    # Start timer
    start_time = time.time()

    # Wait and monitor
    try:
        while SERVERS_RUNNING:
            # Check runtime
            current_time = time.time()
            if current_time - start_time > MAX_RUNTIME:
                print(f"\nMAX RUNTIME ({MAX_RUNTIME} seconds) EXCEEDED. Stopping servers.")
                terminate_processes(backend_process, frontend_process)
                break

            # Check if processes are still running
            if backend_process and backend_process.poll() is not None:
                print("Backend server stopped unexpectedly.")
                terminate_processes(backend_process, frontend_process)
                break

            if frontend_process and frontend_process.poll() is not None:
                print("Frontend server stopped unexpectedly.")
                terminate_processes(backend_process, frontend_process)
                break

            time.sleep(1)

    except KeyboardInterrupt:
        print("\nUser interrupted. Stopping servers.")
    finally:
        terminate_processes(backend_process, frontend_process)

if __name__ == '__main__':
    main()
