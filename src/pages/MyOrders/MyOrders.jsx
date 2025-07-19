// src/pages/MyOrders/MyOrders.jsx

import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets'; // Import assets for parcel_icon

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(url + "/api/order/my-orders", { headers: { token } });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.message || "Failed to fetch orders.");
        console.error("Error fetching orders:", response.data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching orders. Please ensure you are logged in.");
      console.error("Network or API error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setIsLoading(false);
      setError("Please log in to view your orders.");
    }
  }, [token, url]);

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      {isLoading ? (
        <p className="loading-message">Loading your orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders-message">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <img src={assets.parcel_icon} alt="Parcel Icon" className="parcel-icon" />

              {/* Order items summary */}
              <p className="order-items-summary">
                {order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}
              </p>

              {/* Order amount */}
              <p className="order-amount">₹{order.amount}</p>

              {/* Items count */}
              <p className="order-items-count">Items: {order.items.length}</p>

              {/* Status section */}
              <div className="order-status-display">
                <span className={`status-dot ${order.status.toLowerCase().replace(/\s/g, '-')}`}></span>
                <p className="order-status-text">{order.status}</p>
              </div>

              {/* Track Order button */}
              <button onClick={fetchOrders} className="track-order-button">Track Order</button> {/* Added onClick */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
