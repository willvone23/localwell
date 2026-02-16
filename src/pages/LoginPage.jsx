import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  if (!supabase) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="logo-icon" />
            <span className="logo-text">LocalWell</span>
          </div>
          <p style={{ textAlign: "center", color: "var(--gray-500)", fontSize: 14 }}>
            Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> to your environment variables.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === "login") {
      const { error: err } = await signIn({ email, password });
      if (err) {
        setError(err.message);
        setSubmitting(false);
      } else {
        navigate("/");
      }
    } else {
      const { error: err } = await signUp({
        email,
        password,
        fullName,
        username,
      });
      if (err) {
        setError(err.message);
        setSubmitting(false);
      } else {
        setConfirmSent(true);
        setSubmitting(false);
      }
    }
  }

  if (confirmSent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="logo-icon" />
            <span className="logo-text">LocalWell</span>
          </div>
          <h2 className="auth-title">Check your email</h2>
          <p style={{ textAlign: "center", color: "var(--gray-500)", fontSize: 14 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account.
          </p>
          <button
            className="btn-primary btn-full"
            style={{ marginTop: 20 }}
            onClick={() => {
              setConfirmSent(false);
              setMode("login");
            }}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon" />
          <span className="logo-text">LocalWell</span>
        </div>
        <h2 className="auth-title">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to your LocalWell account"
            : "Join the healthy living community"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <>
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input
                  className="auth-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Will vonEschenbach"
                  required
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Username</label>
                <input
                  className="auth-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="will"
                  required
                />
              </div>
            </>
          )}
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={submitting}
          >
            {submitting
              ? "Loading..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                className="auth-toggle-btn"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="auth-toggle-btn"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
