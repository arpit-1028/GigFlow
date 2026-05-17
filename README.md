# 🌐 GigFlow: Smart Leads Dashboard

GigFlow is a production-grade, secure, and modern full-stack **Lead Acquisition, Routing, and Classification Engine**. It is built using clean architecture with a **TypeScript MERN Stack (React 19 + TypeScript + Node.js + Express + MongoDB)** and styled with a custom deep-dark HSL glassmorphism design system.

---

## 🚀 Deployment Links (Production Ready)
- **Frontend App (Vercel)**: `https://gigflow-leads.vercel.app` *(Replace with your deployed URL)*
- **Backend API (Render)**: `https://gigflow-api.onrender.com` *(Replace with your deployed URL)*
- **GitHub Repository**: `https://github.com/your-username/GigFlow` *(Replace with your repository URL)*

---

## 🏗️ System Architecture & Directories
GigFlow separates backend business controllers from frontend user views:
```
/GigFlow
  ├── docker-compose.yml       # Global orchestration script
  ├── /backend                 # Node.js + Express + Mongoose + Zod API
  │     ├── /src
  │     │     ├── /config      # Mongo connection & config
  │     │     ├── /controllers # Router handles
  │     │     ├── /middleware  # JWT guard, Role RBAC, Errors
  │     │     ├── /models      # Database collections
  │     │     ├── /routes      # Endpoint bindings
  │     │     ├── /services    # Core business controllers logic
  │     │     └── server.ts    # Boot entrypoint
  │     ├── .env.example
  │     └── Dockerfile
  │
  └── /frontend                # React 19 + TypeScript + Vite Webapp
        ├── /src
        │     ├── /api         # Axios endpoints
        │     ├── /components  # Reusable elements (forms, layouts)
        │     ├── /context     # JWT token state provider
        │     ├── /hooks       # Search & CRUD hooks
        │     ├── /pages       # Dashboard, lists, details
        │     ├── /types       # Type declarations
        │     ├── /utils       # CSV converter
        │     ├── index.css    # CSS custom design system
        │     └── main.tsx
        ├── .env.example
        └── Dockerfile
```

---

## 🔐 Environment Variables (`.env.example`)

### Backend Setup (`/backend/.env.example`)
Create a `/backend/.env` file with these values:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gigflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend Setup (`/frontend/.env.example`)
Create a `/frontend/.env` file:
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📖 API Documentation & Endpoints

All backend routes are validated using **Zod** schema guards, returning standard payloads:

### 1. Authentication Routes (`/api/auth`)
* **`POST /api/auth/register`** — Registers a new user.
  - **Body**: `{ "name": "Arpit", "email": "arpit@gmail.com", "password": "secure123", "role": "admin" }`
  - **Returns**: `{ "success": true, "data": { "token": "...", "user": { "id": "...", "name": "...", "role": "admin" } } }`
* **`POST /api/auth/login`** — Authenticates a user.
  - **Body**: `{ "email": "arpit@gmail.com", "password": "secure123" }`
  - **Returns**: JWT token and user profile objects.
* **`POST /api/auth/logout`** — Invalidates user token by adding it to an active blacklist cache.
  - **Headers**: `Authorization: Bearer <token>`

### 2. Lead Routes (`/api/leads`) *(Requires JWT header)*
* **`GET /api/leads`** — Fetches filtered, search-indexed, paginated leads.
  - **Params**: `page`, `limit`, `search`, `status` (`New` | `Contacted` | `Qualified` | `Lost`), `source` (`Website` | `Instagram` | `Referral`).
  - **Returns**: `{ "success": true, "data": [...], "meta": { "total": 10, "page": 1, "pages": 2 } }`
* **`GET /api/leads/stats`** — Returns metric summaries & source distribution.
* **`POST /api/leads`** — Creates a new lead.
  - **Body**: `{ "name": "Lead Name", "email": "lead@gmail.com", "status": "New", "source": "Website", "notes": "Details" }`
* **`GET /api/leads/:id`** — Returns single lead object.
* **`PUT /api/leads/:id`** — Updates a lead profile.
* **`DELETE /api/leads/:id`** — *(Admin only)* Deletes a lead.

---

## 🚀 Local Run Guide

### Option A: Run manually (Development Mode)
1. **Database**: Make sure a local MongoDB is listening on `27017` or use MongoDB Atlas.
2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Option B: Docker Compose
Boot the entire multi-container service in detached background mode:
```bash
docker-compose up --build -d
```

---

## ☁️ Deployment Guide (Step-by-Step)

### 1. Backend API (Deploying to Render)
**Render** is ideal for deploying your Express API and database connection.

1. **Push your code to GitHub**: Create a repository and push your entire `GigFlow` folder.
2. **Log into Render**: Access [render.com](https://render.com) and click **New > Web Service**.
3. **Connect Repository**: Link your GitHub repo.
4. **Configure Settings**:
   - **Name**: `gigflow-api`
   - **Root Directory**: `backend` *(Extremely Important)*
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Add Environment Variables** (Under the "Env Groups" or "Environment" tab):
   - `PORT` = `10000` *(Render handles port binding)*
   - `MONGODB_URI` = `mongodb+srv://...` *(Your Atlas Connection string)*
   - `JWT_SECRET` = `your_super_secret_jwt_key`
   - `NODE_ENV` = `production`
6. **Click Deploy**. Copy your deployed URL (e.g. `https://gigflow-api.onrender.com`).

---

### 2. Frontend React Client (Deploying to Vercel)
**Vercel** is the gold standard for hosting Vite/React client-side builds.

1. **Log into Vercel**: Access [vercel.com](https://vercel.com) and click **Add New > Project**.
2. **Connect Repository**: Choose your `GigFlow` repo.
3. **Configure Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Extremely Important)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Add Environment Variables**:
   - `VITE_API_URL` = `https://gigflow-api.onrender.com/api` *(Your deployed Render API URL)*
5. **Click Deploy**. Vercel will build your static React client and give you a public URL (e.g., `https://gigflow-leads.vercel.app`).
