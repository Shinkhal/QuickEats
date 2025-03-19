import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import "chart.js/auto";

const Home = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const allOrders = response.data.data || [];
        setOrders(allOrders);
        setTotalRevenue(allOrders.reduce((sum, order) => sum + order.amount, 0));
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!userId) {
      toast.warning("Please enter a User ID.");
      return;
    }
    try {
      const response = await axios.post(`${url}/api/order/userorders`, { userId });
      if (response.data.success) {
        setUserOrders(response.data.data || []);
      } else {
        toast.error("Failed to fetch user orders");
      }
    } catch (error) {
      console.error("Fetch User Orders Error:", error);
      toast.error("Error fetching user orders");
    }
  };

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#f39c12", "#2980b9", "#27ae60", "#e74c3c"],
      },
    ],
  };

  const revenueData = {
    labels: orders.map((order, index) => `Order ${index + 1}`),
    datasets: [
      {
        label: "Revenue (₹)",
        data: orders.map((order) => order.amount),
        backgroundColor: "#3498db",
      },
    ],
  };

  return (
    <div className=" bg-gradient-to-br from-blue-100 via-purple-200 to-blue-300 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
            { label: "Pending Orders", value: statusCounts["Food Processing"] || 0 },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-70 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <motion.div
            className="bg-white bg-opacity-70 p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-center mb-4">Order Status Distribution</h3>
            <Pie data={pieChartData} />
          </motion.div>

          <motion.div
            className="bg-white bg-opacity-70 p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-center mb-4">Revenue Trend</h3>
            <Bar data={revenueData} />
          </motion.div>
        </div>

        {/* User Order Search */}
        <div className="mt-10 max-w-lg mx-auto">
          <h3 className="text-xl font-semibold text-center mb-4">Find Orders by User</h3>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-900"
            />
            <motion.button
              onClick={fetchUserOrders}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-200 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </div>

          {/* Display User Orders */}
          {userOrders.length > 0 && (
            <div className="mt-6 bg-white bg-opacity-70 p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-center mb-3">Orders for User: {userId}</h4>
              <ul className="space-y-3">
                {userOrders.map((order) => (
                  <li
                    key={order._id}
                    className="p-4 bg-gray-200 text-gray-900 rounded-lg shadow-md"
                  >
                    <strong>Order ID:</strong> {order._id} | <strong>Status:</strong>{" "}
                    {order.status} | <strong>Amount:</strong> ₹{order.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
