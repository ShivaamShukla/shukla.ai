import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, Shield } from 'lucide-react';

const DashboardNav = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <span className="text-xl font-bold text-gray-900">emergent</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Projects
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.subscription?.plan || 'free'}</div>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <Link
                  to="/settings"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Settings</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left border-t border-gray-100 mt-2 pt-2"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;