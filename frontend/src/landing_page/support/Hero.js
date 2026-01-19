import React from "react";

function Hero() {
  return (
    <section
      style={{ backgroundColor: "#f6f6f6" }}
      className="container-fluid  mt-0 py-5 mb-3 "
    >
      {/* Inner container with left + right spacing */}
      <div className="container pe-5">
        {/* Support Portal header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-semibold mb-0">Support Portal</h1>
          <button
            style={{ backgroundColor: "#397DD0" }}
            className="rounded-2 border-0 fw-medium px-4 py-2 text-white"
            aria-label="View your support tickets"
          >
            My tickets
          </button>
        </div>

        {/* Search bar */}
        <div className="input-group">
          <span className="input-group-text bg-white border-0">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          </span>
          <input
            type="search"
            className="form-control p-3"
            placeholder="Eg: How do I open my account, How do I activate F&O..."
            aria-label="Search support queries"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
