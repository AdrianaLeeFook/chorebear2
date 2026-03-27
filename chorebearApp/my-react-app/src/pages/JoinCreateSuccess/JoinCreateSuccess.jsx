import { useLocation, useNavigate } from "react-router-dom";

export default function JoinCreateSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const isCreate = state?.type === "create";
  const homeName = state?.homeName || "your home";
  const homeCode = state?.homeCode || "ABCDE";

  return (
    <main className="min-h-screen bg-[#eadbc9] flex items-center justify-center px-6">
      <section className="w-full max-w-[1200px] flex flex-col items-center text-center -mt-12">
        
        <h1
          className="text-[#6b4b3e] mb-8"
          style={{
            fontSize: "clamp(3rem, 5vw, 4.8rem)",
            lineHeight: 1,
            fontWeight: 600,
          }}
        >
          success!
        </h1>

        <p className="text-[#6b4b3e] text-[1.5rem] mb-4">
          {isCreate
            ? `you created ${homeName}`
            : `you joined ${homeName}`}
        </p>

        {/* 🔥 NEW LINE */}
        {isCreate && (
          <p className="text-[#7c695f] text-[1.3rem] mb-10">
            home code: {homeCode}
          </p>
        )}

        <button
          onClick={() => navigate("/Dashboard")}
          className="w-[250px] h-[68px] rounded-[18px] bg-[#aab095] text-[#43332c] text-[2rem] leading-none hover:brightness-[0.98] active:translate-y-[1px] transition"
        >
          continue
        </button>
      </section>
    </main>
  );
}