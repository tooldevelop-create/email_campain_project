// src/components/CampaignsPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/CampaignsPage.css";

import {
  Play,
  MoreHorizontal,
  Zap,
  Pause,
  AlertCircle,
  CheckCircle2,
  Infinity as InfinityIcon,
  Download,
  Trash2, // 🔴 delete icon
} from "lucide-react";

/* ------------ Dummy data ------------ */
const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: "Vishnuuu",
    status: "Completed",
    progress: 100,
    sent: 2,
    clicks: 0,
    repliedCount: 0,
    repliedRate: "0.0%",
    opportunities: "-",
    createdAt: "2024-11-19T15:00:00Z",
  },
  {
    id: 2,
    name: "India Campaign-Selling-Elizabeth",
    status: "Draft",
    progress: null,
    sent: "-",
    clicks: "-",
    repliedCount: "-",
    repliedRate: "-",
    opportunities: "-",
    createdAt: "2024-11-18T10:30:00Z",
  },
  {
    id: 3,
    name: "India Campaign-Selling-Nishant",
    status: "Draft",
    progress: null,
    sent: "-",
    clicks: "-",
    repliedCount: "-",
    repliedRate: "-",
    opportunities: "-",
    createdAt: "2024-11-17T09:10:00Z",
  },
];

/* ------------ Filters ------------ */
const STATUS_OPTIONS = [
  { key: "all", label: "All statuses", icon: Zap, color: "#facc15" },
  { key: "Active", label: "Active", icon: Play, color: "#22c55e" },
  { key: "Draft", label: "Draft", icon: Pause, color: "#9ca3af" },
  { key: "Paused", label: "Paused", icon: Pause, color: "#f97316" },
  { key: "Error", label: "Error", icon: AlertCircle, color: "#ef4444" },
  { key: "Completed", label: "Completed", icon: CheckCircle2, color: "#22c55e" },
  { key: "Evergreen", label: "Evergreen", icon: InfinityIcon, color: "#38bdf8" },
];

const SORT_OPTIONS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "name-az", label: "Name A-Z" },
  { key: "name-za", label: "Name Z-A" },
];

/* ------------ Small components ------------ */

function StatusBadge({ status }) {
  if (status === "Completed") {
    return <span className="camp-status camp-status-completed">Completed</span>;
  }
  if (status === "Draft") {
    return <span className="camp-status camp-status-draft">Draft</span>;
  }
  if (status === "Active") {
    return <span className="camp-status camp-status-active">Active</span>;
  }
  if (status === "Paused") {
    return <span className="camp-status camp-status-paused">Paused</span>;
  }
  if (status === "Error") {
    return <span className="camp-status camp-status-error">Error</span>;
  }
  return <span className="camp-status">{status}</span>;
}

