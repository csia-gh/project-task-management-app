# Project Task Management App

Simple Project & Task Management application with:
- ASP.NET Core Web API backend (.NET 10)
- Angular frontend (Angular 21)
- MySQL database


## Project Structure

- **project-task-management-app/**
  - **backend/** - ASP.NET Core Web API
  - **frontend/** - Angular frontend
  - **README.md**


## Setup Instructions

### 1. Clone the repository
```bash
git clone 
cd ProjectTaskManagementApp
```

### 2. Configure Database Connection
Open `backend/ProjectTaskManagementApp.Api/appsettings.json` and update the connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ProjectTaskManagementDb;User=root;Password=your_password;"
  }
}
```

### 3. Run the Backend
```bash
cd backend/ProjectTaskManagementApp.Api
dotnet restore
dotnet run
```

The API will start at `https://localhost:7140` (or similar).

**Note:** Migrations will be applied automatically on startup.

### 4. Access Swagger UI
```
https://localhost:7140/swagger
```