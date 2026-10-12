# User Directory

A small full-stack CRUD application built with React and ASP.NET Core 8 Web API, using SQLite for persistent storage.

## Stack and structure

- `frontend/` — React 18, Vite, React Router, Axios and plain CSS. Contains List Users and Add User pages, client-side validation, loading/empty/error states, and a success notification.
- `backend/UserDirectory.Api/` — ASP.NET Core 8 controller API, EF Core SQLite, data annotations, Swagger/OpenAPI, and CORS for the local Vite origin.
- `GET /api/users`, `GET /api/users/{id}`, `POST /api/users`, `PUT /api/users/{id}`, `DELETE /api/users/{id}` are implemented.

## Run locally

Prerequisites: .NET 8 SDK, Node.js 20+ and npm.

1. Start the API in terminal one:
   ```bash
   cd backend/UserDirectory.Api
   dotnet restore
   dotnet run
   ```
   API: `http://localhost:5080`; Swagger: `http://localhost:5080/swagger`; health check: `http://localhost:5080/health`.
2. Start the React app in terminal two:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173`. To use another API URL, set `VITE_API_BASE_URL` before starting Vite (see `.env.example`).

SQLite is created automatically on first API start. The default path is `backend/UserDirectory.Api/data/app.db` relative to the API working directory. Override it with `Database:Path` configuration or the `DB_PATH` environment variable, e.g. `DB_PATH=/data/app.db` on Linux. Ensure the parent directory is writable.

## Validation and API behavior

Name is required and 2–100 characters; age is an integer from 0–120; city and state are required; pincode is required and 4–10 characters. The UI shows inline validation messages, while the API validates incoming models. Successful create returns `201 Created`; invalid input returns `400 Bad Request`; missing records return `404 Not Found`; successful delete returns `204 No Content`. The list uses `200 OK` and shows a loading state, empty state, and retryable connection errors.

## Security and scope

Authentication is intentionally not included because OAuth2/OIDC is a bonus requirement. The sample is intended for local development, not production deployment. For production, configure trusted CORS origins, authentication/authorization, HTTPS, secrets management, logging, and database migrations. SQLite schema initialization uses `EnsureCreated()` to keep the exercise easy to run; migrations are preferable for evolving production schemas.

## AI/tools disclosure

AI assistance (ChatGPT) was used to help scaffold and review the project structure and implementation. Technologies used: React, Vite, React Router, Axios, plain CSS, C#, ASP.NET Core 8, Entity Framework Core, SQLite, and Swagger/OpenAPI. Review the code, run the application and be prepared to explain the design choices before submitting.
