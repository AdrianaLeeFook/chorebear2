import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { houses, activeHouseIndex } = useAuth();

  const activeHouse = houses?.[activeHouseIndex];

  const hideOn = ["/", "/Landing", "/CreateAccount", "/JoinOrCreateHome", "/JoinHome", "/CreateHome", "/JoinCreateSuccess"];
  if (hideOn.includes(location.pathname)) return null;

  const navLinks = [
    { label: "chores", path: activeHouse ? `/houses/${activeHouse._id}/chores` : "/dashboard" },
    { label: "profile", path: "/homes" },
    { label: "settings", path: "/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-[#f5ede3] border-b border-[#e8d5c4]">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-row items-center justify-between">

        <Link to="/dashboard" className="flex flex-row items-center gap-2 group">
          <img src={logo} alt="chorebear logo" className="h-10 w-auto" />
          <span className="text-[#6b4f3a] font-semibold text-base tracking-wide group-hover:text-[#4e3728] transition-colors">
            chorebear
          </span>
        </Link>

        <ul className="hidden sm:flex flex-row items-center gap-6 list-none m-0 p-0">
          {navLinks.map(({ label, path }) => (
            <li key={label}>
              <Link
                to={path}
                className={`text-sm tracking-wide transition-all duration-150 pb-0.5 no-underline ${
                  isActive(path)
                    ? "text-[#6b4f3a] font-semibold border-b-2 border-[#6b4f3a]"
                    : "text-[#6b4f3a] hover:opacity-60"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="sm:hidden text-[#6b4f3a] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <ul className="sm:hidden flex flex-col gap-2 px-6 pb-3 list-none m-0 p-0">
          {navLinks.map(({ label, path }) => (
            <li key={label}>
              <Link
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm tracking-wide px-3 py-2 rounded-lg transition-colors no-underline ${
                  isActive(path)
                    ? "bg-[#e8d5c4] text-[#6b4f3a] font-semibold"
                    : "text-[#6b4f3a] hover:bg-[#eddfd2]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;