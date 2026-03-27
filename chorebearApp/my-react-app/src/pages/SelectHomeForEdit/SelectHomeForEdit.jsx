import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockHomes = [
  { id: 1, name: "mojo dojo casa house" },
  { id: 2, name: "building 11 apt C" },
];

const SelectHomeForEdit = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#f5ede3] flex flex-col items-center justify-center px-8 py-8">
      <div className="max-w-lg w-full flex flex-col gap-6">

        <h1 className="text-3xl font-bold text-[#4e3728] text-center">
          select home to edit:
        </h1>

        <div className="flex flex-col gap-3">
          {mockHomes.map((home) => (
            <button
              key={home.id}
              onClick={() => setSelected(home.id)}
              className={`w-full py-5 px-6 rounded-2xl text-base text-[#4e3728] text-center border transition-all duration-150
                ${selected === home.id
                  ? "bg-white border-[#c9a98a] shadow-sm ring-2 ring-[#c9a98a]"
                  : "bg-white border-[#e8d5c4] hover:border-[#c9a98a] hover:bg-[#fdf6ef]"
                }`}
            >
              {home.name}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => selected && navigate("/edit-home", { state: { homeId: selected } })}
            className={`px-10 py-3 rounded-full text-sm font-medium text-white transition-colors
              ${selected
                ? "bg-[#7a9e7e] hover:bg-[#6a8e6e]"
                : "bg-[#b5c9b7] cursor-not-allowed"
              }`}
          >
            enter
          </button>
        </div>

      </div>
    </div>
  );
};

export default SelectHomeForEdit;