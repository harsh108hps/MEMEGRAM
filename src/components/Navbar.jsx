import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
const Navbar = ({ user }) => {
  // const auth = getAuth();
  // const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = async () => {
    // await signOut(auth);
    navigate("/");
  };
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-teal-400">
            <Link to="/">🧠 MemeHub</Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/feed" className="hover:text-teal-300 transition">
              Feed
            </Link>
            <Link to="/create" className="hover:text-teal-300 transition">
              Create
            </Link>
            <Link to="/leaderboard" className="hover:text-teal-300 transition">
              Leaderboard
            </Link>
            {user && (
              <Link to="/dashboard" className="hover:text-teal-300 transition">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth + Hamburger */}
          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-300 hidden sm:inline">
                  👋 {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-teal-400 hover:bg-teal-500 text-black px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-teal-400 hover:bg-teal-500 text-black px-3 py-1 rounded text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-3 pb-4 border-t border-gray-700">
            <Link
              to="/feed"
              onClick={toggleMenu}
              className="block text-teal-300"
            >
              Feed
            </Link>
            <Link
              to="/create"
              onClick={toggleMenu}
              className="block text-teal-300"
            >
              Create
            </Link>
            <Link
              to="/leaderboard"
              onClick={toggleMenu}
              className="block text-teal-300"
            >
              Leaderboard
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className="block text-teal-300"
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-left text-red-400"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="text-left text-teal-400"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
