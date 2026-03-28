import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ─── Page Imports ────────────────────────────────────────────────────────────
// Each teammate should uncomment their import once their page is built.

import Landing             from "./pages/Landing/Landing";
import CreateAccount       from "./pages/CreateAccount/CreateAccount";
import JoinOrCreateHome    from "./pages/JoinOrCreateHome/JoinOrCreateHome";
import JoinHome            from "./pages/JoinHome/JoinHome";
import CreateHome          from "./pages/CreateHome/CreateHome";
import JoinCreateSuccess   from "./pages/JoinCreateSuccess/JoinCreateSuccess";
import AddAssignChores     from "./pages/AddAssignChores/AddAssignChores";
import EditSpecificChore   from "./pages/EditSpecificChore/EditSpecificChore";
import CreateNewChore      from "./pages/CreateNewChore/CreateNewChore";
// import EditMyHomes         from "./pages/EditMyHomes/EditMyHomes";
// import Homes         from "./pages/Homes/Homes";

import SelectHomeForEdit   from "./pages/SelectHomeForEdit/SelectHomeForEdit";


import Dashboard  from "./pages/Dashboard/Dashboard";
import Settings   from "./pages/Settings/Settings";
import Navbar     from "./components/Navbar";


// ─── Placeholder component for unbuilt pages ─────────────────────────────────
const Placeholder = ({ name }) => (
  <div style={styles.placeholder}>
    <h2 style={styles.placeholderTitle}>🚧 {name}</h2>
    <p style={styles.placeholderText}>This page hasn't been built yet.</p>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      
      <Navbar />

      <Routes>
        {/* ── Public routes (no auth needed) ── */}
        <Route path="/"               element={<Landing />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/CreateAccount"       element={<CreateAccount/>} />

        {/* ── Onboarding flow ── */}
        <Route path="/JoinOrCreateHome" element={<JoinOrCreateHome />} />
        <Route path="/JoinHome"      element={<JoinHome />} />
        <Route path="/CreateHome"    element={<CreateHome />} />
        <Route path="/JoinCreateSuccess"     element={<JoinCreateSuccess />} />

        {/* ── Main app routes ── */}
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/SelectHomeForEdit"          element={<SelectHomeForEdit />} />
        <Route path="/settings"       element={<Settings />} />

        {/* ── Chore management ── */}
        <Route path="/AddAssignChores"          element={<AddAssignChores/>} />
        <Route path="/EditSpecificChore"   element={<EditSpecificChore />} />
        <Route path="/CreateNewChore"             element={<CreateNewChore />} />

        {/* ── Home management ── */}
        <Route path="/homes/select"   element={<Placeholder name="Select Home to Edit" />} />
        <Route path="/homes/edit"     element={<Placeholder name="Edit My Homes" />} />

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Placeholder name="404 — Page Not Found" />} />
      </Routes>
    </Router>
  );
}

// ─── Placeholder Styles ───────────────────────────────────────────────────────
const styles = {
  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    gap: "8px",
    fontFamily: "sans-serif",
    color: "#aaa",
  },
  placeholderTitle: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#bbb",
    margin: 0,
  },
  placeholderText: {
    fontSize: "0.95rem",
    margin: 0,
  },
};

export default App;
