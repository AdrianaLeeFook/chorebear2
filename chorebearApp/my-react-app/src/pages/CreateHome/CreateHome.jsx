import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function CreateHome() {
  const navigate = useNavigate();

  const [homeName, setHomeName] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // const currentUser = JSON.parse(localStorage.getItem("user"));
  const {user} = useAuth();
  const currentUserId = user?._id;

  const handleCreate = async () => {
    if (!homeName.trim()) {
      setError("please enter a home name");
      return;
    }

    if (!currentUserId) {
      setError("user not found");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/houses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: homeName.trim(),
          createdBy: currentUserId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "failed to create home");
      }

      navigate("/JoinCreateSuccess", {
        state: {
          type: "create",
          homeName: data.name,
          homeCode: data.code,
        },
      });
    } catch (err) {
      console.error("create home error:", err);
      setError(err.message || "error creating home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eadbc9] flex justify-center px-6 pt-20">
      <section className="w-full max-w-[1200px] flex flex-col items-center text-center">
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
          <label
            className="block text-[#6b4b3e] mb-2"
            style={{ fontSize: "2rem" }}
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
        </div>

        {error ? (
          <p className="text-[#8b4b45] text-lg mt-2 mb-2">{error}</p>
        ) : null}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="mt-12 w-[250px] h-[68px] rounded-[18px] bg-[#aab095] text-[#43332c] text-[2rem] leading-none hover:brightness-[0.98] active:translate-y-[1px] transition disabled:opacity-60"
        >
          {loading ? "creating..." : "create"}
        </button>
      </section>
    </main>
  );
}