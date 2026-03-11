#!/bin/bash
set -e

echo "========================================"
echo "  100xMoney - Setting up dev environment"
echo "========================================"

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd /workspace/frontend
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd /workspace/backend
pip install -r requirements.txt

# Install AI engine dependencies
echo "Installing AI engine dependencies..."
cd /workspace/ai-engine
pip install -r requirements.txt

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until pg_isready -h localhost -p 5432 -U postgres 2>/dev/null; do
  sleep 1
done

# Run database migrations
echo "Running database migrations..."
cd /workspace/backend
alembic upgrade head 2>/dev/null || echo "No migrations to run yet"

# Seed development data
echo "Seeding development data..."
python -c "print('Dev seed placeholder - add seed script later')" 2>/dev/null || true

# Copy environment template
if [ ! -f /workspace/.env ]; then
  cp /workspace/.env.example /workspace/.env 2>/dev/null || echo "No .env.example found"
fi

echo "========================================"
echo "  Setup complete! Happy coding!"
echo "========================================"
echo ""
echo "  Frontend: cd frontend && npm run dev"
echo "  Backend:  cd backend && uvicorn app.main:app --reload --port 4000"
echo "  AI:       cd ai-engine && uvicorn app.main:app --reload --port 8000"
echo ""
