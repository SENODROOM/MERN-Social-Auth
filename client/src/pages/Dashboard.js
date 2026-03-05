/**
 * DASHBOARD PAGE
 * Shown after successful login. Displays user info from JWT-authenticated API.
 * Matches the dark glassmorphism aesthetic of the Login page.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PROVIDER_META = {
  google:    { color: "#4285F4", label: "Google",    emoji: "G" },
  facebook:  { color: "#1877F2", label: "Facebook",  emoji: "f" },
  github:    { color: "#6e7681", label: "GitHub",    emoji: "⌥" },
  linkedin:  { color: "#0A66C2", label: "LinkedIn",  emoji: "in" },
  instagram: { color: "#E1306C", label: "Instagram", emoji: "📷" },
};

const InfoRow = ({ label, value, mono, last }) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.06)",
    fontSize: "13px",
    gap: "12px",
  }}>
    <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: "500", flexShrink: 0 }}>{label}</span>
    <span style={{
      color: "rgba(255,255,255,0.85)",
      fontFamily: mono ? "'Courier New', monospace" : "inherit",
      fontSize: mono ? "11px" : "13px",
      maxWidth: "60%",
      textAlign: "right",
      wordBreak: "break-all",
      background: mono ? "rgba(255,255,255,0.05)" : "transparent",
      padding: mono ? "3px 8px" : "0",
      borderRadius: mono ? "6px" : "0",
    }}>
      {value}
    </span>
  </div>
);

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

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
        @keyframes floatUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
        @keyframes avatarIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
      `;
      document.head.appendChild(style);
    }
    setTimeout(() => setMounted(true), 50);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0f1a" }}>
        <div style={{
          width: "40px", height: "40px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTop: "3px solid #6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const meta = PROVIDER_META[user.provider] || { color: "#6366f1", label: user.provider, emoji: "?" };

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

      {/* Background blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: `radial-gradient(circle, ${meta.color}20 0%, transparent 70%)`,
          animation: "pulse 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
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
        maxWidth: "440px",
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
          textAlign: "center",
        }}>

          {/* Provider pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: `${meta.color}22`,
            border: `1px solid ${meta.color}44`,
            color: meta.color,
            padding: "4px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "capitalize",
            marginBottom: "24px",
            animation: "floatUp 0.4s ease both",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: meta.color, display: "inline-block",
            }} />
            Signed in with {meta.label}
          </div>

          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                style={{
                  width: "88px", height: "88px", borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${meta.color}66`,
                  boxShadow: `0 0 0 6px ${meta.color}15, 0 8px 24px rgba(0,0,0,0.3)`,
                  animation: "avatarIn 0.5s ease 0.1s both",
                }}
              />
            ) : (
              <div style={{
                width: "88px", height: "88px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${meta.color}, #6366f1)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", fontWeight: "700", color: "white",
                border: `3px solid ${meta.color}66`,
                boxShadow: `0 0 0 6px ${meta.color}15, 0 8px 24px rgba(0,0,0,0.3)`,
                animation: "avatarIn 0.5s ease 0.1s both",
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name & email */}
          <h2 style={{
            fontSize: "22px", fontWeight: "700",
            color: "#f1f5f9", marginBottom: "4px",
            letterSpacing: "-0.02em",
            fontFamily: "'DM Serif Display', serif",
            animation: "floatUp 0.4s ease 0.15s both",
          }}>
            {user.name}
          </h2>
          {user.email && (
            <p style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: "13.5px",
              marginBottom: "28px",
              animation: "floatUp 0.4s ease 0.2s both",
            }}>
              {user.email}
            </p>
          )}

          {/* Info box */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px",
            padding: "4px 16px",
            marginBottom: "24px",
            textAlign: "left",
            animation: "floatUp 0.4s ease 0.25s both",
          }}>
            <InfoRow label="Provider" value={meta.label} />
            <InfoRow label="Account ID" value={user._id} mono />
            <InfoRow
              label="Member Since"
              value={new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              last
            />
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            style={{
              width: "100%",
              padding: "13px",
              background: logoutHover ? "rgba(255,71,87,0.2)" : "rgba(255,71,87,0.1)",
              color: "#ff4757",
              border: "1px solid rgba(255,71,87,0.3)",
              borderRadius: "12px",
              fontSize: "14.5px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.01em",
              transform: logoutHover ? "translateY(-1px)" : "none",
              animation: "floatUp 0.4s ease 0.3s both",
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Bottom glow line */}
        <div style={{
          position: "absolute", bottom: "-1px", left: "10%", right: "10%", height: "1px",
          background: `linear-gradient(90deg, transparent, ${meta.color}80, rgba(99,102,241,0.6), transparent)`,
          filter: "blur(1px)",
        }} />
      </div>
    </div>
  );
};

export default Dashboard;
