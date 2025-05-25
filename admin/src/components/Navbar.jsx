import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = ({ onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count
  const [adminData, setAdminData] = useState(null);

  // Get admin data from localStorage on component mount
  useEffect(() => {
    const getAdminData = () => {
      try {
        const storedAdminData = localStorage.getItem('adminData');
        if (storedAdminData) {
          setAdminData(JSON.parse(storedAdminData));
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
        setAdminData(null);
      }
    };

    getAdminData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      toast.success('Logged out successfully');
      setIsProfileOpen(false);
      
      // Call the parent logout function
      if (onLogout) {
        onLogout();
      }
    }
  };

  const handleProfileSettings = () => {
    setIsProfileOpen(false);
    // Navigate to profile settings
    console.log('Navigate to profile settings');
    toast.info('Profile settings coming soon');
  };

  const handleAccountSettings = () => {
    setIsProfileOpen(false);
    // Navigate to account settings
    console.log('Navigate to account settings');
    toast.info('Account settings coming soon');
  };

  // Get admin name initial for avatar
  const getAdminInitial = () => {
    if (adminData?.name) {
      return adminData.name.charAt(0).toUpperCase();
    } else if (adminData?.email) {
      return adminData.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  // Get admin display name
  const getDisplayName = () => {
    return adminData?.name || 'Admin User';
  };

  // Get admin email
  const getAdminEmail = () => {
    return adminData?.email || 'admin@quickeats.com';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QE</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">QuickEats Admin</h1>
            </div>
          </button>
        </div>

        {/* Center Section - Search (Optional) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">{notifications}</span>
              </span>
            )}
          </button>

          {/* Settings */}
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={handleProfileToggle}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{getAdminInitial()}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">{getAdminEmail()}</p>
                </div>
                
                <button 
                  onClick={handleProfileSettings}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-3 text-gray-400" />
                  Profile Settings
                </button>
                
                <button 
                  onClick={handleAccountSettings}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Settings className="h-4 w-4 mr-3 text-gray-400" />
                  Account Settings
                </button>
                
                <div className="border-t border-gray-200 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;