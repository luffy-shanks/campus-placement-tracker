# Campus Placement Tracker

A placement-management app for students and college placement administrators. The React frontend talks to an Express API, and user accounts, drives, applications, and student profiles are stored in MongoDB.

## Requirements

- Node.js 20.19 or newer (Node.js 22 LTS or 24 is recommended)
- npm
- MongoDB Community Server or a MongoDB Atlas cluster

## Run locally

1. Clone the repository and open its folder in a terminal.

   ```bash
   git clone https://github.com/luffy-shanks/campus-placement-tracker.git
   cd campus-placement-tracker
   ```

2. Install packages and create your local environment file.

   **Windows PowerShell:**

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

   **macOS / Linux:**

   ```bash
   npm install
   cp .env.example .env
   ```

3. Edit `.env` and set:

   - `MONGODB_URI` to your local MongoDB URI or Atlas connection string. For Atlas, replace the username, password, and database name; URL-encode special characters in the database password.
   - `JWT_SECRET` to a private random string of at least 32 characters. Generate one with:

     ```bash
     node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(48).toString('hex'))"
     ```

   - `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, and `BOOTSTRAP_ADMIN_PASSWORD` for the first administrator. Use a strong password. The backend creates this account only when the database has no administrator yet.
   - Leave `VITE_MOCK_MODE=false` to use the API and MongoDB. `VITE_API_BASE_URL=/api/v1` is correct for local development.

4. Make sure MongoDB is running. For Atlas, allow the development machine's IP address in Atlas Network Access and create a database user with read/write access to the application database.

5. Start the frontend and API together:

   ```bash
   npm run dev:full
   ```

6. Open [http://localhost:5173](http://localhost:5173). The API health endpoint is [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health).

The Vite development server proxies `/api` requests to the API on port `3001`. Stop both processes with `Ctrl+C`.

## Accounts and data

- The first administrator is created from the `BOOTSTRAP_ADMIN_*` settings when the database has no admin account. If an admin already exists, add another administrator from **Admin → Settings → Add administrator**.
- Students create accounts through the registration page. Admins can create placement drives and manage applications through the admin area.
- In API mode, the application reads and writes records in the configured MongoDB database. It does not automatically insert demo records at startup. The optional mock mode is only for local UI demonstrations; keep `VITE_MOCK_MODE=false` to use real database records.
- Drive application URLs are optional. When a drive has a URL, students can open the employer's form and then confirm completion in the tracker. Drives without a URL use the tracker application flow.
- Student resumes are stored by the API and are limited to 10 MB per file (PDF, DOC, or DOCX).
- Never commit `.env` or share its MongoDB URI, JWT secret, or administrator password. `.env` is ignored by Git.

## Environment variables

### Frontend

| Variable | Purpose | Local value |
| --- | --- | --- |
| `VITE_API_BASE_URL` | API base URL used by the frontend | `/api/v1` |
| `VITE_MOCK_MODE` | Use local demonstration data when `true`; use the API when `false` | `false` |

### API

| Variable | Purpose | Local value |
| --- | --- | --- |
| `PORT` | API listening port | `3001` |
| `CLIENT_ORIGIN` | Allowed frontend origin(s), comma-separated | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | Set this yourself |
| `JWT_SECRET` | Secret used to sign login tokens; minimum 32 characters | Set this yourself |
| `JWT_EXPIRES_IN` | Login token lifetime | `8h` |
| `BOOTSTRAP_ADMIN_NAME` | Name for the first admin account | `Placement Administrator` |
| `BOOTSTRAP_ADMIN_EMAIL` | Email for the first admin account | Set this yourself |
| `BOOTSTRAP_ADMIN_PASSWORD` | Password for the first admin account | Set this yourself |

Restart Vite and the API after changing environment variables.

## Deploy with Render

Create an API **Web Service** and a frontend **Static Site** from the GitHub repository.

### API Web Service

- Build command: `npm install`
- Start command: `npm run start:api`
- Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and the `BOOTSTRAP_ADMIN_*` variables in the service's Environment settings. Set `CLIENT_ORIGIN` to the deployed frontend URL.
- In MongoDB Atlas Network Access, allow connections from the API host. Use a least-privilege database user.

### Frontend Static Site

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Set `VITE_MOCK_MODE=false`.
- Set `VITE_API_BASE_URL` to the API URL followed by `/api/v1`, for example `https://your-api.onrender.com/api/v1`.
- Redeploy after changing frontend environment variables. Vite embeds these values when building the frontend.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the frontend only |
| `npm run dev:api` | Start the API with file watching |
| `npm run dev:full` | Start frontend and API together |
| `npm run start:api` | Start the API for deployment |
| `npm run build` | Build the production frontend in `dist/` |
| `npm run preview` | Preview the production frontend locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run utility tests |

## Main features

- Student registration, login, dashboard, placement drives, applications, and profile/resume management.
- Admin dashboard, drive management, student directory, application status management, company summaries, analytics, and admin account creation.
- Eligibility checks for branch, graduation year, CGPA, and active backlogs.
- Application status history, charts, search, filters, and responsive layouts.
- Express API with authenticated routes, role checks, MongoDB persistence, password hashing, and JWT sessions.
