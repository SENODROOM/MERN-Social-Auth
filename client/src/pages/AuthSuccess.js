/**
 * AUTH SUCCESS PAGE
 * ============================================================
 * This is the landing page after a successful OAuth login.
 *
 * HOW IT WORKS:
 *   1. User clicks "Continue with Google" on the Login page
 *   2. Browser goes to /api/auth/google (Express)
 *   3. Express redirects to Google's OAuth consent screen
 *   4. User approves → Google redirects to /api/auth/google/callback
 *   5. Express creates/finds user, generates JWT
 *   6. Express redirects to /auth/success?token=<jwt>   ← this page
 *   7. This page reads the token from the URL
 *   8. Stores token in localStorage via loginWithToken()
 *   9. Navigates to /dashboard
 * ============================================================
 */

import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      loginWithToken(token); // Stores token, fetches user
      navigate("/dashboard", { replace: true });
    } else {
      // Something went wrong — back to login
      navigate("/login?error=no_token", { replace: true });
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0d0f1a",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: "48px", height: "48px",
        border: "3px solid rgba(255,255,255,0.08)",
        borderTop: "3px solid #6366f1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        marginBottom: "20px",
      }} />
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", letterSpacing: "0.02em" }}>
        Completing sign-in…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthSuccess;
