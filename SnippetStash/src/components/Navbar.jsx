import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg py-4 px-6 sticky top-0 z-10">
      <div className="w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-full mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center">
            <div className="bg-purple-600 text-white p-2 rounded-lg shadow-lg mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">SnippetStash</span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600 text-white hover:text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </NavLink>

            <NavLink 
              to="/snippets" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600 text-white  hover:text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Snippets
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;