import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

export default function JoinHome() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
    const newCode = [...code];
    newCode[index] = cleaned;
    setCode(newCode);

    if (cleaned && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleJoin = () => {
    const finalCode = code.join("");

    if (finalCode.length < 5) {
      setError("please enter the full home code");
      return;
    }

    setError("");

    navigate("/JoinCreateSuccess", {
      state: {
        type: "join",
        code: finalCode,
      },
    });
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
          }}
        >
          join a home
        </h1>

        <p
          className="text-[#6b4b3e] mb-8"
          style={{
            fontSize: "2rem",
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
          <p className="text-[#8b4b45] text-lg mb-4">{error}</p>
        ) : null}

        <button
          onClick={handleJoin}
          className="w-[140px] h-[58px] rounded-[16px] bg-[#aab095] text-[#43332c] text-[1.8rem] leading-none hover:brightness-[0.98] active:translate-y-[1px] transition"
        >
          join
        </button>
      </section>
    </main>
  );
}