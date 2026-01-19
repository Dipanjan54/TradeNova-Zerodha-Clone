import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3002/user", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleKiteClick = () => {
    if (isLoggedIn) {
      window.location.href = "http://localhost:3000";
    } else {
      window.location.href = "/signup";
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container-fluid ms-5 ps-5 py-2">
        <Link className="navbar-brand" to="/">
          <img
            src="media/images/logo.svg"
            style={{ width: "20%" }}
            alt="Logo"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-lg-0">
            <li className="nav-item ms-5">
              <Link className="nav-link active" to="/signup">
                Signup
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active" to="/product">
                Product
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active" to="/pricing">
                Pricing
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active" to="/support">
                Support
              </Link>
            </li>

            <li className="nav-item menu-dropdown-wrapper">
              <a className="nav-link active" href="#" onClick={toggleDropdown}>
                <i className="fa-solid fa-bars"></i>
              </a>

              {isDropdownOpen && (
                <div className="kite-dropdown">
                  <div className="kite-card" onClick={handleKiteClick}>
                    <img
                      src="media/images/logo (1).png"
                      alt="Kite"
                      className="kite-logo"
                    />
                    <span className="kite-title">Kite</span>
                    <span className="kite-subtitle">Trading platform</span>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
