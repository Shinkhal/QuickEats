import { useContext } from "react";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between">
      <div className="relative">
        <img
          className="w-full h-48 object-cover rounded-xl"
          src={url + "/images/" + image}
          alt={name}
        />
        {!cartItems[id] ? (
          <img
            className="w-8 h-8 absolute bottom-2 right-2 cursor-pointer"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="absolute bottom-2 right-2 flex items-center space-x-2 bg-white p-1 rounded-full shadow">
            <img
              className="w-6 h-6 cursor-pointer"
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p className="text-sm font-semibold">{cartItems[id]}</p>
            <img
              className="w-6 h-6 cursor-pointer"
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-lg font-semibold text-gray-800">{name}</p>
          <img className="w-16" src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <p className="text-primary font-bold text-lg">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
