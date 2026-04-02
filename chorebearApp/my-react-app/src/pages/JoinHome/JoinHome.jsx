import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

export default function JoinHome() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  const handleChange = (value, index) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
    const newCode = [...code];
    newCode[index] = cleaned;
    setCode(newCode);

    if (cleaned && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleJoin = async () => {
    const finalCode = code.join("");

    if (finalCode.length < 6) {
      setError("please enter the full home code");
      return;
    }

    if (!currentUserId) {
      setError("user not found");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/houses/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: finalCode,
          userId: currentUserId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "invalid home code");
      }

      navigate("/JoinCreateSuccess", {
        state: {
          type: "join",
          code: finalCode,
          homeName: data.home?.name || data.name || "your home",
        },
      });
    } catch (err) {
      console.error("join home error:", err);
      setError(err.message || "invalid home code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eadbc9] flex items-center justify-center px-6">
      <section className="w-full max-w-[1200px] flex flex-col items-center text-center -mt-10">
        <h1
          className="text-[#6b4b3e] mb-4"
          style={{
            fontSize: "clamp(3.2rem, 5.2vw, 5rem)",
            lineHeight: 1,
            fontWeight: 600,
            fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
          }}
        >
          join a home
        </h1>

        <p
          className="text-[#6b4b3e] mb-8"
          style={{
            fontSize: "2rem",
            fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
          }}
        >
          enter home code below:
        </p>

        <div className="flex gap-6 mb-10">
          {code.map((char, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              value={char}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className="w-[88px] h-[88px] rounded-[14px] bg-[#f2eded] text-center text-[2rem] text-[#6b4b3e] outline-none"
              style={{ fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif' }}
            />
          ))}
        </div>

        {error ? (
          <p
            className="text-[#8b4b45] text-lg mb-4"
            style={{ fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif' }}
          >
            {error}
          </p>
        ) : null}

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-[140px] h-[58px] rounded-[16px] bg-[#aab095] text-[#43332c] text-[1.8rem] leading-none hover:brightness-[0.98] active:translate-y-[1px] transition disabled:opacity-60"
          style={{ fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif' }}
        >
          {loading ? "joining..." : "join"}
        </button>
      </section>
    </main>
  );
}