import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { 
  Menu, 
  User, 
  ShoppingBag, 
  LogOut, 
  ChevronDown,
  Home,
  BookOpen,
  Smartphone,
  MessageSquare,
  ShoppingCart
} from "lucide-react";

const Navbar = ({ setShowLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Track cart items count
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // Update cart items count
  useEffect(() => {
    const cartAmount = getTotalCartAmount();
    // We're using the cart amount to determine if there are items
    setCartItemsCount(cartAmount > 0 ? 1 : 0);
  }, [getTotalCartAmount]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const menuLinks = [
    { name: "Home", to: "/", icon: Home },
    { name: "Menu", to: "/menu", icon: BookOpen },
    { name: "Mobile App", href: "/", icon: Smartphone },
    { name: "Contact", to: "/contact", icon: MessageSquare },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <ShoppingCart className="text-green-600 mr-2" size={24} />
          <h1 className="font-bold text-xl text-gray-800">QuickEats</h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {menuLinks.map((link) => {
            const LinkComponent = link.to ? Link : 'a';
            const linkProps = link.to ? { to: link.to } : { href: link.href };
            
            return (
              <LinkComponent
                key={link.name}
                {...linkProps}
                className={`
                  flex items-center gap-1 font-medium transition-colors
                  ${currentPath === (link.to || link.href) 
                    ? "text-green-600" 
                    : "text-gray-700 hover:text-green-600"
                  }
                `}
              >
                {link.name}
              </LinkComponent>
            );
          })}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          {/* Cart with indicator */}
          <Link to="/cart" className="relative p-1 rounded-full hover:bg-gray-100 transition-colors">
            <ShoppingBag 
              size={20} 
              className={`${cartItemsCount > 0 ? 'text-green-600' : 'text-gray-700'}`} 
            />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </Link>

          {/* Auth */}
          {!token ? (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-1"
            >
              <User size={18} />
              <span>Sign In</span>
            </button>
          ) : (
            <div ref={userMenuRef} className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User size={20} className="text-gray-700" />
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-md shadow-lg w-48 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">My Account</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ShoppingBag size={16} />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={22} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {menuLinks.map((link) => {
              const LinkComponent = link.to ? Link : 'a';
              const linkProps = link.to ? { to: link.to } : { href: link.href };
              const Icon = link.icon;
              
              return (
                <LinkComponent
                  key={link.name}
                  {...linkProps}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 p-3 rounded-md w-full transition-colors
                    ${currentPath === (link.to || link.href) 
                      ? "bg-green-50 text-green-600" 
                      : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </LinkComponent>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;