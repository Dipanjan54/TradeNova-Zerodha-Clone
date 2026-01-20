import React from "react";

const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001";
const Apps = () => {
  const handleLogoClick = () => {
    window.location.href = FRONTEND_URL;
  };

  return (
    <div
      style={{
        padding: "20px",
        height: "100vh",
      }}
    >
      <img
        src="logo.svg"
        alt="Zerodha Logo"
        onClick={handleLogoClick}
        style={{
          width: "150px",
          cursor: "pointer",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      />
    </div>
  );
};

export default Apps;
