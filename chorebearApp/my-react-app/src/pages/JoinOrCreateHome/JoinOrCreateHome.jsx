import { useNavigate } from "react-router-dom";

export default function JoinOrCreateHome() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#eadbc9] flex items-center justify-center px-6">
      <section className="w-full max-w-[1200px] flex flex-col items-center text-center -mt-14">
        
        {/* Title */}
        <h1
          className="text-[#6b4b3e] mb-14"
          style={{
            fontSize: "clamp(3rem, 5.2vw, 5rem)",
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          welcome!
        </h1>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-6 w-full">
          
          <button
            onClick={() => navigate("/CreateHome")}
            className="w-[320px] h-[74px] rounded-[22px] bg-[#aab095] text-[#43332c] text-[2rem] leading-none border border-[rgba(90,62,54,0.25)] hover:brightness-[0.98] active:translate-y-[1px] transition"
          >
            create a home
          </button>

          <button
            onClick={() => navigate("/JoinHome")}
            className="w-[320px] h-[74px] rounded-[22px] bg-[#aab095] text-[#43332c] text-[2rem] leading-none border border-[rgba(90,62,54,0.25)] hover:brightness-[0.98] active:translate-y-[1px] transition"
          >
            join a home
          </button>

        </div>
      </section>
    </main>
  );
}