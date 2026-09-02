# AcadSync — Intelligent Student Task & Deadline Manager

AcadSync is a full-stack academic management application designed to help students track deadlines, calculate dynamic task priorities, generate automated study schedules, and integrate bidirectionally with Google Calendar and Notion.

## Features
- **Dynamic Task Priority Scoring:** Automatically calculates task priority based on type (Exam, Assignment, Lab, Quiz), weightage, difficulty, and deadline urgency.
- **Automated Study Planner:** Generates daily study allocation schedules based on available study hours and priority rankings.
- **Calendar & Timeline View:** Monthly visual grid mapping academic deadlines.
- **Integrations:** OAuth 2.0 single-use connect handshake for Google Calendar (one-way sync active, 2-way ready) and Notion.
- **Security Hardened:** AES-256-GCM encrypted tokens at rest, short-lived single-use OAuth connect tickets, Zod request body validation, IP rate limiting, Helmet security headers, and mass-assignment protection.

---

## Technical Architecture

### Tech Stack
- **Frontend:** React 19, Vite, React Router v6, Tailwind CSS, Lucide Icons, Lottie React.
- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT, Zod, Pino, Helmet, Express Rate Limit.
- **Testing:** Jest, Supertest, MongoDB Memory Server.

### Directory Structure
```
acadsync/
├── backend/
│   ├── config/          DB connection setup
│   ├── controllers/     API endpoints logic
│   ├── errors/          Custom error hierarchy (NotFoundError, ValidationError, etc.)
│   ├── middleware/      Auth, Rate limiting, Validation & Central Error Handling
│   ├── models/          Mongoose schemas (User, Task, Integration, ConnectTicket)
│   ├── routes/          Express route definitions
│   ├── services/        Business & crypto services
│   ├── tests/           Jest & Supertest test suites
│   ├── utils/           Logger, Token Crypto, Priority calculation, Google OAuth
│   └── validators/      Zod schema validators
├── src/
│   ├── components/      Reusable UI (Card, Button, Badge, MetricCard, Toast) & Layout (Sidebar, MobileNav, AppShell)
│   ├── features/        Feature modules (auth, dashboard, calendar, planner, tasks, integrations)
│   ├── hooks/           Custom state hooks (useAuth, useTasks)
│   ├── lib/             Design tokens (forest + clay theme)
│   ├── services/        Centralized API client
│   ├── App.jsx          App shell & Router composition
│   └── main.jsx         Entry point
```

---

## Setup & Environment Configuration

### Prerequisites
- Node.js >= 18.0.0
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Install Dependencies

```bash
# Frontend dependencies (root)
cd acadsync
npm install

# Backend dependencies
cd backend
npm install
```

### 2. Environment Variables Configuration

#### Backend `.env` (`acadsync/backend/.env`)
Copy `backend/.env.example` to `backend/.env` and populate:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/acadsync
JWT_SECRET=your_secret_key_here
TOKEN_ENCRYPTION_KEY=64_char_hex_or_32_byte_string_here
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/integrations/google/callback

NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
```

#### Frontend `.env` (`acadsync/.env`)
Copy `.env.example` to `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## OAuth Ticket & Handshake Flow

To protect user authentication tokens from appearing in URL parameters or server access logs during OAuth redirects:
1. **Authenticated Frontend Request:** The client makes an authenticated request (`POST /api/integrations/:platform/ticket`) with a JWT `Bearer` token.
2. **Single-Use Ticket Minting:** The backend generates a random 32-byte ticket stored in the `ConnectTicket` collection with a 2-minute TTL.
3. **Redirect Handshake:** The browser opens `/api/integrations/:platform/connect?ticket=<ticket_string>`.
4. **Ticket Consumption:** The backend finds and atomically deletes (`findOneAndDelete`) the ticket, retrieving the associated `userId` for the OAuth consent redirect.
5. **Encrypted Persistence:** Exchanged access and refresh tokens are encrypted at rest with AES-256-GCM using `TOKEN_ENCRYPTION_KEY`.

---

## Running the Application

### Development Mode

```bash
# Run backend (terminal 1)
cd backend
npm run dev

# Run frontend (terminal 2)
cd ..
npm run dev
```

### Running Backend Tests

```bash
cd backend
npm test
```
