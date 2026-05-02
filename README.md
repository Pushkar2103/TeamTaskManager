# Team Task Manager

A modern, full-stack web application for collaborative project and task management with role-based access control. Built with React, Express.js, and MongoDB.

## 🎯 Overview

Team Task Manager is a comprehensive project management platform designed to help teams organize, track, and manage projects and tasks efficiently. The application features role-based access control with Admin and Member roles, allowing administrators to manage teams and control project creation while members can focus on assigned tasks.

## ✨ Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control (RBAC)**:
  - **Admin Role**: Can create projects, manage members, view all tasks, and manage project teams
  - **Member Role**: Can view assigned projects and tasks, limited visibility for task management
- **Project Management**: Create, view, and manage projects with team collaboration
- **Task Management**: 
  - Organize tasks in a Kanban-style board (To Do, In Progress, Done)
  - Assign tasks to team members
  - Role-based task visibility
- **Team Member Management**: Add and remove team members from projects with confirmation dialogs
- **Dashboard Analytics**: Overview of projects, tasks, and work distribution
- **Member Search & Autocomplete**: Email-based user suggestions when adding team members

### Advanced Features
- Responsive design optimized for mobile, tablet, and desktop
- Real-time error notifications and success feedback
- Simplified dashboard focused on key metrics
- Secure API endpoints with authentication middleware

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with hooks and context API
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - NoSQL database and ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud like MongoDB Atlas)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Pushkar2103/TeamTaskManager.git
cd team-task-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo > .env

# Add environment variables (see Configuration section below)
# PORT=3000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key

# Start development server
npm run dev
# OR start production server
npm start
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:3000`.

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

The frontend communicates with the backend via Axios. The API base URL is configured in `src/api/axios.js`.

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── dashboardController.js # Dashboard stats and data
│   │   ├── projectController.js  # Project CRUD operations
│   │   └── taskController.js     # Task CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── roleMiddleware.js     # Role-based authorization
│   ├── models/
│   │   ├── User.js               # User schema (Admin/Member roles)
│   │   ├── Project.js            # Project schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── dashboardRoutes.js    # Dashboard endpoints
│   │   ├── projectRoutes.js      # Project endpoints
│   │   └── taskRoutes.js         # Task endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT token generation
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios configuration
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top navigation
│   │   │   ├── ProjectCard.jsx   # Project display card
│   │   │   └── TaskCard.jsx      # Task display card
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main dashboard page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── ProjectPage.jsx   # Project details & Kanban board
│   │   │   └── Signup.jsx        # Registration page
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Global styles
│   │   └── package.json
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── index.html                # HTML entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register a new user
- `POST /login` - Login user and get JWT token
- `GET /users` - Get list of all users (for autocomplete)

### Project Routes (`/api/projects`)
- `POST /` - Create new project (Admin only)
- `GET /` - Get all projects for user
- `GET /:id` - Get project details
- `POST /:id/members` - Add member to project
- `DELETE /:id/members/:memberId` - Remove member from project

### Task Routes (`/api/tasks`)
- `POST /` - Create new task in a project
- `GET /project/:projectId` - Get tasks for a project
- `PATCH /:id` - Update task details
- `DELETE /:id` - Delete a task

### Dashboard Routes (`/api/dashboard`)
- `GET /` - Get dashboard statistics and overview

## 👥 User Roles & Permissions

### Admin
- ✅ Create new projects
- ✅ View all tasks in their projects
- ✅ Manage project members
- ✅ Assign and manage tasks
- ✅ Delete projects and tasks

### Member
- ❌ Cannot create projects
- ✅ View only assigned tasks
- ✅ View projects they're part of
- ✅ Cannot manage other members
- ✅ Cannot manage tasks assigned to others

## 🎮 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with Admin or Member role
2. **Create a Project** (Admin only): Navigate to Dashboard and click "New Project"
3. **Add Team Members**: Open a project and click "Manage Members" to add users by email
4. **Create Tasks**: Add tasks to the project and assign them to team members
5. **Track Progress**: Use the Kanban board to move tasks between To Do, In Progress, and Done

### Dashboard
- View quick metrics on active projects and assigned tasks
- See overdue tasks that need attention
- Access all your projects
- (Admin) Create new projects

### Project Page
- **Kanban Board**: Drag and drop tasks between columns (To Do → In Progress → Done)
- **Member Management**: View project members and manage team
- **Task Details**: Click tasks to view full details
- **Admin Controls**: Only admins see all tasks and member management

## 🔐 Security Features

- **Password Hashing**: Bcrypt encryption for secure password storage
- **JWT Authentication**: Token-based stateless authentication
- **Role-Based Access Control**: Enforce permissions at controller level
- **Protected Routes**: API endpoints validate authentication and authorization
- **CORS Configuration**: Cross-origin requests controlled and restricted
