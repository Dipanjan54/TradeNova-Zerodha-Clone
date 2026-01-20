import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API_URL from "../config";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

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
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setFlashMessage({ type: "success", message: data.message });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // Check if error is about invalid credentials (user doesn't exist)
        if (
          data.message.includes("Invalid username") ||
          data.message.includes("Invalid password")
        ) {
          setFlashMessage({
            type: "error",
            message: "Account not found. Redirecting to signup...",
          });
          setTimeout(() => {
            window.location.href = process.env.REACT_APP_FRONTEND_URL
              ? `${process.env.REACT_APP_FRONTEND_URL}/signup`
              : "http://localhost:3001/signup";
          }, 2000);
        } else {
          setFlashMessage({ type: "error", message: data.message });
        }
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
          {flashMessage.message && (
            <div className={`flash-message ${flashMessage.type}`}>
              {flashMessage.message}
            </div>
          )}

          <div className="logo">
            <img src="logo (1).png" alt="Logo" />
          </div>

          <h1 className="signup-title">Login to Dashboard</h1>

          <form
            className={`signup-form needs-validation ${validated ? "was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="input-field form-control"
                required
              />
              <div className="invalid-feedback">
                Please enter your username.
              </div>
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field form-control"
                required
              />
            </div>
            <div className="invalid-feedback">Please enter your password.</div>

            <button type="submit" className="signup-btn">
              Login
            </button>

            <div className="branding">
              <p>⚡ ZERODHA</p>
            </div>

            <div className="footer-info">
              <p>
                Zerodha Broking Limited: Member of NSE, BSE, MCX - SEBI Reg. no.
              </p>
              <p>INZ000031633, CDSL - SEBI Reg. no. IN-DP-431-2019</p>
              <p>Dispute Resolution | SEBI SCORES</p>
              <p className="version">v3.0.0</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
