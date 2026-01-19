import React from "react";
import "./Logout.css";

const Logout = ({ isOpen, onClose, user }) => {
  console.log("Logout component - isOpen:", isOpen);
  console.log("Logout component - user:", user);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3002/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = "http://localhost:3000/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
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
