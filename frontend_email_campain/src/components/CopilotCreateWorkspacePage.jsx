// src/components/CopilotCreateWorkspacePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/InstantlyCopilot.css";

import { createWorkspace } from "../utils/workspaces";

export default function CopilotCreateWorkspacePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("My Organization");
  const [saving, setSaving] = useState(false);

  const goBack = () => navigate("/copilot");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || saving) return;

    setSaving(true);

    // create + select workspace
    createWorkspace(name);

    // Continue -> Email Accounts page
    setTimeout(() => {
      navigate("/email-accounts");
    }, 500);
  };

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main">
        <header className="ss-topbar ss-topbar--minimal">
          <button type="button" className="cw-back-btn" onClick={goBack}>
            ← Back
          </button>
        </header>

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
