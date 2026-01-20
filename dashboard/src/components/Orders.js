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
      <div className="no-orders">
        <p>You haven't placed any orders today</p>

        <Link to={"/"} className="btn">
          Get started
        </Link>
      </div>
    </div>
  );
};

export default Orders;
