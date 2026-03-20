# Chat-App_1203

Full-stack chat application with a React + TypeScript (Vite) frontend and an ASP.NET Core Web API backend. Includes a PostgreSQL database setup via Docker Compose (plus pgAdmin).

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** ASP.NET Core Web API (**.NET `net10.0`**), JWT Authentication, Swagger/OpenAPI
- **Database:** PostgreSQL (Docker)
- **Tools:** Docker Compose, pgAdmin

## Repository structure

- `frontend/` — React + TypeScript + Vite client
- `backend/` — .NET solution (API + Application + Domain + Infrastructure)
- `docker-compose.yml` — local Postgres + pgAdmin

## Getting started (local)

### Prerequisites

- Node.js + npm
- .NET SDK (supports `net10.0`)
- Docker (optional, for Postgres)

### 1) Start PostgreSQL (recommended)

From the repo root:

```bash
docker compose up -d
```

Postgres: `localhost:5432`  
pgAdmin: `http://localhost:5050`

Default credentials (from `docker-compose.yml`):

- Postgres user: `admin`
- Postgres password: `password`
- Database: `ChatDb`
- pgAdmin email: `admin@admin.com`
- pgAdmin password: `password`

### 2) Run the backend API

```bash
cd backend/ChatApp.API

dotnet restore
dotnet run
```

- Swagger UI should be available when running in Development.
- The API seeds the database on startup.

Config references:

- Connection string: `backend/ChatApp.API/appsettings.json`
- JWT settings: `backend/ChatApp.API/appsettings.json`

### 3) Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server: `http://localhost:5173`

> Note: CORS in the backend is configured to allow `http://localhost:5173`.

## Configuration

### Backend

Update as needed in `backend/ChatApp.API/appsettings.json`:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`

## API authentication

The backend uses **JWT Bearer authentication**. For protected endpoints, send:

```text
Authorization: Bearer <token>
```

Swagger UI is configured with a Bearer token scheme.

## Frontend scripts

- `npm run dev` — start dev server
- `npm run build` — typecheck + build
- `npm run preview` — preview production build

## Notes

- `frontend/README.md` currently contains the default Vite template README.

## License

Add a license if you plan to publish this project.
