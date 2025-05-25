import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend
} from "recharts";

const Dashboard = ({ url }) => {
  const [data, setData] = useState({
    totalQueries: 0,
    queryResolved: 0,
    pendingQueries: 0,
    pieData: [],
    lineData: [],
    barData: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("adminToken")

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${url}/api/user/queries`, { // Fixed endpoint
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const queryStats = await res.json();

      setData({
        totalQueries: queryStats.totalQueries || 0,
        queryResolved: queryStats.queryResolved || 0,
        pendingQueries: queryStats.pendingQueries || 0,
        pieData: [
          { name: "Resolved", value: queryStats.queryResolved || 0 },
          { name: "Pending", value: queryStats.pendingQueries || 0 },
        ],
        lineData: queryStats.lineData || [],
        barData: queryStats.barData || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, authToken]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "red" }}>Error loading dashboard: {error}</p>
          <button onClick={fetchData} style={{ marginTop: "10px", padding: "8px 16px" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f7f8fc", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>CRM Dashboard</h1>
          <button 
            onClick={fetchData} 
            style={{ 
              padding: "8px 16px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "32px" }}>
          {[
            { title: "Total Queries", value: data.totalQueries, color: "#007bff" },
            { title: "Query Resolved", value: data.queryResolved, color: "#28a745" },
            { title: "Pending Queries", value: data.pendingQueries, color: "#ffc107" },
          ].map((card, idx) => (
            <div key={idx} style={{ 
              backgroundColor: "#fff", 
              padding: "24px", 
              borderRadius: "8px", 
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderLeft: `4px solid ${card.color}`
            }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>{card.title}</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: "0", color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "32px" }}>
          {/* Pie Chart */}
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Query Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={data.pieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#28a745" : "#ffc107"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Query Trends (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={3} dot={{ fill: "#007bff", r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ marginTop: "32px", backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Queries by Expertise</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="queries" fill="#007bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;