import React from "react";
import "./Logout.css";
import API_URL from "../config";

const Logout = ({ isOpen, onClose, user }) => {
  console.log("Logout component - isOpen:", isOpen);
  console.log("Logout component - user:", user);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        // Clear JWT token from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if request fails, clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  if (!isOpen) {
    console.log("Logout hidden - isOpen is false");
    return null;
  }

  console.log("Logout visible - rendering dropdown");

  return (
    <div className="logout-dropdown-above">
      <div className="logout-user-info">
        <p className="logout-username">{user.username}</p>
        <p className="logout-email">{user.email}</p>
      </div>
      <button onClick={handleLogout} className="logout-option">
        <span className="logout-icon">↩</span> Logout
      </button>
    </div>
  );
};

export default Logout;
