#!/usr/bin/env bash
# ==============================================================================
# TAURARO: Universal Space Exploration Health Monitoring & Autonomous Triage
# One-Command Dev Launcher for FastAPI Backend + Vite React Frontend
# ==============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "======================================================================"
echo " ★ TAURARO // NASA Space Apps Challenge 2026 Launcher"
echo " Universal Space Exploration Health Monitoring Platform"
echo "======================================================================"

# Clean shutdown handler for all background background subprocesses
cleanup() {
  echo ""
  echo ">>> Shutting down TAURARO mission console processes..."
  kill 0 2>/dev/null || true
  wait 2>/dev/null || true
  echo ">>> All TAURARO processes terminated cleanly."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Verify virtual environment
if [ ! -f "backend/venv/bin/uvicorn" ]; then
  echo "[-] Backend virtual environment missing. Please run:"
  echo "    python3 -m venv backend/venv && source backend/venv/bin/activate && pip install -r backend/requirements.txt"
  exit 1
fi

# 2. Verify frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
  echo "[*] Installing frontend dependencies..."
  (cd frontend && npm install)
fi

# 3. Start FastAPI Backend in Background
echo "[+] Starting FastAPI Telemetry Engine on http://0.0.0.0:8000..."
PYTHONPATH=. ./backend/venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait briefly for backend port to bind
sleep 1.5

# 4. Start Vite React Frontend in Background
echo "[+] Starting React Mission Console on http://localhost:5173..."
(cd frontend && npm run dev -- --port 5173) &
FRONTEND_PID=$!

echo ""
echo "======================================================================"
echo " 🛰️  TAURARO IS FULLY OPERATIONAL!"
echo "----------------------------------------------------------------------"
echo " 🖥️  Frontend Console:    http://localhost:5173"
echo " 🔌 Backend REST API:     http://localhost:8000/api/v1/health"
echo " 📖 Interactive Swagger:  http://localhost:8000/docs"
echo "======================================================================"
echo "Press Ctrl+C at any time to gracefully terminate all services."
echo ""

# Keep launcher process running to handle trap
wait

