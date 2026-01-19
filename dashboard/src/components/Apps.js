import React from "react";

const Apps = () => {
  const handleLogoClick = () => {
    window.location.href = "http://localhost:3001";
  };

  return (
    <div style={{
      padding: "20px",
      height: "100vh"
    }}>
      <img 
        src="logo.svg" 
        alt="Zerodha Logo"
        onClick={handleLogoClick}
        style={{
          width: "150px",
          cursor: "pointer",
          transition: "transform 0.3s ease"
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      />
    </div>
  );
};

export default Apps;