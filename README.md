# Project Task Management App

A simple Project & Task Management application where users can manage projects and their associated tasks.

## Tech Stack

- **Backend**: ASP.NET Core Web API (.NET 9.0), Entity Framework Core (Code-First)
- **Database**: MySQL
- **Frontend**: Angular 21
- **Version Control**: Git (GitHub)

## Features

- ✅ Manage Projects (create/list/update/delete)
- ✅ Manage Tasks within Projects (create/list/update/delete)
- ✅ View and update task status
- ✅ Filter tasks by status
- ✅ Clean code architecture with services and models

## Domain Model

### Project
- Id (GUID, primary key)
- Name (string, required, max 100 characters)
- Description (string, optional)
- CreatedAt (DateTime, auto-generated)

### TaskItem
- Id (GUID, primary key)
- ProjectId (GUID, foreign key)
- Title (string, required, max 150 characters)
- Description (string, optional)
- Status (enum: Todo | InProgress | Done)
- DueDate (DateTime, optional)
- CreatedAt (DateTime, auto-generated)

**Relationship**: One Project has many TaskItems (one-to-many)

## Project Structure

```
project-task-management-app/
├── backend/
│   └── ProjectTaskManagementApp.Api/     # ASP.NET Core Web API
│       ├── Controllers/
│       ├── Models/
│       ├── Data/
│       └── appsettings.json
├── frontend/                              # Angular 21 application
│   ├── src/
│   ├── package.json
│   └── angular.json
└── README.md
```

## Prerequisites

Before running this application, ensure you have the following installed:

- **.NET SDK 9.0** or later - [Download](https://dotnet.microsoft.com/download)
- **Node.js 18+** and **npm 10+** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/csia-gh/project-task-management-app.git
cd project-task-management-app
```

### 2. Configure Database Connection

Open `backend/ProjectTaskManagementApp.Api/appsettings.json` and update the connection string with your MySQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=ProjectTaskManagementDb;User=your_username;Password=your_password;"
  }
}
```

Replace `your_username` and `your_password` with your MySQL credentials.

Make sure MySQL server is running and the specified user has permissions to create databases.

### 3. Setup and Run Backend

```bash
cd backend/ProjectTaskManagementApp.Api

# Restore dependencies
dotnet restore

# Run the application with HTTPS (migrations will apply automatically on startup)
dotnet run --launch-profile https
```

The API will start at **`https://localhost:7140`**.

**Note**: The database schema will be created/updated automatically on startup.

### 4. Access Swagger UI

Once the backend is running, you can explore the API documentation at:

```
https://localhost:7140/swagger
```

### 5. Setup and Run Frontend

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The Angular app will start at **`http://localhost:4200`**

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:4200
```

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/projects/{projectId}/tasks` - List all tasks for a project
- `GET /api/projects/{projectId}/tasks?status=Done` - Filter tasks by status
- `GET /api/taskitems/{id}` - Get task by ID
- `POST /api/taskitems` - Create new task
- `PUT /api/taskitems/{id}` - Update task
- `DELETE /api/taskitems/{id}` - Delete task

## Development

### Backend Development

```bash
cd backend/ProjectTaskManagementApp.Api
dotnet watch run --launch-profile https
```

The API will auto-reload on code changes.

### Frontend Development

```bash
cd frontend
npm start
```

The Angular app will auto-reload on code changes.

## Troubleshooting

### Database Connection Issues
- Ensure MySQL server is running
- Verify connection string credentials in `appsettings.json`
- Check that the MySQL user has sufficient permissions

### Port Already in Use
- Backend: Change the port in `Properties/launchSettings.json`
- Frontend: Run `ng serve --port 4201` to use a different port

### Migration Issues
- Delete the database and restart the application to recreate it
