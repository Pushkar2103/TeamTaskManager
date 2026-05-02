Team Task Manager

Overview:
Team Task Manager is a simple full-stack application for creating and tracking projects, tasks, and team members. It provides user authentication, role-based access, project dashboards, task assignment, and a clean frontend UI to manage day-to-day work.

Key Features:
- User registration, login, and JWT authentication
- Role-based access control (admin, manager, member)
- Create and manage projects and tasks
- Assign tasks to users, update status and priority
- Dashboard view showing projects and tasks

Repository Structure:
- backend/: Express API, controllers, models, routes, middleware
- frontend/: Vite + React app, components, pages, API client

Prerequisites:
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB or other configured DB (see backend config)

Environment Variables (backend/.env):
- PORT= (e.g., 5000)
- MONGO_URI=your_mongo_connection_string
- JWT_SECRET=your_jwt_secret_key
- CLIENT_URL=frontend_url (optional)

Quick Setup:
1) Backend
   - Open a terminal in the `backend` folder
   - Install dependencies:
     npm install
   - Create a `.env` file with the variables above
   - Start the server (development):
     npm run dev
   - Production start:
     npm start

2) Frontend
   - Open a terminal in the `frontend` folder
   - Install dependencies:
     npm install
   - Start the dev server:
     npm run dev
   - Build for production:
     npm run build

Common Commands:
- Backend tests (if present): run `npm test` in `backend`
- Lint/format (frontend/backend): run configured lint/format scripts

API Notes:
- Authentication endpoints: `/api/auth/signup`, `/api/auth/login`
- Projects endpoints: `/api/projects` (CRUD)
- Tasks endpoints: `/api/tasks` (CRUD, assignment, status updates)
- Protect routes with the provided auth middleware and role middleware

Deployment Tips:
- Use environment variables on the server/host
- Build the frontend and serve statically (Netlify, Vercel, or serve from backend)
- Ensure your database is reachable from the deployed app

Contributing:
- Create feature branches from `main` or `master`
- Open PRs with clear descriptions and testing steps

License:
- Add your license details here (MIT, Apache-2.0, etc.)

Contact:
- Project author / maintainer: add name and email or GitHub handle

Notes:
- Update this text with exact commands or port numbers if your project uses custom scripts or ports.
