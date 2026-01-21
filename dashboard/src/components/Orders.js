import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import API_URL from "../config";
import { axiosConfig } from "../utils/api";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshTrigger } = useContext(GeneralContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/allOrders`, axiosConfig());
        console.log("Orders received:", res.data);
        setAllOrders(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          // User not authenticated, redirect to login
          navigate("/login");
        }
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, refreshTrigger]);

  if (loading) {
    return <div className="orders">Loading...</div>;
  }

  return (
    <div className="orders">
      {allOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <>
          <h3 className="title">Orders ({allOrders.length})</h3>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total Value</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order, index) => {
                  const totalValue = order.qty * order.price;
                  const orderTime = order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A";

                  return (
                    <tr key={index}>
                      <td>{order.name}</td>
                      <td className={order.mode === "BUY" ? "profit" : "loss"}>
                        {order.mode}
                      </td>
                      <td>{order.qty}</td>
                      <td>₹{order.price.toFixed(2)}</td>
                      <td>₹{totalValue.toFixed(2)}</td>
                      <td>{orderTime}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
