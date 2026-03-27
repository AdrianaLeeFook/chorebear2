import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  // ── Mock State (replace with real user data later) ──────────────────────────
  const [notifications, setNotifications] = useState("enabled");
  const [language, setLanguage] = useState("english");
  const [username, setUsername] = useState("Jessica123");
  const [password, setPassword] = useState("p@ssw0rd");

  const handleLogout = () => {
    // Replace with real logout logic later
    navigate("/login");
  };

  const fieldClass = "bg-[#7a9e7e] text-white text-sm font-medium px-6 py-2 rounded-full w-48 text-center outline-none";
  const inputClass = `${fieldClass} cursor-text`;

  return (
    <div className="min-h-screen bg-[#f5ede3] flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center gap-8 px-8 py-12">

        {/* Settings Rows */}
        <div className="flex flex-col gap-7">

          {/* Push Notifications */}
          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              push notifications
            </span>
            <select
              value={notifications}
              onChange={(e) => setNotifications(e.target.value)}
              className={`${fieldClass} cursor-pointer appearance-none`}
            >
              <option value="enabled">enabled</option>
              <option value="disabled">disabled</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              language
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`${fieldClass} cursor-pointer appearance-none`}
            >
              <option value="english">english</option>
              <option value="spanish">spanish</option>
              <option value="french">french</option>
            </select>
          </div>

          {/* Username */}
          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              password
            </span>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Log Out Button — bottom right */}
      <div className="flex justify-end px-8 pb-8">
        <button
          onClick={handleLogout}
          className="bg-[#7a9e7e] hover:bg-[#6a8e6e] text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
        >
          log out
        </button>
      </div>
    </div>
  );
};

export default Settings;