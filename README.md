# Campus Placement Tracker

A responsive React application for students and placement administrators. It includes a React frontend and an Express/MongoDB API. The frontend keeps local mock mode enabled unless `VITE_MOCK_MODE=false` is set.

## Requirements

- Node.js 20.19 or newer
- npm
- MongoDB Community Server locally, or a MongoDB Atlas connection string

## Setup

```powershell
npm install
Copy-Item .env.example .env
# Edit .env: set MONGODB_URI and replace JWT_SECRET and the bootstrap password.
npm run dev:full
```

The frontend runs at `http://localhost:5173` and proxies `/api` to the backend on port `3001`.

## Mock mode accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@example.com` | `password123` |
| Admin | `admin@example.com` | `admin123` |

These credentials work only when `VITE_MOCK_MODE` is enabled. In API mode, the first admin is created using the `BOOTSTRAP_ADMIN_*` values in `.env`; students create accounts through Student Registration.

## Environment

`MONGODB_URI` points to your MongoDB database. `JWT_SECRET` must be a private random value of at least 32 characters. `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` create the first administrator only when the database has no admin yet. Change the example credentials before running the server. `VITE_API_BASE_URL` defaults to `/api/v1`; set `VITE_MOCK_MODE=false` to send service calls to the API. Restart Vite after changing environment variables.

Mock changes are held in browser memory and reset on a full page reload. Backend accounts and records persist in MongoDB. The backend hashes passwords with bcrypt and uses expiring JWT bearer tokens. Admin account creation is restricted by the backend to an authenticated admin.

## Commands

- `npm run dev` starts Vite.
- `npm run dev:api` starts the API with Node's watch mode.
- `npm run dev:full` starts Vite and the API together.
- `npm run start:api` starts the API without watch mode.
- `npm run seed:sample-drives` adds the six sample placement drives from the admin drive examples to the MongoDB database configured in `.env`. It skips a company/role pair that already exists.
- `npm run publish:sample-drives` publishes those six sample drives through the live API. Set `CPT_ADMIN_EMAIL` and `CPT_ADMIN_PASSWORD` in the shell first; the command checks for existing company/role pairs and skips them.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` previews the production bundle.
- `npm run lint` runs ESLint across the project.
- `npm test` runs the utility unit tests with Node's built-in test runner.

The lint configuration uses ESLint's core recommended rules. The built-in parser's unused-variable rule is disabled because it does not count JSX component tags as variable references.

## Application areas

- Public landing, login, and student registration pages.
- Student dashboard, drives, applications, and profile.
- Admin dashboard, drive management, students, applications, companies, analytics, and settings.
- Service modules in `src/services/` isolate API and mock data access.
- The API is in `server/`; its current routes cover login/registration, admin provisioning, students, drives, applications, companies, and analytics.
- Student resumes can be uploaded, retrieved, or deleted through the authenticated profile API; the database keeps resume files up to 10 MB.
- Shared UI primitives in `src/components/common/` and date, status, and eligibility helpers in `src/utils/`.
