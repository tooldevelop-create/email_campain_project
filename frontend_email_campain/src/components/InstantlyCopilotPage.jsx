// src/components/InstantlyCopilotPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import InstantlyCopilotScreen from "./InstantlyCopilotScreen";
import "../styles/Layout.css";
import "../styles/InstantlyCopilot.css";
import "../styles/CrmPage.css"; // org dropdown ke styles reuse

/* ---- shared workspace storage (same keys EmailAccountsPage / CreateWorkspace me) ---- */
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
    console.warn("Failed to read workspaces", e);
  }

  // agar kuch bhi nahi mila to ek default bana do
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

export default function InstantlyCopilotPage() {
  const navigate = useNavigate();
  const [orgOpen, setOrgOpen] = useState(false);
  const [reloading, setReloading] = useState(false);

  // workspace list + selected id
  const [workspaces] = useState(() => ensureDefaultWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    const list = ensureDefaultWorkspaces();
    let stored = null;
    try {
      stored = localStorage.getItem(SELECTED_WORKSPACE_KEY);
    } catch (e) {
      console.warn("Failed to read selected workspace", e);
    }
    if (stored && list.some((w) => w.id === stored)) return stored;
    return list[0]?.id || "";
  });

  const activeWorkspaceName =
    workspaces.find((w) => w.id === activeWorkspaceId)?.name ||
    "My Organization";

  const closeAllPopovers = () => {
    setOrgOpen(false);
  };

  // koi workspace choose kare (My Organization ya koi naya)
  const handleWorkspaceClick = (id) => {
    setOrgOpen(false);
    setActiveWorkspaceId(id);
    try {
      localStorage.setItem(SELECTED_WORKSPACE_KEY, id);
    } catch (e) {
      console.warn("Failed to store selected workspace id", e);
    }

    // small refresh animation
    setReloading(true);
    setTimeout(() => {
      // same page par hi ho, fir bhi "refresh" feel ke liye
      navigate("/copilot");
      setReloading(false);
    }, 900);
  };

  const handleCreateWorkspaceClick = () => {
    // dropdown band + create page pe jao
    setOrgOpen(false);
    navigate("/copilot/workspace/create");
  };

  return (
    <div className="ss-app">
      <Sidebar />

      {/* bahar click -> dropdown close */}
      <main className="ss-main" onClick={closeAllPopovers}>
        {/* TOP BAR */}
        <header className="ss-topbar">
          <div className="ss-top-left">
            <h1 className="ss-title">Instantly Copilot</h1>
          </div>

          <div style={{ flex: 1 }} />

          <div className="ss-top-right">
            <div className="ss-coins">
              <span className="ss-coin-icon">🪙</span>
              <span className="ss-coin-value">286</span>
            </div>
            <button className="ss-get-features-btn">Get All Features</button>

            {/* My Organization dropdown (ab dynamic workspaces se) */}
            <div
              className="crm-org-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ss-org-btn"
                onClick={() => setOrgOpen((o) => !o)}
              >
                {activeWorkspaceName}
                <span style={{ marginLeft: 6 }}>▾</span>
              </button>

              {orgOpen && (
                <div className="uni-org-dropdown">
                  <div className="uni-org-search">
                    <input placeholder="Search" />
                  </div>

                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      className={
                        "uni-org-item" +
                        (ws.id === activeWorkspaceId
                          ? " uni-org-item-active"
                          : "")
                      }
                      onClick={() => handleWorkspaceClick(ws.id)}
                    >
                      {ws.name}
                    </button>
                  ))}

                  {/* naya workspace create */}
                  <button
                    className="uni-org-item uni-org-create"
                    onClick={handleCreateWorkspaceClick}
                  >
                    + Create Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* BODY */}
        {reloading ? (
          <div className="copilot-body copilot-body--loading">
            <div className="copilot-loading-center">
              <svg
                width="56"
                height="56"
                viewBox="0 0 50 50"
                className="copilot-loading-spinner"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke"
                    values="#4f46e5; #6366f1; #7c3aed; #4f46e5"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dasharray"
                    values="30 120; 90 60; 30 120"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
              <div className="copilot-loading-text">Refreshing workspace…</div>
            </div>
          </div>
        ) : (
          <InstantlyCopilotScreen />
        )}
      </main>
    </div>
  );
}
