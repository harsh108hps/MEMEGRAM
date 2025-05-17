import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import LoginModal from "./LoginModal";
import { auth } from "../../firebase-config";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../contexts/AuthContext";
const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("viewedMemes");
    navigate("/");
  };
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 text-xl font-bold text-pink-500">
              <Link to="/">🧠 MemeGram</Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6">
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "hover:text-pink-500 transition"
                }
              >
                Feed
              </NavLink>

              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "hover:text-pink-500 transition"
                }
              >
                Leaderboard
              </NavLink>
              {user && (
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-500 font-semibold"
                      : "hover:text-pink-500 transition"
                  }
                >
                  Create
                </NavLink>
              )}
              {user && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-500 font-semibold"
                      : "hover:text-pink-500 transition"
                  }
                >
                  Dashboard
                </NavLink>
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
                    className="bg-pink-500 hover:bg-pink-600 text-black px-3 py-1 rounded text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-black px-3 py-1 rounded text-sm"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden flex flex-col gap-4 mt-3 pb-4 border-t border-gray-700">
              <NavLink
                to="/feed"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block ${
                    isActive ? "text-pink-500 font-semibold" : "text-teal-300"
                  }`
                }
              >
                Feed
              </NavLink>
              <NavLink
                to="/create"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block ${
                    isActive ? "text-pink-500 font-semibold" : "text-teal-300"
                  }`
                }
              >
                Create
              </NavLink>
              <NavLink
                to="/leaderboard"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block ${
                    isActive ? "text-pink-500 font-semibold" : "text-teal-300"
                  }`
                }
              >
                Leaderboard
              </NavLink>
              {user && (
                <NavLink
                  to="/dashboard"
                  onClick={toggleMenu}
                  className={({ isActive }) =>
                    `block ${
                      isActive ? "text-pink-500 font-semibold" : "text-teal-300"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
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
                <button
                  to="/login"
                  onClick={() => {
                    setShowLogin(true);
                    toggleMenu();
                  }}
                  className="text-left text-teal-400"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
};

export default Navbar;
