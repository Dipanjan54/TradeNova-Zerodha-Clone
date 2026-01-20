import React, { useState } from "react";
import "./Signup.css";
import API_URL from "../../config";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Important for sessions
      });
      const data = await response.json();

      if (data.success) {
        setFlashMessage({ type: "success", message: data.message });
        setTimeout(() => {
          // Redirect to dashboard
          window.location.href =
            process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3000";
        }, 1000);
      } else {
        setFlashMessage({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setFlashMessage({
        type: "error",
        message: "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-card">
          {/* Flash Message */}
          {flashMessage.message && (
            <div className={`flash-message ${flashMessage.type}`}>
              {flashMessage.message}
            </div>
          )}

          {/* Logo */}
          <div className="logo">
            <img src="/media/images/logo (1).png" alt="Zerodha Logo" />
          </div>

          {/* Title */}
          <h1 className="signup-title">Login to Kite</h1>

          {/* Login Form */}
          <form
            className={`signup-form needs-validation ${validated ? "was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input-field form-control"
              required
            />
            <div className="invalid-feedback">Please enter your username.</div>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field form-control"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              ></button>
            </div>
            <div className="invalid-feedback">Please enter your password.</div>

            <button type="submit" className="signup-btn">
              Login
            </button>

            {/* Signup Link */}
            <div className="login-link">
              <p>
                Don't have an account? <a href="/signup">Sign up here!</a>
              </p>
            </div>

            {/* Footer Info */}
            <div className="footer-info">
              <p>
                Zerodha Broking Limited: Member of NSE, BSE, MCX - SEBI Reg. no.
              </p>
              <p>
                INZ000031633, CDSL - SEBI Reg. no. IN-DP-431-2019 |{" "}
                <a href="#">Smart Online</a>
              </p>
              <p>Dispute Resolution | SEBI SCORES</p>
              <p className="version">v3.0.0</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
