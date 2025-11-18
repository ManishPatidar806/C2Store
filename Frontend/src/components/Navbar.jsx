import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setToken("");
    setCartItems({});
  };

  const navItems = [
    { to: "/", label: "HOME" },
    { to: "/collection", label: "COLLECTION" },
    { to: "/about", label: "ABOUT" },
    { to: "/contact", label: "CONTACT" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-neutral-200"
          : "bg-white"
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <Link to="/" className="hover-lift">
            <img
              src={assets.logo}
              className="h-8 md:h-10 w-auto"
              alt="ClothStore"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                                    relative py-2 px-1 text-sm font-medium tracking-wide transition-all duration-300
                                    ${
                                      isActive
                                        ? "text-primary-600"
                                        : "text-neutral-700 hover:text-primary-600"
                                    }
                                    before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 
                                    before:bg-primary-600 before:transform before:scale-x-0 before:origin-left
                                    before:transition-transform before:duration-300
                                    ${
                                      isActive
                                        ? "before:scale-x-100"
                                        : "hover:before:scale-x-100"
                                    }
                                `}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Profile Dropdown */}
            <div className="relative group">
              <button
                onClick={() => (token ? null : navigate("/login"))}
                className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                aria-label="User profile"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {token && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-medium border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    <button 
                      onClick={() => navigate("/profile")}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/orders")}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      Orders
                    </button>
                    <hr className="my-1 border-neutral-200" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-semantic-error hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-all duration-200 hover-lift"
              aria-label={`Cart with ${getCartCount()} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 2.25h1.477a1.5 1.5 0 011.44 1.073l.332 1.11m0 0l1.2 4.002m-.001 0L7.5 15.75H19.5l2.25-9H5.5m-.001 0h15.75M7.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                />
              </svg>

              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs font-medium flex items-center justify-center rounded-full animate-bounce-soft">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setVisible(true)}
              className="lg:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-all duration-200"
              aria-label="Open menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          visible ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setVisible(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-strong transition-transform duration-300 transform ${
            visible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-neutral-900">Menu</h2>
              <button
                onClick={() => setVisible(false)}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => `
                                        block py-3 px-4 rounded-xl text-base font-medium transition-all duration-200
                                        ${
                                          isActive
                                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                                            : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                                        }
                                    `}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User Actions */}
            {token && (
              <div className="mt-8 pt-6 border-t border-neutral-200 space-y-2">
                <button className="w-full text-left py-3 px-4 rounded-xl text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200">
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setVisible(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200"
                >
                  Orders
                </button>
                <button
                  onClick={() => {
                    logout();
                    setVisible(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl text-base font-medium text-semantic-error hover:bg-red-50 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
