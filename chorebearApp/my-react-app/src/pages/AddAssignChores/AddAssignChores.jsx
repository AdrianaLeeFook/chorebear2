import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ── Person Card ───────────────────────────────────────────────────────────────
const PersonCard = ({ member, houseId }) => {
  const navigate = useNavigate();
  const [chores, setChores] = useState([]);

  useEffect(() => {
    const fetchChores = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/chores/house/${houseId}?memberId=${member._id}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        const data = await res.json();
        if (res.ok) setChores(data);
      } catch (err) {
        console.error("Failed to fetch chores:", err);
      }
    };

    fetchChores();
  }, [member._id, houseId]);

  const removeChore = async (choreId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/chores/${choreId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) setChores(prev => prev.filter(c => c._id !== choreId));
    } catch (err) {
      console.error("Failed to delete chore:", err);
    }
  };

  return (
    <div className="bg-white border border-[#e8d5c4] rounded-xl p-4">

      {/* Header */}
      <span className="text-xl font-bold text-[#4e3728]">{member.username}</span>

      {/* Chore chips — always visible, no dropdown */}
      <div className="flex flex-wrap gap-2 mt-3">
        {chores.length === 0 && (
          <p className="text-sm text-[#a0816a] italic">no chores assigned yet</p>
        )}

        {chores.map((chore) => (
          <div
            key={chore._id}
            onClick={() => navigate(`/chores/${chore._id}/edit`)}
            className="flex items-center gap-1.5 bg-[#fdf6ef] border border-[#e8d5c4] text-[#4e3728] text-sm px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#f0e0d0] transition-colors"
          >
            <span>{chore.icon}</span>
            <span>{chore.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); removeChore(chore._id); }}
              className="ml-1 text-[#a0816a] hover:text-[#c0392b] text-xs leading-none"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add new chore */}
        <button
          onClick={() => navigate(`/chores/new?memberId=${member._id}&houseId=${houseId}`)}
          className="flex items-center gap-1.5 bg-[#dce8e0] border border-[#b5cdb9] text-[#4e3728] text-sm px-3 py-1.5 rounded-xl hover:bg-[#cddfd2] transition-colors"
        >
          📋 add new chore
        </button>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const AddAssignChores = () => {
  const { houseId } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/memberships/house/${houseId}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        const data = await res.json();
        if (res.ok) setMembers(data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };

    fetchMembers();
  }, [houseId]);

  return (
    <div className="min-h-screen bg-[#f5ede3] px-8 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <h1 className="text-3xl font-bold text-[#4e3728]">chore list</h1>

        {members.length === 0 && (
          <p className="text-[#a0816a] italic">no members in this house yet</p>
        )}

        <div className="flex flex-col gap-4">
          {members.map((member) => (
            <PersonCard key={member._id} member={member} houseId={houseId} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default AddAssignChores;