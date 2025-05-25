import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle, FaPhone, FaShoppingBag, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";
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
      const response = await axios.get(`${url}/api/order/list`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        }
      });
      const data = response.data;
      if (data.success) {
        setOrders(data.data || []);
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
      const response = await fetch(`${url}/api/order/status`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });
      
      const data = await response.json();
      if (data.success) {
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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'food processing':
        return <FaBoxOpen className="w-4 h-4" />;
      case 'out for delivery':
        return <FaTruck className="w-4 h-4" />;
      case 'delivered':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FaTimesCircle className="w-4 h-4" />;
      default:
        return <FaBoxOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'food processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-2xl">🛒</span>
          Order Management
        </h3>
        <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl text-gray-500 font-medium">No orders found</p>
          <p className="text-gray-400 mt-2">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.slice().reverse().map((order, index) => (
            <div key={order._id || index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Order #{order._id?.slice(-6) || `ORD${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-medium text-sm">{order.status}</span>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer & Address Info */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        👤 Customer Information
                      </h5>
                      <p className="text-lg font-medium text-gray-800">
                        {order.address?.firstName || "Unknown"} {order.address?.lastName || ""}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        📍 Delivery Address
                      </h5>
                      <div className="text-gray-600 space-y-1">
                        {order.address?.street && <p>{order.address.street}</p>}
                        <p>
                          {order.address?.city}, {order.address?.state}
                        </p>
                        <p>
                          {order.address?.country} - {order.address?.zipcode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="w-4 h-4" />
                      <span>{order.address?.phone || "No contact info"}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      🍽️ Order Items
                    </h5>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                      {order.items?.length > 0 ? (
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-1">
                              <span className="text-gray-700">{item.name}</span>
                              <span className="text-sm font-medium text-gray-600">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No items</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaShoppingBag className="w-4 h-4" />
                      <span className="font-medium">{order.items?.length || 0} Items</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <FaMoneyBillWave className="w-4 h-4" />
                      <span className="font-semibold text-lg">₹{order.amount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">
                      Update Status:
                    </label>
                    <select
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                      disabled={updatingStatus[order._id]}
                      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {updatingStatus[order._id] && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;