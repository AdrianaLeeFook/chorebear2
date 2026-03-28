import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim() || !email.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, role: "member" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      navigate("/JoinOrCreateHome", { state: { username } });
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d8c7b3]">
      <div className="w-full max-w-md text-center px-6">

        <h1 className="text-4xl md:text-5xl font-semibold text-[#5a4336] mb-10">
          create account
        </h1>

        <form onSubmit={handleCreateAccount} className="space-y-6">

          <input
            type="text"
            placeholder="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#e8e3de] text-gray-700 placeholder-gray-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#e8e3de] text-gray-700 placeholder-gray-500 focus:outline-none"
          />

          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#e8e3de] text-gray-700 placeholder-gray-500 focus:outline-none"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-40 mx-auto py-3 rounded-xl bg-[#9aa087] text-black font-medium hover:opacity-90 transition"
          >
            sign up
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/Landing" className="underline">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}