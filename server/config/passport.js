/**
 * PASSPORT CONFIGURATION
 * ============================================================
 * This file registers OAuth strategies for each provider.
 *
 * HOW TO DISABLE A PROVIDER:
 * Simply comment out or delete the entire block for that provider.
 * Each block is clearly labeled. You must also:
 *   1. Remove/comment the corresponding route in routes/auth.js
 *   2. Remove/comment the button in the React frontend
 *
 * Each strategy follows the same pattern:
 *   - Receive profile from provider
 *   - Find or create the user in MongoDB
 *   - Call done(null, user) to continue
 * ============================================================
 */

const passport = require("passport");
const User = require("../models/User");

// ─── Helper: Find or create user ────────────────────────────
// Reused by every strategy to keep things DRY.
async function findOrCreateUser(provider, providerId, profile, done) {
  try {
    let user = await User.findOne({ provider, providerId });

    if (!user) {
      // Extract name from profile (varies by provider)
      const name =
        profile.displayName ||
        (profile.name
          ? `${profile.name.givenName} ${profile.name.familyName}`
          : "User");

      // Extract email (may be missing for some providers)
      const email =
        profile.emails && profile.emails[0]
          ? profile.emails[0].value
          : undefined;

      // Extract avatar
      const avatar =
        profile.photos && profile.photos[0] ? profile.photos[0].value : null;

      user = await User.create({ name, email, avatar, provider, providerId });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}

// ─── Serialize / Deserialize ─────────────────────────────────
// Passport stores the user ID in the session.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ============================================================
// GOOGLE STRATEGY
// Docs: https://console.cloud.google.com/
// Callback: /api/auth/google/callback
// TO DISABLE: Comment out this entire block
// ============================================================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        await findOrCreateUser("google", profile.id, profile, done);
      }
    )
  );
  console.log("✅ Google OAuth strategy registered");
} else {
  console.log("⚠️  Google OAuth skipped (missing env vars)");
}

// ============================================================
// FACEBOOK STRATEGY
// Docs: https://developers.facebook.com/
// Callback: /api/auth/facebook/callback
// TO DISABLE: Comment out this entire block
// ============================================================
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  const FacebookStrategy = require("passport-facebook").Strategy;
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        await findOrCreateUser("facebook", profile.id, profile, done);
      }
    )
  );
  console.log("✅ Facebook OAuth strategy registered");
} else {
  console.log("⚠️  Facebook OAuth skipped (missing env vars)");
}

// ============================================================
// GITHUB STRATEGY
// Docs: https://github.com/settings/developers
// Callback: /api/auth/github/callback
// TO DISABLE: Comment out this entire block
// ============================================================
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  const GitHubStrategy = require("passport-github2").Strategy;
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        await findOrCreateUser("github", profile.id, profile, done);
      }
    )
  );
  console.log("✅ GitHub OAuth strategy registered");
} else {
  console.log("⚠️  GitHub OAuth skipped (missing env vars)");
}

// ============================================================
// LINKEDIN STRATEGY
// Docs: https://www.linkedin.com/developers/
// Callback: /api/auth/linkedin/callback
// TO DISABLE: Comment out this entire block
// ============================================================
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/api/auth/linkedin/callback",
        scope: ["openid", "profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        await findOrCreateUser("linkedin", profile.id, profile, done);
      }
    )
  );
  console.log("✅ LinkedIn OAuth strategy registered");
} else {
  console.log("⚠️  LinkedIn OAuth skipped (missing env vars)");
}

// ============================================================
// INSTAGRAM STRATEGY
// Instagram uses Facebook's OAuth infrastructure.
// Docs: https://developers.facebook.com/docs/instagram-basic-display-api/
// Callback: /api/auth/instagram/callback
// TO DISABLE: Comment out this entire block
// ============================================================
if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
  const InstagramStrategy = require("passport-facebook").Strategy;
  passport.use(
    "instagram",
    new InstagramStrategy(
      {
        clientID: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        callbackURL: "/api/auth/instagram/callback",
        authorizationURL: "https://api.instagram.com/oauth/authorize",
        tokenURL: "https://api.instagram.com/oauth/access_token",
        profileFields: ["id", "displayName", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        await findOrCreateUser("instagram", profile.id, profile, done);
      }
    )
  );
  console.log("✅ Instagram OAuth strategy registered");
} else {
  console.log("⚠️  Instagram OAuth skipped (missing env vars)");
}

module.exports = passport;
