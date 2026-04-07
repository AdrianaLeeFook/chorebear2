import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [notifications, setNotifications] = useState("enabled");
  const [name, setName] = useState(user?.username || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = async () => {
    console.log("user object:", user);
    
    
    if (!name.trim()) {
      setError("name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const res = await fetch(`http://localhost:8080/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "failed to save settings");
        return;
      }

      // Update context + localStorage so the change is reflected everywhere immediately
      updateUser({ username: data.username ?? name.trim() });
      setMessage("settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("something went wrong, please try again");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "bg-[#7a9e7e] text-white text-sm font-medium px-6 py-2 rounded-full w-48 text-center outline-none";
  const inputClass = `${fieldClass} cursor-text`;

  return (
    <div className="min-h-screen bg-[#f5ede3] flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center gap-8 px-8 py-12">

        <div className="flex flex-col gap-7">

          {/* Notifications */}
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

          {/* Role (READ ONLY) */}
          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              house role
            </span>
            <div className={`${fieldClass} capitalize`}>
              {user?.role || "member"}
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setMessage(""); setError(""); }}
              className={inputClass}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#7a9e7e] hover:bg-[#6a8e6e] disabled:opacity-60 text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
            >
              {saving ? "saving..." : "save"}
            </button>
          </div>

          {message && <p className="text-center text-[#4e3728] text-sm">{message}</p>}
          {error && <p className="text-center text-[#c0392b] text-sm">{error}</p>}
        </div>
      </div>

      {/* Logout */}
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
