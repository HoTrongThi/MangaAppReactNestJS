import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./Input";

export const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex w-full items-center justify-between px-6 py-3 bg-stone-900 shadow-lg">
      <div className="flex items-center space-x-8">
        <Link
          to={"/"}
          className="text-3xl font-bold text-white hover:text-blue-400 transition-colors"
        >
          MangaApp
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to={"/library"}
            className="text-white hover:text-blue-400 transition-colors"
          >
            Library
          </Link>
          <Link
            to={"/history"}
            className="text-white hover:text-blue-400 transition-colors"
          >
            History
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-[600px]">
           <Input />
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">
              {user.username}
            </span>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Admin Panel
              </Link>
            )}
            {user.role === 'contributor' && (
              <Link
                to="/contributor"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Contributor Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
