import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SuperSearchScreen from "./SuperSearchScreen";
import "../styles/Layout.css";
import "../styles/SuperSearchPage.css";

import {
  readWorkspaces,
  getSelectedWorkspaceId,
  setSelectedWorkspaceId,
} from "../utils/workspaces";

export default function SuperSearchPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("supersearch"); // "supersearch" | "leadlists"
  const [orgOpen, setOrgOpen] = useState(false);

  // ✅ credits popup (like screenshot)
  const [creditsOpen, setCreditsOpen] = useState(false);

  // dynamic workspaces state (same pattern as Copilot page)
  const [workspaces, setWorkspaces] = useState(() => readWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() =>
    getSelectedWorkspaceId(readWorkspaces())
  );

  // Keep in sync after create (same tab) + other tab changes
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
      if (e.key === "ea_workspaces" || e.key === "ea_selected_workspace_id") {
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

  const closeAllPopovers = () => {
    setOrgOpen(false);
    setCreditsOpen(false);
  };

  const handleWorkspaceClick = (id) => {
    setOrgOpen(false);
    setActiveWorkspaceId(id);
    setSelectedWorkspaceId(id);
  };

  const handleCreateWorkspaceClick = () => {
    setOrgOpen(false);
    navigate("/copilot/workspace/create");
  };

  return (
    <div className="ss-app">
      <Sidebar />

      {/* click outside close */}
      <main className="ss-main" onClick={closeAllPopovers}>
        {/* TOP BAR */}
        <header className="ss-topbar">
          <div className="ss-top-left">
            <h1 className="ss-title">SuperSearch</h1>
          </div>

          {/* Tabs */}
          <div className="ss-tabs" role="tablist" aria-label="SuperSearch tabs">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "supersearch"}
              className={
                "ss-tab" + (activeTab === "supersearch" ? " is-active" : "")
              }
              onClick={() => setActiveTab("supersearch")}
            >
              SuperSearch
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "leadlists"}
              className={
                "ss-tab" + (activeTab === "leadlists" ? " is-active" : "")
              }
              onClick={() => setActiveTab("leadlists")}
            >
              Lead Lists
            </button>
          </div>

          <div className="ss-top-right">
            {/* ✅ Coins / Credits dropdown */}
            <div
              className="ss-credits-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="ss-coins"
                onClick={() => {
                  setCreditsOpen((v) => !v);
                  setOrgOpen(false);
                }}
                aria-expanded={creditsOpen}
              >
                <span className="ss-coin-icon">🪙</span>
                <span className="ss-coin-value">0</span>
                <span className="ss-coin-caret">▾</span>
              </button>

              {creditsOpen && (
                <div className="ss-credits-dropdown">
                  <div className="ss-credits-title">Credits</div>

                  <div className="ss-credits-row">
                    <span className="ss-credits-label">Instantly Credits</span>
                    <span className="ss-credits-count">0 / 100</span>
                  </div>

                  <button className="ss-credits-btn" type="button">
                    Get Credits
                  </button>
                </div>
              )}
            </div>

            <button className="ss-get-features-btn" type="button">
              Upgrade
            </button>

            {/* ✅ ORG DROPDOWN (working) */}
            <div className="ss-org-wrap" onClick={(e) => e.stopPropagation()}>
              <button
                className="ss-org-btn"
                type="button"
                onClick={() => {
                  setOrgOpen((v) => !v);
                  setCreditsOpen(false);
                }}
                aria-expanded={orgOpen}
              >
                {activeWorkspaceName} <span className="ss-org-caret">▾</span>
              </button>

              {orgOpen && (
                <div className="ss-org-dropdown">
                  <div className="ss-org-search">
                    <input placeholder="Search" />
                  </div>

                  <div className="ss-org-list">
                    {workspaces.map((ws) => (
                      <button
                        key={ws.id}
                        type="button"
                        className={
                          "ss-org-item" +
                          (ws.id === activeWorkspaceId ? " is-active" : "")
                        }
                        onClick={() => handleWorkspaceClick(ws.id)}
                      >
                        {ws.name}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="ss-org-item ss-org-create"
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
        {activeTab === "supersearch" ? (
          <SuperSearchScreen />
        ) : (
          <div className="ss-leadlists">
            <h2 className="ss-leadlists-title">Lead Lists</h2>
            <p className="ss-leadlists-sub">No lists yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
