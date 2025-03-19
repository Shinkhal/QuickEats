import React, { useState, useEffect } from "react";
import Cards from "../Cards";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
import PendingQueriesTable from "../PendingQueriesTable"; // Import the table component
import { fetchDummyData } from "../services/dataService";

const Dashboard = () => {
  const [selectedTime, setSelectedTime] = useState("1 Week");
  const [data, setData] = useState({
    totalQueries: 0,
    queryResolved: 0,
    pendingQueries: 0,
    pieData: [0, 0],
    lineData: [0, 0, 0, 0, 0],
    barData: [10, 20, 15, 25, 18, 30, 22, 28], // Dummy data for BarChart
  });

  // Function to fetch data based on the selected time range
  const handleTimeSelect = async (timeRange) => {
    setSelectedTime(timeRange);
    const fetchedData = await fetchDummyData(timeRange);
    setData({
      totalQueries: fetchedData.totalQueries,
      queryResolved: fetchedData.queryResolved,
      pendingQueries: fetchedData.pendingQueries,
      pieData: fetchedData.pieData,
      lineData: fetchedData.lineData,
      barData: fetchedData.barData,
    });
  };

  useEffect(() => {
    handleTimeSelect(selectedTime);
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
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}>
          <Cards title="Total Queries" value={data.totalQueries} />
          <Cards title="Query Resolved" value={data.queryResolved} />
          <Cards title="Pending Queries" value={data.pendingQueries} />
        </div>

        {/* Charts Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "32px",
        }}>
          <PieChart key={selectedTime + "-pie"} data={data.pieData} />
          <LineChart key={selectedTime + "-line"} data={data.lineData} />
        </div>

        {/* Bar Chart Section */}
        <div style={{ marginTop: "32px" }}>
          <BarChart data={data.barData} />
        </div>

        {/* Pending Queries Table Section */}
        <PendingQueriesTable />

      </div>
    </div>
  );
};

export default Dashboard;
