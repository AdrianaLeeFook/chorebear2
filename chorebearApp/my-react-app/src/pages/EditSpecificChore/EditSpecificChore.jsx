import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── Inline Editable Title ──────────────────────────────────────────────────
const EditableTitle = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
      className="text-2xl font-bold text-[#4e3728] text-center bg-transparent border-b border-[#c9a98a] outline-none w-64"
    />
  ) : (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-2 text-2xl font-bold text-[#4e3728]"
    >
      {value || <span className="text-[#a0816a]">title</span>}
      <span className="text-base text-[#a0816a]">✏️</span>
    </button>
  );
};

// ── Component ──────────────────────────────────────────────────────────────
const EditSpecificChore = () => {
  const navigate = useNavigate();
  const { choreId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // If choreId is present we're editing, otherwise creating
  const isCreating = !choreId;
  const memberId = searchParams.get("memberId");
  const houseId = searchParams.get("houseId");

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [descEditing, setDescEditing] = useState(false);
  const [time, setTime] = useState("");
  const [timeOpen, setTimeOpen] = useState(false);
  const [repeating, setRepeating] = useState(false);
  const [repeatingOpen, setRepeatingOpen] = useState(false);
  const [loading, setLoading] = useState(!isCreating); // only load if editing
  const [error, setError] = useState("");

  // Fetch existing chore when editing
  useEffect(() => {
    if (isCreating) return;

    const fetchChore = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/chores/${choreId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTitle(data.title ?? "");
        setIcon(data.icon ?? "");
        setDescription(
          Array.isArray(data.description)
            ? data.description.join("\n")
            : data.description ?? ""
        );
        setTime(data.time ?? "");
        setRepeating(data.repeating ?? false);
      } catch (err) {
        setError("Chore not found");
      } finally {
        setLoading(false);
      }
    };

    fetchChore();
  }, [choreId]);

  const handleSave = async () => {
    if (!title.trim()) return;

    const payload = {
      title,
      icon,
      description: description.split("\n").filter(Boolean),
      time: time || null,
      repeating,
    };

    try {
      if (isCreating) {
        const res = await fetch("http://localhost:8080/api/chores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            ...payload,
            house: houseId,
            assignedTo: memberId,
            createdBy: user._id,
          }),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch(`http://localhost:8080/api/chores/${choreId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
      }
      navigate(-1);
    } catch (err) {
      setError("Failed to save chore");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/chores/${choreId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error();
      navigate(-1);
    } catch (err) {
      setError("Failed to delete chore");
    }
  };

  if (loading) return <p className="text-center text-[#4e3728] mt-10">loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-[#f5ede3] flex items-center justify-center px-8 py-8">
      <div className="w-full max-w-2xl bg-[#f0ebe4] border-2 border-[#7ab3d4] rounded-2xl px-10 py-8 flex flex-col gap-6 relative">

        {/* Title */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <EditableTitle value={title} onChange={setTitle} />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[#4e3728]">description</span>
            <button
              onClick={() => setDescEditing((v) => !v)}
              className="text-sm text-[#a0816a] hover:text-[#4e3728] transition-colors"
            >
              ✏️
            </button>
          </div>
          {descEditing ? (
            <textarea
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setDescEditing(false)}
              rows={3}
              placeholder="add a description..."
              className="w-full bg-[#e2ddd8] border border-[#c9b8aa] rounded-xl px-4 py-3 text-sm text-[#4e3728] outline-none resize-none"
            />
          ) : (
            <div
              className="w-full bg-[#e2ddd8] border border-[#c9b8aa] rounded-xl px-4 py-3 text-sm text-[#4e3728] min-h-[56px] cursor-pointer"
              onClick={() => setDescEditing(true)}
            >
              {description ? (
                <ul className="list-disc list-inside flex flex-col gap-1">
                  {description.split("\n").filter(Boolean).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                <span className="italic text-[#a0816a]">click the pencil icon to add a description..</span>
              )}
            </div>
          )}
        </div>

        {/* Set Time */}
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold text-[#4e3728]">set time</span>
          <div>
            <button
              onClick={() => setTimeOpen((v) => !v)}
              className="flex items-center gap-2 bg-[#e2ddd8] border border-[#c9b8aa] text-[#4e3728] text-sm px-4 py-2 rounded-full"
            >
              <span className="text-[#c9a98a] text-xs">▶</span>
              {time || "set time"}
            </button>
            {timeOpen && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-[#e2ddd8] border border-[#c9b8aa] rounded-xl px-3 py-2 text-sm text-[#4e3728] outline-none"
                />
                <button onClick={() => setTimeOpen(false)} className="text-sm text-[#7a9e7e] font-medium">
                  done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Repeating */}
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold text-[#4e3728]">repeating</span>
          <div>
            <button
              onClick={() => setRepeatingOpen((v) => !v)}
              className="flex items-center gap-2 bg-[#e2ddd8] border border-[#c9b8aa] text-[#4e3728] text-sm px-4 py-2 rounded-full"
            >
              <span className="text-[#c9a98a] text-xs">▶</span>
              {repeating ? "yes" : "no"}
            </button>
            {repeatingOpen && (
              <div className="mt-2 flex items-center gap-3">
                {["yes", "no"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setRepeating(opt === "yes"); setRepeatingOpen(false); }}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                      (repeating ? "yes" : "no") === opt
                        ? "bg-[#7a9e7e] text-white border-[#7a9e7e]"
                        : "bg-[#e2ddd8] text-[#4e3728] border-[#c9b8aa] hover:bg-[#d8d0c8]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center mt-2 relative">
          <button
            onClick={handleSave}
            className="bg-[#7a9e7e] hover:bg-[#6a8e6e] text-white text-base font-medium px-10 py-3 rounded-full transition-colors"
          >
            {isCreating ? "create chore" : "save changes"}
          </button>
          {!isCreating && (
            <button
              onClick={handleDelete}
              className="absolute right-0 text-[#4e3728] hover:text-[#c0392b] transition-colors"
              title="delete chore"
            >
              🗑️
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default EditSpecificChore;