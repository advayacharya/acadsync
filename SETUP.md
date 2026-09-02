# AcadSync — End-to-End Manual Setup Checklist (`SETUP.md`)

This guide lists every single manual credential, secret key, environment variable, and setup step required to run **AcadSync** end-to-end locally or in production.

---

## Step-by-Step Configuration Guide

### 1. MongoDB Database Setup
- **What it is:** Database storage for users, tasks, course groupings, integration connections, and tickets.
- **Why it is needed:** AcadSync requires a MongoDB database connection string to persist data.
- **Where to get it:**
  - **Local MongoDB:** If you have MongoDB installed locally, use `mongodb://127.0.0.1:27017/acadsync`.
  - **MongoDB Atlas (Cloud):** Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) -> Create a free M0 cluster -> Database Access (create database user) -> Network Access (add IP `0.0.0.0/0` or your IP) -> Clusters -> Connect -> Drivers -> copy connection string.
- **Environment Variable:**
  - File: `acadsync/backend/.env`
  - Key: `MONGODB_URI`
  - Example: `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/acadsync?retryWrites=true&w=majority`

---

### 2. JWT Secret Key
- **What it is:** A secret cryptographic key used to sign and verify JSON Web Tokens for user login sessions.
- **Why it is needed:** Secures user authentication and API authorization header verification.
- **How to generate it:** Run this command in your terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Environment Variable:**
  - File: `acadsync/backend/.env`
  - Key: `JWT_SECRET`
  - Example: `JWT_SECRET=c3a19b8f2d5e...`

---

### 3. Token Encryption Key (AES-256-GCM)
- **What it is:** A 32-byte (64 hex characters) key used to encrypt third-party OAuth access and refresh tokens at rest in MongoDB.
- **Why it is needed:** Protects stored Google & Notion OAuth credentials from raw database exposure.
- **How to generate it:** Run this command in your terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Environment Variable:**
  - File: `acadsync/backend/.env`
  - Key: `TOKEN_ENCRYPTION_KEY`
  - Example: `TOKEN_ENCRYPTION_KEY=e4f92d8a6b1c3e...`

---

### 4. Google Cloud OAuth 2.0 Credentials
- **What it is:** OAuth 2.0 Client ID and Secret for Google Calendar API integration.
- **Why it is needed:** Enables 2-way Google Calendar synchronization (importing calendar events as tasks, and pushing tasks to Google Calendar).
- **Where to go:**
  1. Open [console.cloud.google.com](https://console.cloud.google.com).
  2. Create a new project (e.g. "AcadSync").
  3. Go to **APIs & Services -> Library** -> Search for **Google Calendar API** -> Click **Enable**.
  4. Go to **APIs & Services -> OAuth consent screen** -> Choose **External** -> Fill App name & User support email -> Add scope `https://www.googleapis.com/auth/calendar.readonly` (and full calendar scope if using full 2-way sync). Save.
  5. Go to **APIs & Services -> Credentials** -> Click **Create Credentials -> OAuth client ID**.
  6. Application type: **Web application**.
  7. **Authorized redirect URIs:** Add `http://localhost:5000/api/integrations/google/callback`.
  8. Click **Create** and copy the Client ID and Client Secret.
- **Environment Variables:**
  - File: `acadsync/backend/.env`
  - Keys:
    - `GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com`
    - `GOOGLE_CLIENT_SECRET=your_google_client_secret`
    - `GOOGLE_REDIRECT_URI=http://localhost:5000/api/integrations/google/callback`

---

### 5. Notion OAuth Credentials
- **What it is:** OAuth Client ID and Client Secret for Notion integration.
- **Why it is needed:** Enables users to connect Notion workspaces and import database rows into AcadSync.
- **Where to go:**
  1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations).
  2. Click **New integration**.
  3. Select your Associated Workspace.
  4. Type: **Public**.
  5. **Redirect URIs:** Add `http://localhost:5000/api/integrations/notion/callback`.
  6. Fill basic info and Submit.
  7. Copy the OAuth Client ID and Client Secret from the Secrets tab.
- **Environment Variables:**
  - File: `acadsync/backend/.env`
  - Keys:
    - `NOTION_CLIENT_ID=your_notion_client_id`
    - `NOTION_CLIENT_SECRET=your_notion_client_secret`

---

### 6. Application Base URLs
- **What it is:** Environment variables defining frontend and backend origin URLs for CORS, redirects, and API fetching.
- **Why it is needed:** Ensures correct CORS permissions and callback redirects in local development vs production deployment.
- **Environment Variables:**
  - **Backend file:** `acadsync/backend/.env`
    - `FRONTEND_URL=http://localhost:5173`
    - `BACKEND_URL=http://localhost:5000`
  - **Frontend file:** `acadsync/.env` (project root)
    - `VITE_API_URL=http://localhost:5000/api`

---

## Complete `.env` Reference Files

### Backend `.env` (`acadsync/backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/acadsync
JWT_SECRET=paste_generated_jwt_secret_here
TOKEN_ENCRYPTION_KEY=paste_generated_32_byte_token_encryption_key_here

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/integrations/google/callback

NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
```

### Frontend `.env` (`acadsync/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Running the Application

1. **Install Dependencies:**
   ```bash
   # Root directory (frontend)
   npm install

   # Backend directory
   cd backend
   npm install
   ```

2. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend Dev Server (in a new terminal):**
   ```bash
   # From project root
   npm run dev
   ```

4. **Verification:**
   - Open `http://localhost:5000/api/health` in your browser. Expected response: `{"status":"ok","env":"development"}`.
   - Open `http://localhost:5173` to access the AcadSync application.
