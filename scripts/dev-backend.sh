#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
VENV_DIR="$BACKEND_DIR/.venv"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8010}"

cd "$BACKEND_DIR"

if [[ ! -x "$VENV_DIR/bin/python" ]]; then
  echo "Creating backend virtual environment..."
  python3 -m venv "$VENV_DIR"
fi

PYTHON="$VENV_DIR/bin/python"
PIP="$VENV_DIR/bin/pip"

echo "Installing backend dependencies..."
"$PIP" install -r requirements.txt

echo "Starting GeoWeaver backend at http://$HOST:$PORT"
exec "$PYTHON" -m uvicorn app.main:app --reload --host "$HOST" --port "$PORT"
