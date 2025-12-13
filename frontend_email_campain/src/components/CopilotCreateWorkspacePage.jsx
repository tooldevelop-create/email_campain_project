// src/components/CopilotCreateWorkspacePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/InstantlyCopilot.css";

/* ------ shared storage helpers (same keys EmailAccountsPage me bhi use honge) ------ */
const WORKSPACES_KEY = "ea_workspaces";
const SELECTED_WORKSPACE_KEY = "ea_selected_workspace_id";

function ensureDefaultWorkspaces() {
  let list = [];
  try {
    const raw = localStorage.getItem(WORKSPACES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch (e) {
    console.warn("Failed to read workspaces from storage", e);
  }

  if (!list.length) {
    list = [{ id: "ws-1", name: "My Organization" }];
    try {
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to write default workspaces", e);
    }
  }
  return list;
}

export default function CopilotCreateWorkspacePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("My Organization");
  const [saving, setSaving] = useState(false);

  const goBack = () => navigate("/copilot");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || saving) return;

    setSaving(true);

    // 1) Purani list lao (agar empty hai to default bana dega)
    const current = ensureDefaultWorkspaces();

    // 2) Naya workspace object
    const newId = "ws-" + Date.now();
    const newWorkspace = { id: newId, name: trimmed };

    const updated = [...current, newWorkspace];

    // 3) localStorage me save + selected workspace update
    try {
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(updated));
      localStorage.setItem(SELECTED_WORKSPACE_KEY, newId);
    } catch (err) {
      console.warn("Failed to save workspace", err);
    }

    // 4) Thoda sa "processing" feel, fir Email Accounts page pe jao
    setTimeout(() => {
      setSaving(false);
      navigate("/email-accounts");
    }, 700);
  };

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main">
        {/* upar minimal topbar with Back */}
        <header className="ss-topbar ss-topbar--minimal">
          <button
            type="button"
            className="cw-back-btn"
            onClick={goBack}
          >
            ← Back
          </button>
        </header>

        {/* center content */}
        <div className="cw-body">
          <form className="cw-card" onSubmit={handleSubmit}>
            <h2 className="cw-title">Let&apos;s create a new workspace</h2>
            <p className="cw-sub">What would you like to name it?</p>

            <label className="cw-label" htmlFor="workspace-name">
              Workspace Name
            </label>
            <input
              id="workspace-name"
              className="cw-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Organization"
            />

            <div className="cw-actions">
              <button
                type="button"
                className="cw-btn cw-btn-secondary"
                onClick={goBack}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cw-btn cw-btn-primary"
                disabled={saving || !name.trim()}
              >
                {saving ? "Creating..." : "Continue >"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
