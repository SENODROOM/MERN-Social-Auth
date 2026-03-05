/**
 * AUTH ROUTES
 * ============================================================
 * Each provider needs TWO routes:
 *   1. GET /api/auth/<provider>         → Redirects user to provider login
 *   2. GET /api/auth/<provider>/callback → Provider redirects back here
 *
 * After successful login, we:
 *   1. Create a JWT containing the user's MongoDB _id
 *   2. Redirect the browser to the React app with the token in the URL
 *   3. React reads the token and stores it in localStorage
 *
 * HOW TO DISABLE A PROVIDER:
 *   Comment out the route pair for that provider (labeled below).
 *   You must also comment out the matching strategy in config/passport.js
 *   and the button in the React frontend.
 * ============================================================
 */

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ─── JWT Generator ───────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ─── Generic OAuth callback handler ─────────────────────────
// Shared by all providers — builds the token and redirects to React.
const handleOAuthCallback = (req, res) => {
  const token = generateToken(req.user._id);
  // Redirect to React with token in query param
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
};

const failureRedirect = `${process.env.CLIENT_URL}/login?error=auth_failed`;

// ============================================================
// GOOGLE ROUTES
// TO DISABLE: Comment out this block + Google strategy in passport.js
// ============================================================
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect, session: false }),
  handleOAuthCallback
);

// ============================================================
// FACEBOOK ROUTES
// TO DISABLE: Comment out this block + Facebook strategy in passport.js
// ============================================================
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect, session: false }),
  handleOAuthCallback
);

// ============================================================
// GITHUB ROUTES
// TO DISABLE: Comment out this block + GitHub strategy in passport.js
// ============================================================
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect, session: false }),
  handleOAuthCallback
);

// ============================================================
// LINKEDIN ROUTES
// TO DISABLE: Comment out this block + LinkedIn strategy in passport.js
// ============================================================
router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    scope: ["openid", "profile", "email"],
  })
);
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect, session: false }),
  handleOAuthCallback
);

// ============================================================
// INSTAGRAM ROUTES
// TO DISABLE: Comment out this block + Instagram strategy in passport.js
// ============================================================
router.get(
  "/instagram",
  passport.authenticate("instagram", { scope: ["user_profile"] })
);
router.get(
  "/instagram/callback",
  passport.authenticate("instagram", { failureRedirect, session: false }),
  handleOAuthCallback
);

// ============================================================
// PROTECTED ROUTE: Get current logged-in user
// Used by React to fetch user profile after login
// ============================================================
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// LOGOUT
// Client-side: just remove the token from localStorage.
// This endpoint is optional but good for logging purposes.
// ============================================================
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
