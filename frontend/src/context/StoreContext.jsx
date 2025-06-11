import { createContext, useEffect, useState, useMemo } from "react";
import { food_list as initialFoodList } from "../assets/assets"; // renamed to avoid conflict
import axios from "axios";
import { jwtDecode } from "jwt-decode";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState(initialFoodList);
  const url = import.meta.env.VITE_PUBLIC_BACKEND_URL;

  const addToCart = async (itemId) => {
    const newCartItems = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    };

    setCartItems(newCartItems);

    try {
      if (token) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: Math.max((cartItems[itemId] || 1) - 1, 0),
    };
    setCartItems(updatedCart);

    try {
      if (token) {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = foodList.find((product) => product._id === itemId);
      return item ? total + item.price * cartItems[itemId] : total;
    }, 0);
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`,);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const decoded = jwtDecode(storedToken);
          setUserId(decoded.id);
          await loadCartData(storedToken);
        } catch (error) {
          console.error("Invalid token or failed to decode/load data:", error);
        }
      }
    };
    loadData();
  }, []);

  const contextValue = useMemo(
    () => ({
      food_list: foodList,
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      url,
      setToken,
      token,
      userId,
    }),
    [cartItems, foodList, token, userId]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
