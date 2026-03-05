/**
 * SERVER ENTRY POINT
 * ============================================================
 * Starts the Express server and connects to MongoDB.
 * Registers all middleware and routes.
 * ============================================================
 */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport"); // Loads all OAuth strategies

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Session is needed by Passport internally during the OAuth redirect flow.
// After the callback, we switch to JWTs (stateless) — session is not persisted.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// ─── MongoDB ─────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mern_social_auth")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Auth endpoints: http://localhost:${PORT}/api/auth\n`);
});
