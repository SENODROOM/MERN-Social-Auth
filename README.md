# MERN Social Auth — Complete Guide

A full-stack MERN application with OAuth 2.0 authentication via **Google, Facebook, GitHub, LinkedIn, and Instagram**.

---

## 📁 Project Structure

```
mern-social-auth/
├── server/                  ← Express + MongoDB backend
│   ├── config/
│   │   └── passport.js      ← ALL OAuth strategies live here
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT verification
│   ├── models/
│   │   └── User.js          ← MongoDB user schema
│   ├── routes/
│   │   └── auth.js          ← OAuth routes + /me endpoint
│   ├── index.js             ← Server entry point
│   ├── .env.example         ← Copy to .env and fill in credentials
│   └── package.json
│
└── client/                  ← React frontend
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js ← Global auth state (user, logout, etc.)
    │   ├── pages/
    │   │   ├── Login.js       ← Social login buttons
    │   │   ├── Dashboard.js   ← Protected user profile page
    │   │   └── AuthSuccess.js ← Receives JWT after OAuth redirect
    │   ├── App.js             ← Routes
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
# Backend
cd server
cp .env.example .env
# Edit .env and fill in your credentials (see Section below)

# Frontend
cd ../client
cp .env.example .env
# Edit REACT_APP_API_URL if backend is not on localhost:5000
```

### 3. Start MongoDB

```bash
mongod
# Or use MongoDB Atlas — paste the connection string into MONGO_URI
```

### 4. Start the App

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm start
```

Open http://localhost:3000

---

## 🔐 How OAuth Authentication Works (Step by Step)

```
User clicks "Continue with Google"
    │
    ▼
Browser → GET /api/auth/google                   (Express)
    │         Passport redirects to Google
    ▼
Google OAuth Consent Screen
    │         User approves
    ▼
Google → GET /api/auth/google/callback           (Express)
    │         Passport receives user profile
    │         findOrCreateUser() runs in MongoDB
    │         JWT is generated (7-day expiry)
    ▼
Express → Redirects to /auth/success?token=<JWT> (React)
    │
    ▼
AuthSuccess.js reads token from URL
    │         Stores it in localStorage
    │         Calls /api/auth/me to fetch user data
    ▼
User lands on /dashboard — authenticated ✅
```

### JWT Flow for Protected Routes

```
React Component
    │  localStorage.getItem("token")
    ▼
axios.get("/api/auth/me", {
  headers: { Authorization: "Bearer <token>" }
})
    │
    ▼
authMiddleware.js → jwt.verify(token, JWT_SECRET)
    │  Attaches req.userId
    ▼
Route handler → User.findById(req.userId)
    │
    ▼
Returns user JSON to React
```

---

## 🔑 Getting OAuth Credentials

### Google
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Google+ API" or "Google Identity"
4. Go to **Credentials → Create OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy **Client ID** → `GOOGLE_CLIENT_ID`
8. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

### Facebook
1. Go to https://developers.facebook.com/
2. Create a new App → **Consumer** type
3. Add **Facebook Login** product
4. Settings → Valid OAuth Redirect URIs: `http://localhost:5000/api/auth/facebook/callback`
5. Copy **App ID** → `FACEBOOK_APP_ID`
6. Copy **App Secret** → `FACEBOOK_APP_SECRET`

### GitHub
1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Homepage URL: `http://localhost:3000`
4. Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
5. Copy **Client ID** → `GITHUB_CLIENT_ID`
6. Generate **Client Secret** → `GITHUB_CLIENT_SECRET`

### LinkedIn
1. Go to https://www.linkedin.com/developers/
2. Create App → fill in details
3. Auth tab → Add redirect URL: `http://localhost:5000/api/auth/linkedin/callback`
4. Request products: **Sign In with LinkedIn using OpenID Connect**
5. Copy **Client ID** → `LINKEDIN_CLIENT_ID`
6. Copy **Client Secret** → `LINKEDIN_CLIENT_SECRET`

### Instagram
1. Go to https://developers.facebook.com/
2. Create a new App → **Consumer** type
3. Add **Instagram Basic Display** product
4. Add redirect URI: `http://localhost:5000/api/auth/instagram/callback`
5. Copy **Instagram App ID** → `INSTAGRAM_CLIENT_ID`
6. Copy **Instagram App Secret** → `INSTAGRAM_CLIENT_SECRET`

---

## 🚫 How to Disable a Provider

Disabling a provider requires changes in **3 places**. Each place has a comment marking exactly where to make the change.

### Example: Disabling Instagram

#### Step 1 — `server/config/passport.js`
```js
// Comment out or delete this entire block:
if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
  // ... entire Instagram strategy block
}
```

#### Step 2 — `server/routes/auth.js`
```js
// Comment out or delete these two routes:
router.get("/instagram", passport.authenticate("instagram", ...));
router.get("/instagram/callback", passport.authenticate("instagram", ...), handleOAuthCallback);
```

#### Step 3 — `client/src/pages/Login.js`
```js
// Comment out or delete this SocialButton:
<SocialButton
  provider="instagram"
  label="Instagram"
  bgColor="#E1306C"
  icon="📷"
/>
```

That's it — the button disappears from the UI, and the server routes return 404.

---

## 📄 Key File Reference

### `server/config/passport.js`
Registers each OAuth strategy with Passport.js. Each strategy:
- Receives the user's profile from the OAuth provider
- Calls `findOrCreateUser()` to upsert a record in MongoDB
- Returns the user to Passport via `done(null, user)`

The strategies only load if their environment variables are present — so simply omitting credentials from `.env` also disables a provider safely.

### `server/routes/auth.js`
Defines the URL routes that start and complete each OAuth flow.

- `/api/auth/<provider>` → initiates the OAuth redirect
- `/api/auth/<provider>/callback` → receives the user after approval
- `/api/auth/me` → protected endpoint to fetch the current user
- `/api/auth/logout` → informational logout (client removes token)

### `server/models/User.js`
MongoDB schema. Fields:
- `name`, `email`, `avatar` — from OAuth profile
- `provider` — which service (google/facebook/etc.)
- `providerId` — unique user ID from that provider
- Compound unique index on `(provider, providerId)` prevents duplicates

### `client/src/context/AuthContext.js`
Global React context. Provides:
- `user` — the logged-in user object or `null`
- `loading` — `true` while fetching user on startup
- `logout()` — removes token, clears user state
- `loginWithToken(token)` — called by AuthSuccess page

### `client/src/pages/AuthSuccess.js`
The page React app shows after OAuth completes. Reads `?token=` from the URL, stores it, then redirects to `/dashboard`.

### `client/src/pages/Login.js`
Renders social login buttons. Each button sets `window.location.href` to the Express OAuth route.

---

## 🔒 Security Notes

- JWTs expire after **7 days** (configurable in `routes/auth.js`)
- `JWT_SECRET` should be a long random string in production
- In production, set `cookie: { secure: true }` (HTTPS only)
- Never commit `.env` to version control — it's in `.gitignore`
- Instagram's API requires app review for public use

---

## 🌐 Production Deployment

1. Update all callback URLs in provider dashboards to your production domain
2. Set `CLIENT_URL` in server `.env` to your production React URL
3. Set `NODE_ENV=production`
4. Use a MongoDB Atlas connection string for `MONGO_URI`
5. Deploy server (e.g. Railway, Render, Heroku)
6. Deploy client (e.g. Vercel, Netlify) — set `REACT_APP_API_URL` to server URL
