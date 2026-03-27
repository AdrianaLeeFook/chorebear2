import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockMembers = [
  {
    id: 1,
    name: "jessica",
    chores: [
      { id: 1, icon: "🍽️", label: "wash dishes" },
      { id: 2, icon: "🪣", label: "clean bathroom" },
      { id: 3, icon: "🧹", label: "mop floor" },
      { id: 4, icon: "🗑️", label: "take out trash" },
      { id: 5, icon: "🧹", label: "sweep floor" },
      { id: 6, icon: "🫧", label: "wash towels" },
      { id: 7, icon: "🧽", label: "wipe counters" },
    ],
  },
  { id: 2, name: "freddy",  chores: [] },
  { id: 3, name: "lexie",   chores: [] },
  { id: 4, name: "katie",   chores: [] },
];

// ── Person Card ──────────────────────────────────────────────────────────────
const PersonCard = ({ member }) => {
  const [expanded, setExpanded] = useState(false);
  const [chores, setChores] = useState(member.chores);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const removeChore = (id) =>
    setChores((prev) => prev.filter((c) => c.id !== id));

  const addChore = () => {
    if (!newLabel.trim()) return;
    setChores((prev) => [
      ...prev,
      { id: Date.now(), icon: "📋", label: newLabel.trim() },
    ]);
    setNewLabel("");
    setAdding(false);
  };

  return (
    <div className="bg-white border border-[#e8d5c4] rounded-xl p-4">

      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 w-full text-left"
      >
        <span className="text-xl font-bold text-[#4e3728]">{member.name}</span>
        <span className={`text-[#c9a98a] text-sm transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>
          ▶
        </span>
      </button>

      {/* Chore chips */}
      {expanded && (
        <div className="flex flex-wrap gap-2 mt-3">
          {chores.map((chore) => (
            <div
              key={chore.id}
              className="flex items-center gap-1.5 bg-[#fdf6ef] border border-[#e8d5c4] text-[#4e3728] text-sm px-3 py-1.5 rounded-xl"
            >
              <span>{chore.icon}</span>
              <span>{chore.label}</span>
              <button
                onClick={() => removeChore(chore.id)}
                className="ml-1 text-[#a0816a] hover:text-[#c0392b] text-xs leading-none"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add new chore */}
          {adding ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChore()}
                placeholder="chore name..."
                className="px-3 py-1.5 rounded-xl text-sm border border-[#c9a98a] bg-[#fdf6ef] text-[#4e3728] outline-none w-36"
              />
              <button
                onClick={addChore}
                className="px-3 py-1.5 rounded-xl text-sm bg-[#7a9e7e] text-white hover:bg-[#6a8e6e] transition-colors"
              >
                ✓
              </button>
              <button
                onClick={() => { setAdding(false); setNewLabel(""); }}
                className="px-3 py-1.5 rounded-xl text-sm bg-[#e8d5c4] text-[#4e3728] hover:bg-[#dcc8b4] transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 bg-[#dce8e0] border border-[#b5cdb9] text-[#4e3728] text-sm px-3 py-1.5 rounded-xl hover:bg-[#cddfd2] transition-colors"
            >
              📋 add new chore
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const Homes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5ede3] px-8 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <h1 className="text-3xl font-bold text-[#4e3728]">
          add &amp; assign chores
        </h1>

        <div className="flex flex-col gap-4">
          {mockMembers.map((member) => (
            <PersonCard key={member.id} member={member} />
          ))}
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#7a9e7e] hover:bg-[#6a8e6e] text-white text-sm font-medium px-10 py-3 rounded-full transition-colors"
          >
            back
          </button>
        </div>

      </div>
    </div>
  );
};

export default Homes;