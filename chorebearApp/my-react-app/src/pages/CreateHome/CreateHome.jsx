import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function CreateHome() {
  const navigate = useNavigate();

  const [homeName, setHomeName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [adminType, setAdminType] = useState("");
  const [error, setError] = useState("");
  const { user, joinHouse } = useAuth();
  // const { user } = useAuth();
  // console.log("Current user:", user);

  const handleCreate = async () => {
  if (!homeName.trim() || !guestCount || !adminType) {
    setError("please complete all fields");
    return;
  }

  setError("");

  try {
    console.log("User:", user);
  console.log("Sending:", { name: homeName, createdBy: user._id });
    const res = await fetch("http://localhost:8080/api/houses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: homeName,
        createdBy: user._id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong.");
      return;
    }

    joinHouse(data); // ← now data exists
    navigate("/JoinCreateSuccess", {
      state: {
        type: "create",
        homeName: data.name,
        houseCode: data.code,
        guestCount,
        adminType,
      },
    });
  } catch (err) {
     console.log("Full error:", err);
    setError("Could not connect to server.");
  }
};

  return (
    <main className="min-h-screen bg-[#eadbc9] flex items-center justify-center px-6">
      <section className="w-full max-w-[1200px] flex flex-col items-center text-center -mt-10 pt-16">
        
        {/* Title */}
        <h1
          className="text-[#6b4b3e] mb-10"
          style={{
            fontSize: "clamp(3.2rem, 5.2vw, 5rem)",
            lineHeight: 1,
            fontWeight: 600,
            
          }}
        >
          create your home
        </h1>

        <div className="w-full max-w-[560px] text-left">
          
          {/* Home Name */}
          <label
            className="block text-[#6b4b3e] mb-2"
            style={{
              fontSize: "2rem",
            }}
          >
            name your home:
          </label>

          <input
            type="text"
            value={homeName}
            onChange={(e) => setHomeName(e.target.value)}
            placeholder="type here.."
            className="w-full h-[72px] rounded-[14px] bg-[#f2eded] px-5 text-[1.3rem] text-[#7c695f] placeholder:text-[#b7aeaa] outline-none mb-8 focus:ring-0"
            style={{ fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif' }}
          />

          {/* Guest Count Dropdown */}
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full h-[72px] rounded-[14px] bg-[#f2eded] px-5 text-[1.1rem] text-[#7c695f] outline-none mb-8 focus:ring-0"
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            <option value="" disabled hidden>
              select amount of guests
            </option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
            <option value="5">5 guests</option>
            <option value="6">6 guests</option>
          </select>

          {/* Admin Type Dropdown */}
          <select
            value={adminType}
            onChange={(e) => setAdminType(e.target.value)}
            className="w-full h-[72px] rounded-[14px] bg-[#f2eded] px-5 text-[1.1rem] text-[#7c695f] outline-none focus:ring-0"
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            <option value="" disabled hidden>
              select admin type
            </option>
            <option value="home owner">home owner</option>
            <option value="house hold member">house hold member</option>
            <option value="admin">admin</option>
          </select>
        </div>

        {/* Error Message */}
        {error ? (
          <p className="text-[#8b4b45] text-lg mt-5 mb-2">
            {error}
          </p>
        ) : null}

        {/* Button */}
        <button
          onClick={handleCreate}
          className="mt-12 w-[250px] h-[68px] rounded-[18px] bg-[#aab095] text-[#43332c] text-[2rem] leading-none hover:brightness-[0.98] active:translate-y-[1px] transition"
        >
          create
        </button>
      </section>
    </main>
  );
}