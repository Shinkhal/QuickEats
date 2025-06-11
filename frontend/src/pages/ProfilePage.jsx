import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { assets } from '../assets/assets';

const ProfilePage = () => {
  const { url, token, userId } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        await Promise.all([fetchProfile(), fetchOrders()]);
      }
      setLoading(false);
    };
    fetchData();
    fetchOrders();
  }, [token]);

  // Calculate total orders and total spent
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-gray-600 font-medium text-center">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-gray-600 font-medium">No user data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-200 py-4 sm:py-6 lg:py-8 px-4 mt-16">
      <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account and view your order history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
          {/* Total Orders Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold">{totalOrders}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Spent Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Total Spent</p>
                <p className="text-xl sm:text-3xl font-bold">₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Order Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Average Order</p>
                <p className="text-xl sm:text-3xl font-bold">₹{totalOrders > 0 ? Math.round(totalSpent / totalOrders).toLocaleString() : 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Information</h2>
            </div>
          </div>
          
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200">
                  <p className="text-gray-900 font-medium text-sm sm:text-base">{user.name}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200">
                  <p className="text-gray-900 font-medium text-sm sm:text-base break-all">{user.email}</p>
                </div>
              </div>
              
              {user.age && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                  <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200">
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{user.age} years</p>
                  </div>
                </div>
              )}
              
              {user.gender && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200">
                    <p className="text-gray-900 font-medium text-sm sm:text-base capitalize">{user.gender}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 rounded-full p-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order History</h2>
              </div>
              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
              >
                {ordersLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {ordersLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-4">📦</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 text-sm sm:text-base">Your order history will appear here once you make your first purchase</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                        <div className="bg-blue-100 rounded-full p-2 sm:p-3 self-start">
                          <img
                            src={assets.parcel_icon}
                            alt="Order"
                            className="w-6 h-6 sm:w-8 sm:h-8"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-semibold mb-2 text-base sm:text-lg leading-tight">
                            {order.items
                              .map((item) => `${item.name} × ${item.quantity}`)
                              .join(', ')}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                              <span>{order.items.length} items</span>
                            </div>
                            {order.date && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>{new Date(order.date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col lg:flex-col justify-between sm:justify-end lg:text-right sm:items-end lg:items-end space-x-4 sm:space-x-0 lg:space-x-0">
                        <div className="flex flex-col sm:items-end lg:items-end">
                          <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">₹{order.amount.toLocaleString()}</p>
                          <div className="flex items-center space-x-2 mb-2 sm:mb-4">
                            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              order.status === 'delivered' ? 'bg-green-500' :
                              order.status === 'processing' ? 'bg-yellow-500' :
                              order.status === 'shipped' ? 'bg-blue-500' : 'bg-gray-400'
                            }`}></span>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize bg-gray-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={fetchOrders}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap self-end sm:self-auto"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;