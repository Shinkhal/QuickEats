import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { assets } from '../assets/assets';

const MyOrders = () => {
  const { url, token, userId ,} = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchOrders();
    }
  }, [token, userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      <div className="space-y-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading orders...</div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No orders found.</p>
        ) : (
          data.map((order, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md"
            >
              <img
                src={assets.parcel_icon}
                alt="Parcel Icon"
                className="w-12 h-12 object-contain"
              />
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  {order.items
                    .map((item) => `${item.name} x ${item.quantity}`)
                    .join(', ')}
                </p>
                <p className="text-gray-600 mt-1">Items: {order.items.length}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">₹{order.amount}.00</p>
                <p className="flex items-center text-sm mt-1">
                  <span className="mr-1 text-green-500">&#9679;</span>
                  <b className="capitalize">{order.status}</b>
                </p>
                <button
                  onClick={fetchOrders}
                  className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Refresh
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
