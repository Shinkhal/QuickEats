import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Plus, 
  List, 
  ShoppingBag 
} from 'lucide-react';

const Sidebar = () => {
  const navigationItems = [
    {
      to: '/',
      icon: Home,
      label: 'Home',
      description: 'Dashboard overview'
    },
    {
      to: '/dashboard',
      icon: MessageSquare,
      label: 'Queries',
      description: 'Customer inquiries'
    },
    {
      to: '/leads',
      icon: Users,
      label: 'Leads',
      description: 'Potential customers'
    },
    {
      to: '/add',
      icon: Plus,
      label: 'Add Items',
      description: 'Create new products'
    },
    {
      to: '/list',
      icon: List,
      label: 'List Items',
      description: 'Manage inventory'
    },
    {
      to: '/orders',
      icon: ShoppingBag,
      label: 'Orders',
      description: 'Order management'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
     

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent 
                      className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        isActive ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Administrator
            </p>
            <p className="text-xs text-gray-500 truncate">
              admin@company.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;