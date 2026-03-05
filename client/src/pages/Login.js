/**
 * LOGIN PAGE — Enhanced Design
 * Real SVG brand logos, premium glassmorphism UI, micro-animations.
 *
 * HOW TO DISABLE A PROVIDER:
 *   Comment out the <SocialButton> wrapper div for that provider (each is labeled).
 *   Also remove/comment its entry from the PROVIDERS array at the top.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

/* ── Brand SVG Logos ──────────────────────────────────────── */

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const FacebookLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const GitHubLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedInLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

/* ── Provider Config ──────────────────────────────────────── */
// TO DISABLE a provider: remove its entry from this array
const PROVIDERS = [
  {
    id: "google",
    label: "Google",
    Logo: GoogleLogo,
    bg: "#ffffff",
    text: "#3c4043",
    border: "#dadce0",
    hoverBg: "#f8f9fa",
    shadow: "rgba(66,133,244,0.3)",
  },
  {
    id: "facebook",
    label: "Facebook",
    Logo: FacebookLogo,
    bg: "#1877F2",
    text: "#ffffff",
    border: "transparent",
    hoverBg: "#0d6edb",
    shadow: "rgba(24,119,242,0.4)",
  },
  {
    id: "github",
    label: "GitHub",
    Logo: GitHubLogo,
    bg: "#24292e",
    text: "#ffffff",
    border: "transparent",
    hoverBg: "#1a1e22",
    shadow: "rgba(36,41,46,0.4)",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    Logo: LinkedInLogo,
    bg: "#0A66C2",
    text: "#ffffff",
    border: "transparent",
    hoverBg: "#0958a8",
    shadow: "rgba(10,102,194,0.4)",
  },
  {
    id: "instagram",
    label: "Instagram",
    Logo: InstagramLogo,
    bg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    text: "#ffffff",
    border: "transparent",
    hoverBg: null,
    shadow: "rgba(220,39,67,0.4)",
  },
];

/* ── Social Button ────────────────────────────────────────── */
const SocialButton = ({ provider, loading, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isLoading = loading === provider.id;
  const { Logo } = provider;
  const isGradient = provider.bg.includes("gradient");

  return (
    <button
      onClick={() => onClick(provider.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={!!loading}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "0",
        border: `1.5px solid ${provider.border}`,
        borderRadius: "12px",
        fontSize: "14.5px",
        fontWeight: "600",
        fontFamily: "'DM Sans', sans-serif",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        background: isGradient
          ? provider.bg
          : hovered && provider.hoverBg
          ? provider.hoverBg
          : provider.bg,
        color: provider.text,
        boxShadow: hovered
          ? `0 8px 25px ${provider.shadow}, 0 2px 8px rgba(0,0,0,0.08)`
          : "0 1px 3px rgba(0,0,0,0.08)",
        transform: pressed ? "scale(0.985)" : hovered ? "translateY(-1px)" : "none",
        opacity: loading && !isLoading ? 0.5 : 1,
        letterSpacing: "0.01em",
        overflow: "hidden",
      }}
      aria-label={`Sign in with ${provider.label}`}
    >
      {/* Icon container */}
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "52px",
        height: "52px",
        borderRight: provider.bg === "#ffffff"
          ? "1.5px solid #dadce0"
          : "1px solid rgba(255,255,255,0.15)",
        flexShrink: 0,
        background: provider.bg === "#ffffff" ? "transparent" : "rgba(255,255,255,0.1)",
      }}>
        {isLoading ? (
          <span style={{
            width: "18px", height: "18px",
            border: `2px solid ${provider.text}40`,
            borderTop: `2px solid ${provider.text}`,
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }} />
        ) : (
          <Logo />
        )}
      </span>

      {/* Label */}
      <span style={{ flex: 1, textAlign: "center", paddingRight: "52px" }}>
        {isLoading ? "Connecting…" : `Continue with ${provider.label}`}
      </span>
    </button>
  );
};

/* ── Login Page ───────────────────────────────────────────── */
const Login = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeLoading, setActiveLoading] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!document.getElementById("dm-sans-font")) {
      const link = document.createElement("link");
      link.id = "dm-sans-font";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("auth-keyframes")) {
      const style = document.createElement("style");
      style.id = "auth-keyframes";
      style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
      `;
      document.head.appendChild(style);
    }
    setTimeout(() => setMounted(true), 50);
  }, []);

  if (!authLoading && user) return <Navigate to="/dashboard" replace />;

  const handleLogin = (providerId) => {
    setActiveLoading(providerId);
    const API_URL = process.env.REACT_APP_API_URL || "";
    window.location.href = `${API_URL}/api/auth/${providerId}`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0d0f1a",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Background effects */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          animation: "pulse 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
          animation: "pulse 10s ease-in-out infinite 2s",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* Card */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "40px 36px 36px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>

          {/* Logo mark */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <h1 style={{
            textAlign: "center",
            fontSize: "26px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "8px",
            letterSpacing: "-0.02em",
            fontFamily: "'DM Serif Display', serif",
          }}>
            Welcome back
          </h1>
          <p style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: "14px",
            marginBottom: "32px",
            lineHeight: "1.5",
          }}>
            Choose your preferred sign-in method
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* ── GOOGLE — TO DISABLE: delete this div block */}
            <div style={{ animation: "floatUp 0.4s ease 0.05s both" }}>
              <SocialButton provider={PROVIDERS[0]} loading={activeLoading} onClick={handleLogin} />
            </div>

            {/* ── FACEBOOK — TO DISABLE: delete this div block */}
            <div style={{ animation: "floatUp 0.4s ease 0.12s both" }}>
              <SocialButton provider={PROVIDERS[1]} loading={activeLoading} onClick={handleLogin} />
            </div>

            {/* ── GITHUB — TO DISABLE: delete this div block */}
            <div style={{ animation: "floatUp 0.4s ease 0.19s both" }}>
              <SocialButton provider={PROVIDERS[2]} loading={activeLoading} onClick={handleLogin} />
            </div>

            {/* ── LINKEDIN — TO DISABLE: delete this div block */}
            <div style={{ animation: "floatUp 0.4s ease 0.26s both" }}>
              <SocialButton provider={PROVIDERS[3]} loading={activeLoading} onClick={handleLogin} />
            </div>

            {/* ── INSTAGRAM — TO DISABLE: delete this div block */}
            <div style={{ animation: "floatUp 0.4s ease 0.33s both" }}>
              <SocialButton provider={PROVIDERS[4]} loading={activeLoading} onClick={handleLogin} />
            </div>

          </div>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              secure sign-in
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          <p style={{
            textAlign: "center",
            fontSize: "11.5px",
            color: "rgba(255,255,255,0.22)",
            marginTop: "16px",
            lineHeight: "1.6",
          }}>
            By continuing you agree to our{" "}
            <span style={{ color: "rgba(255,255,255,0.45)", cursor: "pointer", textDecoration: "underline" }}>Terms</span>
            {" & "}
            <span style={{ color: "rgba(255,255,255,0.45)", cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>
          </p>
        </div>

        {/* Bottom glow line */}
        <div style={{
          position: "absolute", bottom: "-1px", left: "10%", right: "10%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(236,72,153,0.6), transparent)",
          filter: "blur(1px)",
        }} />
      </div>
    </div>
  );
};

export default Login;
