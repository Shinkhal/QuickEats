import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const initializeRazorpayPayment = (orderData) => {
    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: "INR",
      name: "Food Delivery App",
      description: `Order #${orderData.order_id}`,
      order_id: orderData.order_id,
      handler: async (response) => {
        try {
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: orderData.ord_id,
          };
          const verifyUrl = `${url}/api/order/verify`;
          const { data } = await axios.post(verifyUrl, verificationData);
          if (data.success) {
            navigate(`/verify?success=${true}&orderId=${orderData.ord_id}`);
          } else {
            navigate("/");
          }
        } catch (error) {
          console.log(error);
        }
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phone,
      },
      notes: {
        address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayCheckout = new window.Razorpay(options);
    razorpayCheckout.open();
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        initializeRazorpayPayment(response.data);
      } else {
        alert("Error creating order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was a problem placing your order. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 lg:mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Fill in your delivery details and proceed to payment
          </p>
        </div>

        <form onSubmit={placeOrder} className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left side - Delivery Information */}
          <div className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  Delivery Information
                </h2>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    required
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                    type="text"
                    placeholder="Enter first name"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    required
                    name="lastName"
                    onChange={onChangeHandler}
                    value={data.lastName}
                    type="text"
                    placeholder="Enter last name"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  required
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Phone */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  required
                  name="phone"
                  onChange={onChangeHandler}
                  value={data.phone}
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Street Address */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  required
                  name="street"
                  onChange={onChangeHandler}
                  value={data.street}
                  type="text"
                  placeholder="Enter street address"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    required
                    name="city"
                    onChange={onChangeHandler}
                    value={data.city}
                    type="text"
                    placeholder="Enter city"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    required
                    name="state"
                    onChange={onChangeHandler}
                    value={data.state}
                    type="text"
                    placeholder="Enter state"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Zip Code and Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code *
                  </label>
                  <input
                    required
                    name="zipcode"
                    onChange={onChangeHandler}
                    value={data.zipcode}
                    type="text"
                    placeholder="Enter zip code"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    required
                    name="country"
                    onChange={onChangeHandler}
                    value={data.country}
                    type="text"
                    placeholder="Enter country"
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Cart totals */}
          <div className="w-full lg:w-80 xl:w-96">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-20">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    Order Summary
                  </h2>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex justify-between items-center text-gray-700">
                    <p className="text-sm sm:text-base">Subtotal</p>
                    <p className="text-sm sm:text-base font-semibold">₹{getTotalCartAmount().toLocaleString()}</p>
                  </div>
                  
                  <div className="border-t border-gray-200"></div>
                  
                  <div className="flex justify-between items-center text-gray-700">
                    <p className="text-sm sm:text-base">Delivery Fee</p>
                    <p className="text-sm sm:text-base font-semibold">
                      ₹{getTotalCartAmount() === 0 ? 0 : 2}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200"></div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-base sm:text-lg font-bold text-gray-900">Total</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                      ₹{(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>PROCEED TO PAYMENT</span>
                  </div>
                </button>
                
                {/* Payment Methods Info */}
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Secure payment powered by</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xs sm:text-sm font-semibold text-blue-600">Razorpay</span>
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;