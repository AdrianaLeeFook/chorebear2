import { useLocation, useNavigate } from "react-router-dom";

export default function JoinCreateSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const isCreate = state?.type === "create";
  const homeName = state?.homeName || "your home";
  const houseCode = state?.houseCode || "";

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
          your home is ready!
        </h1>

        <p className="text-[#6b4b3e] text-[1.5rem] mb-4">
          {isCreate
            ? `you created ${homeName}!`
            : `you joined ${homeName}!`}
        </p>

        {/* Show house code when creating so they can share it */}
        {isCreate && houseCode && (
          <div className="bg-white border border-[#e8d5c4] rounded-2xl px-10 py-5 mb-10">
            <p className="text-[#a0816a] text-base mb-1">share this code with your roommates:</p>
            <p className="text-[#4e3728] text-4xl font-bold tracking-widest">{houseCode}</p>
          </div>
        )}

        <p className="text-[#7c695f] text-[1.1rem] mb-10">
          click below to view your dashboard.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-[250px] h-[68px] rounded-[18px] bg-[#aab095] text-[#43332c] text-[2rem] leading-none hover:brightness-[0.98] active:translate-y-[1px] transition"
        >
          my dashboard
        </button>
      </section>
    </main>
  );
}