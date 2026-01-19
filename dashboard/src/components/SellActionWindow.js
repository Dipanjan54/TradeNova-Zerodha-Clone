import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./SellActionWindow.css";

const SellActionWindow = ({ uid, availableQty }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState("");
  const [error, setError] = useState("");
  const { closeSellWindow, refreshData } = useContext(GeneralContext);

  useEffect(() => {
    console.log("SellActionWindow mounted with:", { uid, availableQty });
  }, [uid, availableQty]);

  // Validation function to check if sell order is valid
  const isValidSell = () => {
    const price = parseFloat(stockPrice);
    const qty = Number(stockQuantity);

    console.log("Validation check:", {
      stockPrice,
      price,
      stockQuantity,
      qty,
      availableQty,
      priceValid: !(!stockPrice || isNaN(price) || price <= 0),
      qtyValid: !(isNaN(qty) || qty <= 0),
      qtyWithinLimit: qty <= availableQty,
    });

    // Check if price is valid
    if (!stockPrice || isNaN(price) || price <= 0) {
      return false;
    }

    // Check if quantity is valid
    if (isNaN(qty) || qty <= 0) {
      return false;
    }

   
    if (qty > availableQty) {
      return false;
    }

    return true;
  };

  const handleSellClick = async () => {
    console.log("Sell button clicked. Valid?", isValidSell());

    if (!isValidSell()) {
      if (!stockPrice || parseFloat(stockPrice) <= 0) {
        setError("Please enter a valid price!");
      } else if (stockQuantity <= 0) {
        setError("Please enter a valid quantity!");
      } else if (stockQuantity > availableQty) {
        setError(
          `Cannot sell ${stockQuantity} shares. Only ${availableQty} available!`,
        );
      }
      return;
    }

    try {
      await axios.post(
        "http://localhost:3002/newOrder",
        {
          name: uid,
          qty: stockQuantity,
          price: parseFloat(stockPrice),
          mode: "SELL",
        },
        { withCredentials: true },
      );

      console.log("Sell order placed successfully");
      closeSellWindow();
      refreshData();
    } catch (error) {
      console.error("Error placing sell order:", error);
      setError("Failed to place order. Please try again.");
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setStockQuantity(value);
    setError("");

    console.log("Quantity changed to:", value, "Available:", availableQty);

    if (value > availableQty) {
      setError(`Only ${availableQty} shares available!`);
    }
  };

  const handlePriceChange = (e) => {
    setStockPrice(e.target.value);
    setError("");
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <h3>{uid}</h3>
        <p className="available">Available Qty: {availableQty}</p>
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
              max={availableQty}
              onChange={handleQuantityChange}
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
              onChange={handlePriceChange}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>
          Margin available ₹
          {stockPrice && stockQuantity
            ? (parseFloat(stockPrice) * stockQuantity).toFixed(2)
            : "0.00"}
        </span>
        <div>
          <button
            className="btn btn-red"
            onClick={handleSellClick}
            disabled={!isValidSell()}
            style={{
              opacity: !isValidSell() ? 0.5 : 1,
              cursor: !isValidSell() ? "not-allowed" : "pointer",
            }}
          >
            Sell
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
