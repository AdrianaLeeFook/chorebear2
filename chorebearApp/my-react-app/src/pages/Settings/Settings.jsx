import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState("enabled");
  const [role, setRole] = useState("house owner");
  const [name, setName] = useState("Jessica");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleLogout = () => {
    navigate("/");
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    }
  };

  const fieldClass =
    "bg-[#7a9e7e] text-white text-sm font-medium px-6 py-2 rounded-full w-48 text-center outline-none";
  const inputClass = `${fieldClass} cursor-text`;

  return (
    <div className="min-h-screen bg-[#f5ede3] flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center gap-8 px-8 py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-[#d9d9d9] flex items-center justify-center">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#6b4b3e] text-sm">no photo</span>
            )}
          </div>

          <label className="bg-[#7a9e7e] hover:bg-[#6a8e6e] text-white text-sm font-medium px-6 py-2 rounded-full cursor-pointer transition-colors">
            change profile picture
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex flex-col gap-7">
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

          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              house role
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`${fieldClass} cursor-pointer appearance-none`}
            >
              <option value="admin">admin</option>
              <option value="house owner">house owner</option>
              <option value="member">member</option>
            </select>
          </div>

          <div className="flex flex-row items-center gap-8">
            <span className="text-[#4e3728] font-semibold text-lg w-52 text-right">
              name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

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