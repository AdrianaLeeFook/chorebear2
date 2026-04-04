import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const getDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
};

const formatScheduleDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    date: date.getDate(),
    month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
    day: date.toLocaleString("default", { weekday: "long" }).toLowerCase(),
  };
};

const avatarColors = [
  "bg-[#c9a98a]",
  "bg-[#7a9e7e]",
  "bg-[#a98ac9]",
  "bg-[#9ac9c2]",
  "bg-[#c9a98a]",
  "bg-[#c98a8a]",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, houses } = useAuth();

  const [activeHouseIndex, setActiveHouseIndex] = useState(0);
  const [chores, setChores] = useState([]);
  const [overdueChores, setOverdueChores] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeHouse = houses[activeHouseIndex] || null;

  useEffect(() => {
    if (!user || !activeHouse) {
      setLoading(false);
      return;
    }

    fetchDashboardData(activeHouse);
    fetchNotifications(activeHouse);
  }, [user, activeHouse]);

  const fetchDashboardData = async (house) => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/api/chores/house/${house._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const allChores = await res.json();
      const today = new Date();

      const upcoming = allChores
        .filter((c) => c.assignedTo?._id === user._id && !c.completed)
        .map((c) => ({
          id: c._id,
          label: c.title,
          icon: "📋",
          daysRemaining: getDaysRemaining(c.dueDate),
          done: c.completed,
        }));

      const overdue = allChores
        .filter((c) => c.dueDate && !c.completed && new Date(c.dueDate) < today)
        .map((c) => ({
          id: c._id,
          member: c.assignedTo?.username || "Unknown",
          days: Math.abs(getDaysRemaining(c.dueDate)),
          label: c.title,
        }));

      const next5Days = Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
      });

      const scheduleRows = next5Days.map((day, idx) => {
        const formatted = formatScheduleDate(day);

        const dayChores = allChores
          .filter((c) => {
            if (!c.dueDate) return false;
            const due = new Date(c.dueDate);
            return (
              due.getDate() === day.getDate() &&
              due.getMonth() === day.getMonth() &&
              due.getFullYear() === day.getFullYear()
            );
          })
          .map((c) => ({
            member: c.assignedTo?.username?.[0]?.toUpperCase() || "?",
            label: c.title,
            color: avatarColors[idx % avatarColors.length],
          }));

        return { ...formatted, chores: dayChores };
      });

      setChores(upcoming);
      setOverdueChores(overdue);
      setSchedule(scheduleRows);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (house) => {
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/house/${house._id}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const toggleChore = async (id) => {
    try {
      const chore = chores.find((c) => c.id === id);

      await fetch(`http://localhost:8080/api/chores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !chore.done }),
      });

      setChores((prev) =>
        prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
      );

      if (activeHouse) {
        fetchDashboardData(activeHouse);
        fetchNotifications(activeHouse);
      }
    } catch (err) {
      console.error("Failed to update chore:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${id}`, {
        method: "DELETE",
      });

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5ede3] flex items-center justify-center">
        <p className="text-[#4e3728] text-lg">loading...</p>
      </div>
    );
  }

  if (!houses.length) {
    return (
      <div className="min-h-screen bg-[#f5ede3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#4e3728] text-lg mb-4">you are not in a house yet!</p>
          <button
            onClick={() => navigate("/JoinOrCreateHome")}
            className="bg-[#7a9e7e] text-white px-6 py-3 rounded-full hover:bg-[#6a8e6e] transition"
          >
            join or create a home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ede3] px-8 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#4e3728]">
            hello, {user?.username}!
          </h1>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white border border-[#e8d5c4] rounded-full w-12 h-12 flex items-center justify-center shadow-sm hover:bg-[#f9f4ee] transition"
            >
              <span className="text-xl">🔔</span>

              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c0392b] text-white text-[10px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white border border-[#e8d5c4] rounded-xl shadow-lg z-50 max-h-[420px] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8d5c4]">
                  <h2 className="text-base font-semibold text-[#4e3728]">
                    notifications
                  </h2>
                </div>

                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-[#a0816a] text-center">
                    no notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="px-4 py-3 border-b border-[#f0e0d0] last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-[#4e3728]">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#a0816a] mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-xs text-[#c0392b] hover:underline shrink-0"
                        >
                          remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {houses.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {houses.map((h, idx) => (
              <button
                key={h._id}
                onClick={() => setActiveHouseIndex(idx)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeHouseIndex === idx
                    ? "bg-[#7a9e7e] text-white"
                    : "bg-white border border-[#e8d5c4] text-[#4e3728] hover:bg-[#f0e0d0]"
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-row gap-6 items-start">
          <div className="flex flex-col gap-4 w-72 shrink-0">
            <div className="bg-white border border-[#e8d5c4] rounded-xl p-4">
              <h2 className="text-center text-base font-semibold text-[#4e3728] mb-3">
                upcoming chores
              </h2>

              {chores.length === 0 ? (
                <p className="text-sm text-center text-[#aaa]">no upcoming chores 🎉</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {chores.map((chore) => (
                    <li key={chore.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={chore.done}
                        onChange={() => toggleChore(chore.id)}
                        className="w-4 h-4 accent-[#7a9e7e] cursor-pointer shrink-0"
                      />
                      <span
                        className={`text-sm ${
                          chore.done ? "line-through text-[#bbb]" : "text-[#4e3728]"
                        }`}
                      >
                        {chore.icon} {chore.label}{" "}
                        {chore.daysRemaining !== null && (
                          <span
                            className={`text-xs ${
                              chore.daysRemaining <= 0
                                ? "text-[#c9a98a]"
                                : "text-[#7a9e7e]"
                            }`}
                          >
                            (
                            {chore.daysRemaining <= 0
                              ? "due today"
                              : `${chore.daysRemaining} days remaining`}
                            )
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border border-[#e8d5c4] rounded-xl p-4">
              <h2 className="text-center text-base font-semibold text-[#4e3728] mb-3">
                overdue chores
              </h2>

              {overdueChores.length === 0 ? (
                <p className="text-sm text-center text-[#aaa]">no overdue chores 🎉</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {overdueChores.map((item) => (
                    <li key={item.id} className="text-sm text-[#4e3728]">
                      {item.member} is{" "}
                      <span className="text-[#c0392b] font-medium">
                        {item.days} day(s) late
                      </span>
                      : {item.label} 🤌
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <div className="bg-white border border-[#e8d5c4] rounded-xl overflow-hidden">
              <div className="text-center text-base font-semibold text-[#4e3728] py-3 border-b border-[#e8d5c4]">
                {activeHouse?.name || "your house"}
              </div>

              {schedule.map((row, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-center border-b border-[#e8d5c4] last:border-b-0 min-h-[56px]"
                >
                  <div className="w-16 shrink-0 flex flex-col items-center justify-center py-2 border-r border-[#e8d5c4]">
                    <span className="text-xl font-bold text-[#4e3728] leading-none">
                      {row.date}
                    </span>
                    <span className="text-[10px] text-[#a0816a] uppercase tracking-wide">
                      {row.month}
                    </span>
                    <span className="text-[10px] text-[#a0816a]">{row.day}</span>
                  </div>

                  <div className="flex flex-row flex-wrap gap-2 px-4 py-2">
                    {row.chores.map((chore, i) => (
                      <div key={i} className="flex flex-row items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full ${chore.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                          {chore.member}
                        </div>
                        <span className="text-sm text-[#4e3728]">{chore.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;