import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, Tag } from "lucide-react";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const hasItems = Object.values(cartItems).some(quantity => quantity > 0);

  return (
    <div className="bg-neutral-300 min-h-screen">
      <div className="p-4 md:p-8 max-w-7xl mx-auto mt-16">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-green-600" size={28} />
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>
        
        {hasItems ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart items section */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="hidden md:grid grid-cols-12 gap-4 font-medium text-gray-600 border-b border-gray-200 pb-4">
                <p className="col-span-5">Item</p>
                <p className="col-span-2 text-center">Price</p>
                <p className="col-span-2 text-center">Quantity</p>
                <p className="col-span-2 text-center">Total</p>
                <p className="col-span-1 text-center">Action</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {food_list.map((item) => {
                  if (cartItems[item._id] > 0) {
                    return (
                      <div key={item._id} className="py-4">
                        {/* Desktop view */}
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-5 flex items-center gap-4">
                            <img
                              src={url + "/images/" + item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <p className="font-medium text-gray-800">{item.name}</p>
                          </div>
                          <p className="col-span-2 text-gray-700 text-center">₹{item.price}</p>
                          <p className="col-span-2 text-center">
                            <span className="inline-flex items-center justify-center bg-gray-100 rounded-md px-3 py-1">
                              {cartItems[item._id]}
                            </span>
                          </p>
                          <p className="col-span-2 font-semibold text-gray-900 text-center">
                            ₹{item.price * cartItems[item._id]}
                          </p>
                          <div className="col-span-1 flex justify-center">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-500 hover:text-red-700 transition p-2"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Mobile view */}
                        <div className="md:hidden flex flex-col gap-3">
                          <div className="flex gap-3">
                            <img
                              src={url + "/images/" + item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-gray-700">₹{item.price} x {cartItems[item._id]}</p>
                              <p className="font-semibold text-gray-900">
                                Total: ₹{item.price * cartItems[item._id]}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-500 hover:text-red-700 transition p-2 flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/")}
                  className="text-green-600 hover:text-green-800 font-medium flex items-center gap-2"
                >
                  <span>← Continue Shopping</span>
                </button>
              </div>
            </div>

            {/* Order summary section */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">₹{getTotalCartAmount()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Delivery Fee</p>
                    <p className="font-medium">₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <p className="font-medium text-gray-800">Total</p>
                    <p className="font-bold text-gray-900">₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate("/order")}
                  disabled={getTotalCartAmount() === 0}
                  className={`mt-6 w-full py-3 rounded-md text-white font-medium transition flex items-center justify-center gap-2 ${
                    getTotalCartAmount() === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <span>Proceed to Checkout</span>
                </button>
                
                {/* Promo code section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={18} className="text-gray-600" />
                    <p className="font-medium text-gray-700">Promo Code</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <button className="bg-gray-200 text-gray-800 font-medium p-2 rounded-md hover:bg-gray-300 transition text-sm">
                      Apply Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag size={64} className="text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-green-600 text-white font-medium px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;