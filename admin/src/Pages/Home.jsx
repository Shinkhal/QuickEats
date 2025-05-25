import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

// Utility Components
const Loader = ({ message }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  </div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
    <p className="text-sm text-red-600">{error}</p>
    <button 
      onClick={onRetry}
      className="text-sm text-red-800 underline mt-1"
    >
      Try again
    </button>
  </div>
);

const Home = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const getAuthToken = () => localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getAuthToken();
      const res = await fetch(`${url}/api/order/allorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setTotalRevenue(data.orders.reduce((sum, order) => sum + (order.amount || 0), 0));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
      setOrders([]);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!userId.trim()) return alert("Please enter a User ID.");

    setSearchLoading(true);
    setError("");
    try {
      const token = getAuthToken();
      const res = await fetch(`${url}/api/order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setUserOrders(data.success ? data.orders : []);
    } catch (err) {
      console.error("Error fetching user orders:", err);
      setError("Failed to fetch user orders");
      setUserOrders([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [url]);

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "#6B7280", "#374151", "#9CA3AF",
          "#D1D5DB", "#4B5563", "#E5E7EB"
        ],
        borderWidth: 0,
      },
    ],
  };

  const revenueData = {
    labels: orders.map((_, i) => `#${i + 1}`),
    datasets: [{
      label: "Revenue (₹)",
      data: orders.map(order => order.amount || 0),
      backgroundColor: "#374151",
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 12 } },
      },
      y: {
        grid: { color: "#F3F4F6" },
        ticks: { color: "#6B7280", font: { size: 12 } },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          color: "#374151",
          font: { size: 12 },
        },
      },
    },
  };

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your order management system</p>
        </div>

        {error && <ErrorMessage error={error} onRetry={fetchOrders} />}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Orders", value: orders.length, sub: "All time" },
            { label: "Total Revenue", value: `₹${totalRevenue}`, sub: "All time" },
            { label: "Pending Orders", value: statusCounts["Food Processing"] || 0, sub: "Awaiting processing" }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Order Status</h3>
            <p className="text-sm text-gray-600 mb-4">Distribution of order statuses</p>
            <div className="h-64">
              {Object.keys(statusCounts).length > 0
                ? <Pie data={pieChartData} options={pieOptions} />
                : <div className="flex items-center justify-center h-full text-gray-500">No order data available</div>}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Revenue by Order</h3>
            <p className="text-sm text-gray-600 mb-4">Individual order amounts</p>
            <div className="h-64">
              {orders.length > 0
                ? <Bar data={revenueData} options={chartOptions} />
                : <div className="flex items-center justify-center h-full text-gray-500">No revenue data available</div>}
            </div>
          </div>
        </div>

        {/* User Search */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-1">User Orders</h3>
          <p className="text-sm text-gray-600 mb-4">Search by user ID</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchUserOrders()}
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-gray-500"
              placeholder="Enter User ID"
            />
            <button
              onClick={fetchUserOrders}
              disabled={searchLoading}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {userOrders.length > 0 && (
            <div className="border-t pt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">
                Orders for User: <span className="font-mono text-gray-600">{userId}</span>
              </h4>
              {userOrders.map(order => (
                <div key={order._id} className="p-4 bg-gray-50 rounded-md border">
                  <p className="text-sm text-gray-900 font-medium">Order #{order._id}</p>
                  <p className="text-xs text-gray-600">Amount: ₹{order.amount || 0}</p>
                  <p className="text-xs text-gray-600">Status: {order.status || "N/A"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