function ProgressBar({ value }) {
  if (value == null) {
    return <span className="camp-progress-empty">-</span>;
  }
  return (
    <div className="camp-progress">
      <span className="camp-progress-label">{value}%</span>
      <div className="camp-progress-track">
        <div className="camp-progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ------------ Page component ------------ */

export default function CampaignsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);

  // top-bar credits popover
  const [creditsOpen, setCreditsOpen] = useState(false);

  // filters / sorting
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusSearch, setStatusSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);

  const [sortKey, setSortKey] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);

  // main search (campaigns)
  const [campaignSearch, setCampaignSearch] = useState("");

  // row menu (3 dots)
  const [openMenuId, setOpenMenuId] = useState(null);

  // org dropdown
  const [orgOpen, setOrgOpen] = useState(false);
  const [orgSearch, setOrgSearch] = useState("");

  // Import modal
  const [importOpen, setImportOpen] = useState(false);
  const [importTab, setImportTab] = useState("file"); // "file" | "link"
  const [selectedFileName, setSelectedFileName] = useState("");
  const [importLink, setImportLink] = useState("");
  const fileInputRef = useRef(null);

  // 🔴 selection: which rows are selected
  const [selectedIds, setSelectedIds] = useState(new Set());
  const selectedCount = selectedIds.size;

  // Delete confirm modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  /* ------ new campaign created from /campaigns/create ------ */
  useEffect(() => {
    const state = location.state;
    const newName = state && state.newCampaignName;
    if (newName) {
      setCampaigns((prev) => {
        const nextId = prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
        const now = new Date().toISOString();
        return [
          ...prev,
          {
            id: nextId,
            name: newName,
            status: "Draft",
            progress: null,
            sent: "-",
            clicks: "-",
            repliedCount: "-",
            repliedRate: "-",
            opportunities: "-",
            createdAt: now,
          },
        ];
      });

      // state clear
      navigate("/campaigns", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  /* ------ helpers ------ */

  const closeAllPopovers = () => {
    setCreditsOpen(false);
    setStatusOpen(false);
    setSortOpen(false);
    setOrgOpen(false);
    setOpenMenuId(null);
  };

  const visibleCampaigns = useMemo(() => {
    let rows = [...campaigns];

    if (statusFilter !== "all") {
      rows = rows.filter((c) => c.status === statusFilter);
    }

    const q = campaignSearch.trim().toLowerCase();
    if (q) {
      rows = rows.filter((c) => c.name.toLowerCase().includes(q));
    }

    rows.sort((a, b) => {
      if (sortKey === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortKey === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortKey === "name-az") {
        return a.name.localeCompare(b.name);
      }
      if (sortKey === "name-za") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return rows;
  }, [campaigns, statusFilter, sortKey, campaignSearch]);

  /* ------ selection logic ------ */

  const toggleRowSelected = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const allVisibleSelected =
    visibleCampaigns.length > 0 &&
    visibleCampaigns.every((c) => selectedIds.has(c.id));

  const toggleSelectAllVisible = (checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        visibleCampaigns.forEach((c) => next.add(c.id));
      } else {
        visibleCampaigns.forEach((c) => next.delete(c.id));
      }
      return next;
    });
  };

  /* ------ row actions ------ */

  const handleRename = (campaign) => {
    const newName = window.prompt("Rename campaign:", campaign.name);
    if (!newName) return;
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, name: newName } : c))
    );
  };

  const handleDeleteSingle = (campaign) => {
    if (!window.confirm(`Delete "${campaign.name}"?`)) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(campaign.id);
      return next;
    });
  };

  const handleDuplicate = (campaign) => {
    const nextId = campaigns.length
      ? Math.max(...campaigns.map((c) => c.id)) + 1
      : 1;
    setCampaigns((prev) => [
      ...prev,
      {
        ...campaign,
        id: nextId,
        name: `${campaign.name} (copy)`,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleDownloadAnalytics = (campaign) => {
    console.log("Download analytics CSV for", campaign.name);
    alert("Pretend download analytics CSV – frontend demo only.");
  };

  const handleShare = (campaign) => {
    console.log("Share campaign", campaign.name);
    alert("Pretend share link copied – frontend demo only.");
  };

  /* ------ import helpers ------ */

  const handleOpenImport = (e) => {
    e.stopPropagation();
    setImportTab("file");
    setSelectedFileName("");
    setImportLink("");
    setImportOpen(true);
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    alert(`Selected file: ${file.name} (demo only – no real upload).`);
  };

  const handleImportFromLink = () => {
    if (!importLink.trim()) {
      alert("Please paste a shareable link first.");
      return;
    }
    alert(`Import from link: ${importLink} (demo only).`);
  };

  /* ------ delete confirm helpers ------ */

  const openDeleteConfirm = () => {
    if (selectedCount === 0) return;
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setCampaigns((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
    setDeleteConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
  };

  /* ------ current options ------ */

  const currentStatusOption =
    STATUS_OPTIONS.find((o) => o.key === statusFilter) || STATUS_OPTIONS[0];

  const currentSortOption =
    SORT_OPTIONS.find((o) => o.key === sortKey) || SORT_OPTIONS[0];

  const filteredStatusOptions = STATUS_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(statusSearch.toLowerCase())
  );

  /* ------------ render ------------ */

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main" onClick={closeAllPopovers}>
        {/* TOP BAR */}
        <header className="ss-topbar">
          <div className="ss-top-left">
            <h1 className="ss-title">Campaigns</h1>
          </div>

          <div className="ss-top-right">
            {/* Credits */}
            <div
              className="ss-coins-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ss-coins ss-coins-clickable"
                onClick={() => setCreditsOpen((o) => !o)}
              >
                <span className="ss-coin-icon">🪙</span>
                <span className="ss-coin-value">286</span>
              </button>

              {creditsOpen && (
                <div className="camp-credits-popover">
                  <div className="camp-credits-title">Credits</div>
                  <div className="camp-credits-row">
                    <span>Instantly Credits</span>
                    <span className="camp-credits-count">286 / 100</span>
                  </div>
                  <div className="camp-credits-bar">
                    <div className="camp-credits-bar-fill" />
                  </div>
                  <button className="camp-credits-upgrade-btn">
                    Upgrade &amp; Change Limits
                  </button>
                </div>
              )}
            </div>

            <button className="ss-get-features-btn">Get All Features</button>

            {/* My Organization */}
            <div
              className="ss-org-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ss-org-btn"
                onClick={() => setOrgOpen((o) => !o)}
              >
                My Organization ▾
              </button>

              {orgOpen && (
                <div className="camp-org-dropdown">
                  <div className="camp-org-search">
                    <input
                      type="text"
                      placeholder="Search"
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                    />
                  </div>

                  <button
                    className="camp-org-item camp-org-item-active"
                    onClick={() => {
                      setOrgOpen(false);
                      navigate("/copilot");
                    }}
                  >
                    My Organization
                  </button>

                  <button
                    className="camp-org-item camp-org-create"
                    onClick={() => {
                      setOrgOpen(false);
                      navigate("/copilot");
                    }}
                  >
                    + Create Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="camp-page">
          <div className="camp-inner">
            {/* Toolbar row */}
            <div className="camp-toolbar">
              <div className="camp-search">
                <span className="camp-search-icon">🔍</span>
                <input
                  className="camp-search-input"
                  placeholder="Search..."
                  value={campaignSearch}
                  onChange={(e) => setCampaignSearch(e.target.value)}
                />
              </div>

              <div className="camp-toolbar-right">
                {/* STATUS FILTER DROPDOWN */}
                <div
                  className="camp-filter-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="camp-filter-btn"
                    onClick={() => setStatusOpen((o) => !o)}
                  >
                    <span className="camp-filter-icon">⚡</span>
                    <span>{currentStatusOption.label}</span>
                    <span className="camp-caret">▾</span>
                  </button>

                  {statusOpen && (
                    <div className="camp-status-dropdown">
                      <div className="camp-status-search">
                        <input
                          placeholder="Search..."
                          value={statusSearch}
                          onChange={(e) => setStatusSearch(e.target.value)}
                        />
                      </div>
                      <div className="camp-status-list">
                        {filteredStatusOptions.map((opt) => {
                          const Icon = opt.icon;
                          const selected = opt.key === statusFilter;
                          return (
                            <button
                              key={opt.key}
                              className={
                                "camp-status-option" +
                                (selected ? " camp-status-option-active" : "")
                              }
                              onClick={() => {
                                setStatusFilter(opt.key);
                                setStatusOpen(false);
                              }}
                            >
                              <span className="camp-status-option-left">
                                <Icon
                                  size={16}
                                  strokeWidth={2}
                                  style={{ color: opt.color }}
                                />
                                <span>{opt.label}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* SORT DROPDOWN */}
                <div
                  className="camp-filter-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="camp-filter-btn"
                    onClick={() => setSortOpen((o) => !o)}
                  >
                    <span>{currentSortOption.label}</span>
                    <span className="camp-caret">▾</span>
                  </button>

                  {sortOpen && (
                    <div className="camp-sort-dropdown">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          className={
                            "camp-sort-option" +
                            (opt.key === sortKey
                              ? " camp-sort-option-active"
                              : "")
                          }
                          onClick={() => {
                            setSortKey(opt.key);
                            setSortOpen(false);
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* IMPORT BUTTON */}
                <button
                  className="camp-icon-only-btn"
                  title="Import campaign"
                  onClick={handleOpenImport}
                >
                  <Download size={18} strokeWidth={2} />
                </button>

                {/* RIGHT SIDE: ADD NEW or DELETE */}
                {selectedCount > 0 ? (
                  <button
                    className="camp-delete-btn"
                    title={`Delete ${selectedCount} campaigns`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirm();
                    }}
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                ) : (
                  <button
                    className="camp-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/campaigns/create");
                    }}
                  >
                    <span className="camp-add-plus">+</span>
                    <span>Add New</span>
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="camp-table-wrapper">
              {/* Header row */}
              <div className="camp-header-row">
                <div className="camp-col camp-col-checkbox">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(e) =>
                      toggleSelectAllVisible(e.target.checked)
                    }
                  />
                </div>
                <div className="camp-col camp-col-name">Name</div>
                <div className="camp-col">Status</div>
                <div className="camp-col">Progress</div>
                <div className="camp-col">Sent</div>
                <div className="camp-col">Click</div>
                <div className="camp-col">Replied</div>
                <div className="camp-col">Opportunities</div>
                <div className="camp-col camp-col-actions" />
              </div>

              {/* Data rows */}
              {visibleCampaigns.map((c) => (
                <div key={c.id} className="camp-row">
                  <div className="camp-col camp-col-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={(e) =>
                        toggleRowSelected(c.id, e.target.checked)
                      }
                    />
                  </div>

                  <div className="camp-col camp-col-name">
                    <span className="camp-row-name">{c.name}</span>
                  </div>

                  <div className="camp-col">
                    <StatusBadge status={c.status} />
                  </div>

                  <div className="camp-col">
                    <ProgressBar value={c.progress} />
                  </div>

                  <div className="camp-col">{c.sent}</div>
                  <div className="camp-col">{c.clicks}</div>

                  <div className="camp-col">
                    {c.repliedCount}{" "}
                    {c.repliedRate && c.repliedRate !== "-" ? (
                      <>
                        <span className="camp-divider">|</span>
                        <span>{c.repliedRate}</span>
                      </>
                    ) : (
                      "-"
                    )}
                  </div>

                  <div className="camp-col">{c.opportunities}</div>

                  {/* RIGHT ACTION ICONS */}
                  <div className="camp-col camp-col-actions">
                    <button
                      className="camp-icon-btn camp-icon-play"
                      title="Start"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Start campaign "${c.name}" (demo).`);
                      }}
                    >
                      <Play size={17} strokeWidth={2} />
                    </button>

                    <div
                      className="camp-more-wrapper"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="camp-icon-btn camp-icon-more"
                        title="More"
                        onClick={() =>
                          setOpenMenuId((id) => (id === c.id ? null : c.id))
                        }
                      >
                        <MoreHorizontal size={18} strokeWidth={2} />
                      </button>

                      {openMenuId === c.id && (
                        <div className="camp-row-menu">
                          <button
                            onClick={() => {
                              handleRename(c);
                              setOpenMenuId(null);
                            }}
                          >
                            <span className="camp-row-menu-label">Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteSingle(c);
                              setOpenMenuId(null);
                            }}
                          >
                            <span className="camp-row-menu-label">Delete</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDuplicate(c);
                              setOpenMenuId(null);
                            }}
                          >
                            <span className="camp-row-menu-label">
                              Duplicate campaign
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              handleDownloadAnalytics(c);
                              setOpenMenuId(null);
                            }}
                          >
                            <span className="camp-row-menu-label">
                              Download analytics CSV
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              handleShare(c);
                              setOpenMenuId(null);
                            }}
                          >
                            <span className="camp-row-menu-label">
                              Share Campaign
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IMPORT MODAL */}
        {importOpen && (
          <div
            className="camp-import-overlay"
            onClick={() => setImportOpen(false)}
          >
            <div
              className="camp-import-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="camp-import-title">Import campaign</h2>

              <div className="camp-import-tabs">
                <button
                  className={
                    "camp-import-tab" +
                    (importTab === "file" ? " camp-import-tab-active" : "")
                  }
                  onClick={() => setImportTab("file")}
                >
                  From file
                </button>
                <button
                  className={
                    "camp-import-tab" +
                    (importTab === "link" ? " camp-import-tab-active" : "")
                  }
                  onClick={() => setImportTab("link")}
                >
                  From link
                </button>
              </div>

              {importTab === "file" ? (
                <div className="camp-import-file">
                  <div className="camp-import-cloud">
                    <span className="camp-import-cloud-icon">☁️</span>
                    <span className="camp-import-cloud-arrow">⬆</span>
                  </div>
                  <button
                    className="camp-import-browse-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileSelected}
                  />
                  {selectedFileName && (
                    <div className="camp-import-filename">
                      Selected: {selectedFileName}
                    </div>
                  )}
                </div>
              ) : (
                <div className="camp-import-link">
                  <label className="camp-import-link-label">
                    Shareable link
                  </label>
                  <input
                    className="camp-import-link-input"
                    placeholder="Paste your shareable link here"
                    value={importLink}
                    onChange={(e) => setImportLink(e.target.value)}
                  />
                  <button
                    className="camp-import-browse-btn camp-import-link-btn"
                    onClick={handleImportFromLink}
                  >
                    Import
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DELETE CONFIRM MODAL */}
        {deleteConfirmOpen && (
          <div
            className="camp-delete-overlay"
            onClick={handleCancelDelete}
          >
            <div
              className="camp-delete-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="camp-delete-header">
                <span className="camp-delete-title">
                  Delete {selectedCount} campaign
                  {selectedCount > 1 ? "s" : ""}
                </span>
                <button
                  className="camp-delete-close"
                  onClick={handleCancelDelete}
                >
                  ×
                </button>
              </div>

              <div className="camp-delete-body">
                <p>
                  Are you sure you want to delete {selectedCount} campaign
                  {selectedCount > 1 ? "s" : ""}?
                </p>
                <p>You will not be able to recover those campaigns!</p>
              </div>

              <div className="camp-delete-actions">
                <button
                  className="camp-delete-cancel"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="camp-delete-ok"
                  onClick={handleConfirmDelete}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
