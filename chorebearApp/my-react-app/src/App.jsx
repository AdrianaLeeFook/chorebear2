import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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
import EditMyHomes         from "./pages/EditMyHomes/EditMyHomes";
import Homes               from "./pages/Homes/Homes";

import SelectHomeForEdit   from "./pages/SelectHomeForEdit/SelectHomeForEdit";


import Dashboard  from "./pages/Dashboard/Dashboard";
import Settings   from "./pages/Settings/Settings";
import Navbar     from "./components/Navbar";

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

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
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* ── Public routes (no auth needed) ── */}
          <Route path="/"                         element={<Landing />} />
          <Route path="/Landing"                  element={<Landing />} />
          <Route path="/CreateAccount"            element={<CreateAccount/>} />


          {/* Pages underneath are all protected. This keep people who are NOT logged in from accessing the other pages. User MUST be logged in to see them */}
          {/* ── Onboarding ── */}
          <Route path="/JoinOrCreateHome"  element={<ProtectedRoute><JoinOrCreateHome /></ProtectedRoute>} />
          <Route path="/JoinHome"          element={<ProtectedRoute><JoinHome /></ProtectedRoute>} />
          <Route path="/CreateHome"        element={<ProtectedRoute><CreateHome /></ProtectedRoute>} />
          <Route path="/JoinCreateSuccess" element={<ProtectedRoute><JoinCreateSuccess /></ProtectedRoute>} />

          {/* ── Main app ── */}
          <Route path="/dashboard"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/settings"          element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* ── Home management ── */}
          <Route path="/homes"             element={<ProtectedRoute><Homes /></ProtectedRoute>} />
          <Route path="/EditMyHomes"       element={<ProtectedRoute><EditMyHomes /></ProtectedRoute>} />
          <Route path="/SelectHomeForEdit" element={<ProtectedRoute><SelectHomeForEdit /></ProtectedRoute>} />

          {/* ── Chore management ── */}
          {/* houseId tells AddAssignChores which house's members/chores to load */}
          <Route path="/houses/:houseId/chores"    element={<ProtectedRoute><AddAssignChores /></ProtectedRoute>} />

          {/* choreId tells EditSpecificChore which chore to fetch from the backend */}
          <Route path="/chores/:choreId/edit"      element={<ProtectedRoute><EditSpecificChore /></ProtectedRoute>} />

          {/* memberId + houseId are passed as query params: /chores/new?memberId=...&houseId=... */}
          <Route path="/chores/new"                element={<ProtectedRoute><CreateNewChore /></ProtectedRoute>} />


          {/* ── 404 fallback ── */}
          <Route path="*" element={<Placeholder name="404 — Page Not Found" />} />
        </Routes>
      </AuthProvider>
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
