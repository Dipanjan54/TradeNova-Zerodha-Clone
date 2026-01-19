import React from "react";

export default function SupportPage() {
  return (
    <div className="container-fluid py-4 px-md-5 px-3">
      <div className="row">
        {/* LEFT MENU */}
        <div className="col-md-7 ms-5">
          <div className="accordion" id="supportAccordion">
            {/* Account Opening */}
            <div className="accordion-item mb-3 shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#account"
                >
                  <i className="fa-solid fa-circle-plus me-3"></i>
                  Account Opening
                </button>
              </h2>
              <div
                id="account"
                className="accordion-collapse collapse show"
                data-bs-parent="#supportAccordion"
              >
                <div className="accordion-body">
                  <ul>
                    <li>
                      <a href="#">Resident individual</a>
                    </li>
                    <li>
                      <a href="#">Minor</a>
                    </li>
                    <li>
                      <a href="#">Non Resident Indian (NRI)</a>
                    </li>
                    <li>
                      <a href="#">Company, Partnership, HUF and LLP</a>
                    </li>
                    <li>
                      <a href="#">Glossary</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Your Zerodha Account */}
            <div className="accordion-item mb-3 shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#zerodha"
                >
                  <i className="fas fa-user me-2 text-primar"></i>
                  Your Zerodha Account
                </button>
              </h2>
              <div
                id="zerodha"
                className="accordion-collapse collapse"
                data-bs-parent="#supportAccordion"
              >
                <div className="accordion-body">
                  <ul>
                    <li>
                      <a href="#">Your Profile</a>
                    </li>
                    <li>
                      <a href="#">Account modification</a>
                    </li>
                    <li>
                      <a href="#">CMR & DP</a>
                    </li>
                    <li>
                      <a href="#">Nomination</a>
                    </li>
                    <li>
                      <a href="#">Transfer & conversion</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Kite */}
            <div className="accordion-item mb-3 shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#kite"
                >
                  <i className="fa-solid fa-paper-plane me-3"></i>
                  Kite
                </button>
              </h2>
              <div
                id="kite"
                className="accordion-collapse collapse"
                data-bs-parent="#supportAccordion"
              >
                <div className="accordion-body">
                  <ul>
                    <li>
                      <a href="#">IPO</a>
                    </li>
                    <li>
                      <a href="#">Trading FAQs</a>
                    </li>
                    <li>
                      <a href="#">Margins & MTF</a>
                    </li>
                    <li>
                      <a href="#">Charts and orders</a>
                    </li>
                    <li>
                      <a href="#">Alerts and Nudges</a>
                    </li>
                    <li>
                      <a href="#">General</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Funds */}
            <div className="accordion-item mb-3 shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#fund"
                >
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                  Funds
                </button>
              </h2>
              <div
                id="fund"
                className="accordion-collapse collapse"
                data-bs-parent="#supportAccordion"
              >
                <div className="accordion-body">
                  <ul>
                    <li>
                      <a href="#">Add money</a>
                    </li>
                    <li>
                      <a href="#">Withdraw money</a>
                    </li>
                    <li>
                      <a href="#">Add bank accounts</a>
                    </li>
                    <li>
                      <a href="#">eMandates</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Console */}
            <div className="accordion-item shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#console"
                >
                  <i className="fa-solid fa-terminal"></i>
                  Console
                </button>
              </h2>
              <div
                id="console"
                className="accordion-collapse collapse"
                data-bs-parent="#supportAccordion"
              >
                <div className="accordion-body">
                  <ul>
                    <li>
                      <a href="#">Portfolio</a>
                    </li>
                    <li>
                      <a href="#">Corporate actions</a>
                    </li>
                    <li>
                      <a href="#">Funds statement</a>
                    </li>
                    <li>
                      <a href="#">Reports</a>
                    </li>
                    <li>
                      <a href="#">Profile</a>
                    </li>
                    <li>
                      <a href="#">Segments</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-1"></div>
        {/* RIGHT SIDEBAR */}
        <div className="col-md-3 pe-3 me-3">
          <div className="notice-box mb-4 shadow-sm">
            <ul>
              <li>
                <a href="#">
                  Settlement Holiday on account of municipal corporation
                  elections in Maharashtra on January 15, 2026
                </a>
              </li>
              <li>
                <a href="#">Latest Intraday leverages and Square-off timings</a>
              </li>
            </ul>
          </div>

          <div className="card shadow-sm">
            <div className="card-header fw-bold">Quick Links</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Track account opening</li>
              <li className="list-group-item">Track segment activation</li>
              <li className="list-group-item">Intraday margins</li>
              <li className="list-group-item">Kite user manual</li>
              <li className="list-group-item">Create a ticket</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
