# Notely

This is a full-stack note-taking application built to match the provided design PDF.
Drop in your `.env` files (server & client) and run the app locally.

## Quick start

### Server

```bash
cd server
cp .env.example .env   # fill MONGODB_URI, SMTP, GOOGLE_CLIENT_ID, JWT secrets
npm install
npm run dev
```

### Client

```bash
cd client
cp .env.example .env   # set VITE_API_URL and VITE_GOOGLE_CLIENT_ID (optional)
npm install
npm run dev
```

Open http://localhost:5173
