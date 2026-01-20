import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import API_URL from "../config";
import { axiosConfig } from "../utils/api";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState("");
  const [error, setError] = useState("");
  const { closeBuyWindow, refreshData } = useContext(GeneralContext);

  const handleBuyClick = async () => {
    // Validation
    if (!stockPrice || stockPrice <= 0) {
      setError("Please enter a valid price!");
      return;
    }

    if (!stockQuantity || stockQuantity <= 0) {
      setError("Please enter a valid quantity!");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/newOrder`,
        {
          name: uid,
          qty: stockQuantity,
          price: parseFloat(stockPrice),
          mode: "BUY",
        },
        axiosConfig(),
      );

      console.log("Buy order placed successfully");

      closeBuyWindow();
      refreshData();
    } catch (error) {
      console.error("Error placing buy order:", error);
      setError("Failed to place order. Please try again.");
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <h3>{uid}</h3>
        {error && (
          <p className="error" style={{ color: "red", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => {
                setStockQuantity(Number(e.target.value));
                setError("");
              }}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0.01"
              placeholder="Enter price"
              onChange={(e) => {
                setStockPrice(e.target.value);
                setError("");
              }}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>
          Margin required ₹
          {stockPrice && stockQuantity
            ? (stockPrice * stockQuantity).toFixed(2)
            : "0.00"}
        </span>
        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
