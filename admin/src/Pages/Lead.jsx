import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LeadManagement = ({ url }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(new Set());
  const [batchUpdating, setBatchUpdating] = useState(false);

  // Get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, []);

  // Fetch leads from API
  const fetchLeads = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/lead/leads`, { headers });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch leads");
      }

      const sortedLeads = Array.isArray(response.data.leads)
        ? response.data.leads
            .filter(lead => lead.name && lead.email) // Filter out leads without user data
            .map((lead) => ({
              ...lead,
              leadScore: lead.leadScore ?? 0,
              leadQuality: lead.leadQuality || 'Unknown',
              cartAbandonmentRate: lead.cartAbandonmentRate ?? 0,
              orderFrequency: lead.orderFrequency ?? 0,
              sessionDuration: lead.sessionDuration ?? 0,
            }))
            .sort((a, b) => b.leadScore - a.leadScore)
        : [];

      setLeads(sortedLeads);
      if (sortedLeads.length > 0) {
        toast.success(`Successfully loaded ${sortedLeads.length} leads`);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error fetching leads";
      toast.error(errorMessage);
      setLeads([]);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        // You might want to redirect to login page here
      }
    } finally {
      setLoading(false);
    }
  }, [url, getAuthHeaders]);

  // Load leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Generate lead data for a specific user
  const generateLead = useCallback(async (userId) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setGenerating(prev => new Set([...prev, userId]));
    try {
      const response = await axios.post(
        `${url}/api/lead/generate-lead`, 
        { userId }, 
        { headers }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Update the specific lead in the list instead of refetching all
        if (response.data.data) {
          setLeads(prevLeads => 
            prevLeads.map(lead => 
              lead.userId === userId 
                ? { ...lead, ...response.data.data, name: lead.name, email: lead.email }
                : lead
            )
          );
        } else {
          // Fallback to refetch if no data returned
          fetchLeads();
        }
      } else {
        throw new Error(response.data.message || "Failed to generate lead");
      }
    } catch (error) {
      console.error("Error generating lead:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error generating lead";
      toast.error(errorMessage);
    } finally {
      setGenerating(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [url, getAuthHeaders, fetchLeads]);

  // Batch update all leads
  const batchUpdateLeads = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setBatchUpdating(true);
    try {
      const response = await axios.post(
        `${url}/api/lead/update-all-leads`,
        {},
        { headers }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        setLeads(response.data.data.leads || []);
      } else {
        throw new Error(response.data.message || "Failed to update leads");
      }
    } catch (error) {
      console.error("Error updating all leads:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error updating leads";
      toast.error(errorMessage);
    } finally {
      setBatchUpdating(false);
    }
  }, [url, getAuthHeaders]);

  // Get lead quality badge color
  const getQualityColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format percentage
  const formatPercentage = (value) => {
    return typeof value === 'number' ? `${value.toFixed(1)}%` : '0%';
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lead Management</h2>
            <p className="text-gray-600 mt-1">
              {!loading && `${leads.length} users registered`}
            </p>
          </div>
          <div className="flex gap-3">
            {!loading && leads.length > 0 && (
              <button
                onClick={batchUpdateLeads}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                disabled={batchUpdating}
              >
                {batchUpdating ? "Updating..." : "Update All Scores"}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading user data...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cart Abandonment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">{lead.email || 'No email'}</div>
                        <div className="text-xs text-gray-400">ID: {lead.userId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-2xl font-bold text-gray-900">{lead.leadScore}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityColor(lead.leadQuality)}`}>
                        {lead.leadQuality}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.orderFrequency}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{formatPercentage(lead.cartAbandonmentRate)}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{formatDuration(lead.sessionDuration)}</td>
                    <td className="px-4 py-4">
                      <button
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        onClick={() => generateLead(lead.userId)}
                        disabled={generating.has(lead.userId)}
                      >
                        {generating.has(lead.userId) ? (
                          <>
                            <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Updating...
                          </>
                        ) : (
                          "Update Score"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;