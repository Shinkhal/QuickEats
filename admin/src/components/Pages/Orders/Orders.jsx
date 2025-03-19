import  { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../../assets/assets";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; 

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      });

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Error updating order status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h3>🛒 Order Management</h3>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.slice().reverse().map((order, index) => (
            <div key={order._id || index} className="order-item">
              <div className="order-header">
                <img src={assets.parcel_icon} alt="Parcel Icon" />
                <span className={`status-label ${order.status.replace(/ /g, "-").toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-item-details">
                <p className="order-item-name">
                  {order.address?.firstName || "Unknown"} {order.address?.lastName || ""}
                </p>
                <p className="order-item-food">
                  {order.items?.length > 0
                    ? order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.name} x {item.quantity}
                          {idx !== order.items.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : "No items"}
                </p>

                <div className="order-item-address">
                  <p>{order.address?.street && `${order.address.street},`}</p>
                  <p>
                    {order.address?.city}, {order.address?.state},{" "}
                    {order.address?.country}, {order.address?.zipcode}
                  </p>
                </div>

                <p className="order-item-phone">
                  📞 {order.address?.phone || "No contact info"}
                </p>
              </div>

              <div className="order-item-footer">
                <div className="item-count">
                  <p>🛍️ {order.items?.length || 0} Items</p>
                </div>

                <div className="amount">
                  <p>💰 ₹{order.amount}</p>
                </div>

                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  disabled={updatingStatus[order._id]}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
