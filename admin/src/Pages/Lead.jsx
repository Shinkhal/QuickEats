import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeadManagement = ({ url }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [fetched, setFetched] = useState(false); // Track if leads have been fetched

  // Fetch leads from API when button is clicked
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/leads`);
      console.log("API Response:", response.data); // Log API response

      // Ensure response data is an array and assign leadScore = 0 if missing
      const sortedLeads = Array.isArray(response.data.leads)
        ? response.data.leads
            .map((lead) => ({
              ...lead,
              leadScore: lead.leadScore ?? 0, // Assign 0 if leadScore is missing
            }))
            .sort((a, b) => b.leadScore - a.leadScore) // Sort by leadScore descending
        : [];

      setLeads(sortedLeads);
      setFetched(true); // Mark that leads have been fetched
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error(error.response?.data?.message || "Error fetching leads");
      setLeads([]); // Ensure leads is always an array
    } finally {
      setLoading(false);
    }
  };

  // Generate lead data
  const generateLead = async (userId) => {
    setGenerating(userId);
    try {
      const response = await axios.post(`${url}/api/generate-lead`, { userId });
      toast.success(response.data.message);
      fetchLeads(); // Refresh lead list after generating
    } catch (error) {
      toast.error(error.response?.data?.message || "Error generating lead");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Leads"}
          </button>
        </div>

        {/* Lead Table */}
        {!fetched ? (
          <p className="text-center">Click "Fetch Leads" to load data</p>
        ) : loading ? (
          <p>Loading leads...</p>
        ) : leads.length === 0 ? (
          <p>No leads available</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">User ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Lead Score</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.userId} className="text-center">
                  <td className="p-3 border">{lead.userId}</td>
                  <td className="p-3 border">{lead.name}</td>
                  <td className="p-3 border">{lead.email}</td>
                  <td className="p-3 border font-bold">{lead.leadScore}</td>
                  <td className="p-3 border">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                      onClick={() => generateLead(lead.userId)}
                      disabled={generating === lead.userId}
                    >
                      {generating === lead.userId ? "Processing..." : "Generate Lead"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;
