import React, { useState } from "react";
import "./Signup.css";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      const response = await fetch("http://localhost:3002/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setFlashMessage({ type: "success", message: data.message });
        setTimeout(() => {
          window.location.href = "http://localhost:3000";
        }, 2000);
      } else {
        setFlashMessage({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setFlashMessage({
        type: "error",
        message: "Signup failed. Please try again.",
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
          <h1 className="signup-title">Sign up for Kite</h1>

          {/* Signup Form */}
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
              minLength="3"
            />
            <div className="invalid-feedback">
              Please enter a username (min 3 characters).
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field form-control"
              required
            />
            <div className="invalid-feedback">Please enter a valid email.</div>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field form-control"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              ></button>
            </div>
            <div className="invalid-feedback">
              Please enter a password (min 6 characters).
            </div>

            <button type="submit" className="signup-btn">
              Sign Up
            </button>

            {/* App Store Icons */}
            <div className="app-icons">
              <img
                src="/media/images/Screenshot_18-1-2026_21737_kite.zerodha.com.jpeg"
                alt="Google Play"
                className="icon-playstore"
              />
              <img
                src="/media/images/Screenshot_18-1-2026_21749_kite.zerodha.com.jpeg"
                alt="App Store"
                className="icon-appstore"
              />
            </div>

            {/* Zerodha Branding */}
            <div className="branding">
              <p>⚡ ZERODHA</p>
            </div>

            {/* Login Link */}
            <div className="login-link">
              <p>
                Already have an account? <a href="/login">Login here!</a>
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
