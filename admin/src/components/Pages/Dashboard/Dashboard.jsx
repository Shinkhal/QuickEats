import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend
} from "recharts";

const Dashboard = () => {
  const [selectedTime, setSelectedTime] = useState("1 Week");
  const [data, setData] = useState({
    totalQueries: 0,
    queryResolved: 0,
    pendingQueries: 0,
    pieData: [],
    lineData: [],
    barData: [],
  });

  // Fetch data from backend API
  const fetchData = async () => {
    try {
      const queryStatsResponse = await fetch("http://localhost:5000/api/users/queries");
      const completedQueriesResponse = await fetch("http://localhost:5000/api/users/completed-queries");

      const queryStats = await queryStatsResponse.json();
      const completedQueries = await completedQueriesResponse.json();

      console.log("Query Stats:", queryStats);
      console.log("Completed Queries:", completedQueries);

      setData({
        totalQueries: queryStats.totalQueries || 0,
        queryResolved: completedQueries.length || 0,
        pendingQueries: queryStats.pendingQueries || 0,
        pieData: [
          { name: "Resolved", value: completedQueries.length || 0 },
          { name: "Pending", value: queryStats.pendingQueries || 0 },
        ],
        lineData: queryStats.lineData || [{ name: "Day 1", value: 0 }, { name: "Day 2", value: 0 }],
        barData: queryStats.barData || [{ name: "Jan", queries: 10 }, { name: "Feb", queries: 20 }],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#f7f8fc", padding: "24px", overflow: "auto" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>CRM Dashboard</h1>
          <div style={{ display: "flex", gap: "12px" }}>
            {["1 Day", "1 Week", "1 Month", "1 Year"].map((time) => (
              <button
                key={time}
                style={{
                  padding: "8px 16px",
                  backgroundColor: selectedTime === time ? "#0066cc" : "#f1f5f9",
                  borderRadius: "8px",
                  color: selectedTime === time ? "#fff" : "#333",
                  border: "1px solid #ddd",
                }}
                onClick={() => { setSelectedTime(time); fetchData(); }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
            <h3>Total Queries</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.totalQueries}</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
            <h3>Query Resolved</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.queryResolved}</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
            <h3>Pending Queries</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.pendingQueries}</p>
          </div>
        </div>

        {/* Pie Chart (Resolved vs Pending) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "32px" }}>
          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px" }}>
            <h3>Query Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#82ca9d" : "#ff7300"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart (Trends) */}
          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px" }}>
            <h3>Query Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart (Monthly Queries) */}
        <div style={{ marginTop: "32px", backgroundColor: "#fff", padding: "16px", borderRadius: "8px" }}>
          <h3>Monthly Queries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="queries" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
