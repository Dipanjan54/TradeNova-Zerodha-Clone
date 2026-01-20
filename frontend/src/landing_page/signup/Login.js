import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../config";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);

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
        // Store JWT token in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setFlashMessage({ type: "success", message: data.message });
        setTimeout(() => {
          // Redirect to dashboard
          window.location.href = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3000";
        }, 1000);
      } else {
        setFlashMessage({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setFlashMessage({
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">Login</h5>

              {flashMessage && (
                <div
                  className={`alert alert-${flashMessage.type === "success" ? "success" : "danger"} alert-dismissible fade show`}
                  role="alert"
                >
                  {flashMessage.message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setFlashMessage(null)}
                  ></button>
                </div>
              )}

              <form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;