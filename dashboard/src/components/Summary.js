import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";

const Summary = () => {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to get from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUsername(user.username);
        }

        // Then verify with backend
        console.log("Fetching user data...");
        const response = await fetchWithAuth("/user", {
          method: "GET",
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok && data.success) {
          console.log("Setting username to:", data.user.username);
          setUsername(data.user.username);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.log("User not authenticated or error");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings (13)</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className="profit">
              1.55k <small>+5.20%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>31.43k</span>{" "}
            </p>
            <p>
              Investment <span>29.88k</span>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
