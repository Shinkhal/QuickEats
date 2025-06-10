import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { StoreContext } from "../context/StoreContext";
import { assets } from "../assets/assets";
import {  Clock, Star, Plus, Minus } from "lucide-react";

const MenuPage = () => {
  const { food_list, cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["All", ...new Set(food_list.map(item => item.category))];

  const filteredItems = food_list.filter(item => {
    const matchesCategory = activeCategory === "All" || activeCategory === item.category;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });


  return (
    <div className="min-h-screen bg-gray-50 mt-20">

      <div className={`bg-white sticky top-0 z-10 transition-shadow ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex space-x-3 overflow-x-auto scrollbar-thin pb-1">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {activeCategory === "All" ? "All Dishes" : activeCategory}
            
          </h2>
          
          <div className="flex items-center">
            <span className="text-gray-600 mr-2 text-sm">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
            >
              <option value="default">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {sortedItems.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedItems.map((item) => (
              <FoodItemCard
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                category={item.category}
                cartItems={cartItems}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                url={url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <img 
              src={assets.empty_icon || "/api/placeholder/150/150"} 
              alt="No results" 
              className="w-24 h-24 mx-auto mb-4 opacity-50"
            />
            <h3 className="text-xl font-medium text-gray-600">No items found</h3>
            <p className="text-gray-500 mt-2">Try changing your search or category filters</p>
            <button 
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced FoodItemCard component
const FoodItemCard = ({ id, name, price, description, image, category, cartItems, addToCart, removeFromCart, url }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden transition duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <img
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            src={url + "/images/" + image}
            alt={name}
          />
        </div>
        <div className="absolute top-3 left-3 bg-green-600 bg-opacity-90 text-white text-xs px-3 py-1 rounded-full shadow-sm">
          {category}
        </div>
        
        {!cartItems[id] ? (
          <button 
            className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer transition transform hover:scale-110 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => addToCart(id)}
            aria-label="Add to cart"
          >
            <Plus size={20} className="text-green-600" />
          </button>
        ) : (
          <div className="absolute bottom-3 right-3 flex items-center bg-white py-1 px-2 rounded-full shadow-md">
            <button
              className="bg-red-100 hover:bg-red-200 text-red-600 h-6 w-6 rounded-full flex items-center justify-center transition-colors"
              onClick={() => removeFromCart(id)}
              aria-label="Remove one"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-semibold w-6 text-center">{cartItems[id]}</span>
            <button
              className="bg-green-100 hover:bg-green-200 text-green-600 h-6 w-6 rounded-full flex items-center justify-center transition-colors"
              onClick={() => addToCart(id)}
              aria-label="Add one"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{name}</h3>
          <span className="font-bold text-green-600 text-lg">₹{price}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-3">{description}</p>
        
        <div className="flex items-center justify-between border-t pt-3 border-gray-100">
          <div className="flex items-center">
            <div className="flex items-center text-amber-400">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-gray-700 ml-1 font-medium">4.2</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock size={14} className="mr-1" />
            <span className="text-xs">20-30 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

FoodItemCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  cartItems: PropTypes.object.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
};

export default MenuPage;