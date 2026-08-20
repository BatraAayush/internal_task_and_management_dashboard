# Internal Task & Management Dashboard

A full-stack internal management dashboard engineered to organize team workflows, track task completion metrics, manage assignments, and ingest partner directory data.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Python 3.10+, FastAPI, SQLAlchemy (ORM), Pydantic v2, Uvicorn, HTTPX
- **Database:** SQLite (Default for zero-friction local setup, fully compatible with PostgreSQL)

---

## Project Structure

```text
internal_task_and_management_dashboard/
├── backend/
│   ├── app/
│   │   ├── api/          # Route controllers & dependency injection (v1 endpoints)
│   │   ├── core/         # DB engine & Pydantic application settings
│   │   ├── models/       # SQLAlchemy ORM models (User, Task, Comment)
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── repositories/ # Isolated database queries
│   │   └── services/     # Business logic & external API integration
│   ├── main.py           # FastAPI entrypoint
│   ├── seed.py           # Database seeding script
│   ├── requirements.txt  # Python backend dependencies
│   └── .env              # Backend environment configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI kit (Buttons, Badges, Modals, Pagination)
│   │   ├── pages/        # Dashboard, Task Directory, External Directory views
│   │   ├── services/     # Central Axios API client
│   │   ├── types/        # TypeScript interfaces & types
│   │   ├── utils/        # Tailwind merge helpers
│   │   ├── App.tsx       # Root view router
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

---

### 2. Backend Setup

1. Open your terminal and navigate to the backend directory:
   cd backend

2. Create and activate a Python virtual environment:
   #### Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\activate

    macOS / Linux:
    python3 -m venv venv
    source venv/bin/activate

3. Install required Python packages:
   pip install -r requirements.txt

4. Populate the database with realistic sample tasks, users, and comments:
   python seed.py

5. Start the FastAPI development server:
   uvicorn main:app --reload --port 8000
   
   - Backend Base URL: http://127.0.0.1:8000
   - Interactive API Docs (Swagger): http://127.0.0.1:8000/docs

---

### 3. Frontend Setup

1. Open a separate terminal tab and navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the Vite development server:
   npm run dev

   - Frontend Application URL: http://localhost:5173

---

## Environment Variables

### Backend Configuration (backend/.env)
PROJECT_NAME="Internal Task & Management API"
API_V1_STR="/api"
DATABASE_URL="sqlite:///./task_manager.db"
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
EXTERNAL_API_BASE_URL="https://jsonplaceholder.typicode.com"

### Frontend Configuration (frontend/.env)
VITE_API_BASE_URL="http://127.0.0.1:8000/api"

---

## REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/dashboard | Aggregated counts for Total, Pending, In Progress, Completed, Blocked, Overdue, and Assigned tasks. |
| GET | /api/tasks | Paginated task list supporting query parameters: search, status, priority, assignee, page, limit, sort_by, sort_order. |
| POST | /api/tasks | Create a new task with validation. |
| GET | /api/tasks/{id} | Fetch full task details, assigned user info, and threaded comments. |
| PUT | /api/tasks/{id} | Update task title, description, status, priority, due date, or assignee. |
| DELETE | /api/tasks/{id} | Delete a task (cascades to related comments). |
| GET | /api/tasks/{id}/comments | Fetch all notes and comments for a specific task. |
| POST | /api/tasks/{id}/comments | Add a comment/note to a task. |
| GET | /api/users | List internal team members. |
| POST | /api/users | Create an internal user profile. |
| GET | /api/external/users | Public API integration (fetches external partner directory with timeouts and error handling). |

---

## Key Assumptions & Design Choices

- Database: SQLite is configured by default for immediate local testing without requiring external database provisioning. The architecture uses SQLAlchemy ORM, so switching to PostgreSQL only requires changing the DATABASE_URL in backend/.env.
- User Context: A mock active user session is passed via the X-User-ID header (defaulting to user 1), powering the "Tasks Assigned to Current Session" metrics on the dashboard.
- Resilience: The external API integration handles network timeouts (8s threshold), connection failures, and translates upstream payloads into structured internal schemas.