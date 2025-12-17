// src/components/InstantlyCopilotPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import InstantlyCopilotScreen from "./InstantlyCopilotScreen";
import "../styles/Layout.css";
import "../styles/InstantlyCopilot.css";
import "../styles/CrmPage.css";

import {
  readWorkspaces,
  getSelectedWorkspaceId,
  setSelectedWorkspaceId,
} from "../utils/workspaces";

export default function InstantlyCopilotPage() {
  const navigate = useNavigate();
  const [orgOpen, setOrgOpen] = useState(false);
  const [reloading, setReloading] = useState(false);

  // dynamic workspaces state
  const [workspaces, setWorkspaces] = useState(() => readWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() =>
    getSelectedWorkspaceId(readWorkspaces())
  );

  // keep list in sync after create (same tab) + other tab changes
  useEffect(() => {
    const refresh = () => {
      const list = readWorkspaces();
      setWorkspaces(list);
      setActiveWorkspaceId((prev) => {
        const next = getSelectedWorkspaceId(list);
        return prev && list.some((w) => w.id === prev) ? prev : next;
      });
    };

    const onStorage = (e) => {
      if (
        e.key === "ea_workspaces" ||
        e.key === "ea_selected_workspace_id"
      ) {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("workspaces:changed", refresh);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("workspaces:changed", refresh);
    };
  }, []);

  const activeWorkspaceName = useMemo(() => {
    return (
      workspaces.find((w) => w.id === activeWorkspaceId)?.name ||
      "My Organization"
    );
  }, [workspaces, activeWorkspaceId]);

  const closeAllPopovers = () => setOrgOpen(false);

  const handleWorkspaceClick = (id) => {
    setOrgOpen(false);
    setActiveWorkspaceId(id);
    setSelectedWorkspaceId(id);

    setReloading(true);
    setTimeout(() => {
      navigate("/copilot");
      setReloading(false);
    }, 600);
  };

  const handleCreateWorkspaceClick = () => {
    setOrgOpen(false);
    navigate("/copilot/workspace/create");
  };

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main" onClick={closeAllPopovers}>
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
