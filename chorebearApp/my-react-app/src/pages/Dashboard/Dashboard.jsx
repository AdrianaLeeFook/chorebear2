import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Mock Data ──────────────
const mockUser = { name: "jessica" };
const mockHouse = { name: "mojo dojo casa house" };

const mockUpcomingChores = [
  { id: 1, label: "clean shower", icon: "🚿", daysRemaining: 0, done: true },
  { id: 2, label: "sweep floor", icon: "🧹", daysRemaining: 2, done: false },
  { id: 3, label: "take out trash", icon: "🗑️", daysRemaining: 3, done: false },
];

const mockOverdueChores = [
  { id: 1, member: "Freddy", days: 2, label: "clean bathroom" },
];

const mockSchedule = [
  { date: 3, month: "JAN", day: "monday",    chores: [{ member: "A", label: "mop floor", color: "bg-[#c9a98a]" }] },
  { date: 4, month: "JAN", day: "tuesday",   chores: [] },
  { date: 5, month: "JAN", day: "wednesday", chores: [] },
  { date: 6, month: "JAN", day: "thursday",  chores: [] },
  { date: 7, month: "JAN", day: "friday",    chores: [] },
];

// ── Component ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [chores, setChores] = useState(mockUpcomingChores);

  const toggleChore = (id) => {
    setChores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] px-8 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Greeting */}
        <h1 className="text-3xl font-bold text-[#4e3728]">
          hello, {mockUser.name}!
        </h1>

        {/* Main Grid */}
        <div className="flex flex-row gap-6 items-start">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-4 w-72 shrink-0">

            {/* Upcoming Chores */}
            <div className="bg-white border border-[#e8d5c4] rounded-xl p-4">
              <h2 className="text-center text-base font-semibold text-[#4e3728] mb-3">
                upcoming chores
              </h2>
              <ul className="flex flex-col gap-2">
                {chores.map((chore) => (
                  <li key={chore.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chore.done}
                      onChange={() => toggleChore(chore.id)}
                      className="w-4 h-4 accent-[#7a9e7e] cursor-pointer shrink-0"
                    />
                    <span className={`text-sm ${chore.done ? "line-through text-[#bbb]" : "text-[#4e3728]"}`}>
                      {chore.icon} {chore.label}{" "}
                      <span className={`text-xs ${chore.daysRemaining === 0 ? "text-[#c9a98a]" : "text-[#7a9e7e]"}`}>
                        ({chore.daysRemaining} days remaining)
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Overdue Chores */}
            <div className="bg-white border border-[#e8d5c4] rounded-xl p-4">
              <h2 className="text-center text-base font-semibold text-[#4e3728] mb-3">
                overdue chores
              </h2>
              <ul className="flex flex-col gap-2">
                {mockOverdueChores.map((item) => (
                  <li key={item.id} className="text-sm text-[#4e3728]">
                    {item.member} is{" "}
                    <span className="text-[#c0392b] font-medium">
                      {item.days} day(s) late
                    </span>
                    : {item.label} 🤌
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right Column: Schedule ── */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="bg-white border border-[#e8d5c4] rounded-xl overflow-hidden">

              {/* House Name Header */}
              <div className="text-center text-base font-semibold text-[#4e3728] py-3 border-b border-[#e8d5c4]">
                {mockHouse.name}
              </div>

              {/* Schedule Rows */}
              {mockSchedule.map((row) => (
                <div
                  key={row.date}
                  className="flex flex-row items-center border-b border-[#e8d5c4] last:border-b-0 min-h-[56px]"
                >
                  {/* Date */}
                  <div className="w-16 shrink-0 flex flex-col items-center justify-center py-2 border-r border-[#e8d5c4]">
                    <span className="text-xl font-bold text-[#4e3728] leading-none">{row.date}</span>
                    <span className="text-[10px] text-[#a0816a] uppercase tracking-wide">{row.month}</span>
                    <span className="text-[10px] text-[#a0816a]">{row.day}</span>
                  </div>

                  {/* Chores for that day */}
                  <div className="flex flex-row flex-wrap gap-2 px-4 py-2">
                    {row.chores.map((chore, i) => (
                      <div key={i} className="flex flex-row items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${chore.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {chore.member}
                        </div>
                        <span className="text-sm text-[#4e3728]">{chore.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* House Chat Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={() => navigate("/house-chat")}
                className="bg-[#7a9e7e] hover:bg-[#6a8e6e] text-white text-sm font-medium px-10 py-3 rounded-full transition-colors"
              >
                house chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;