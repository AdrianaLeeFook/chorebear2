import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../logo.png";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    navigate("/Dashboard", { state: { username } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d8c7b3]">
      <div className="w-full max-w-md text-center px-6">

        <img src={logo} alt="chorebear logo" className="h-35 w-auto mx-auto mb-4" />        <h1 className="text-4xl md:text-5xl font-itim text-[#5a4336] mb-10">
          chorebear
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <input
            type="text"
            placeholder="email"
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

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-40 mx-auto py-3 rounded-xl bg-[#9aa087] text-black font-medium hover:opacity-90 transition"
          >
            login
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-700">
          Don&apos;t have an account?{" "}
          <Link to="/CreateAccount" className="underline">
            create one
          </Link>
        </p>
      </div>
    </div>
  );
}