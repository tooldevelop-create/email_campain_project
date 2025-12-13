// src/components/EmailAccountsPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Layout.css";
import "../styles/EmailAccountsPage.css";

/* ------ shared storage helpers (same keys CreateWorkspace page me bhi) ------ */
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

const STATUS_OPTIONS = [
  "All statuses",
  "Paused",
  "Has errors",
  "No custom tracking domain",
  "Warmup active",
  "Warmup paused",
  "Warmup has errors",
  "Pre-warmed accounts",
  "DFY accounts",
  "DFY Setup Pending",
  "No Tag",
];

const EMAIL_ACCOUNTS = [
  {
    id: 1,
    email: "akriti@ecoplastics.in",
    emailsSent: 0,
    dailyLimit: 30,
    warmupEmails: 80,
    healthScore: 100,
    status: "Warmup active",
  },
  {
    id: 2,
    email: "elizabeth.a@ecoplastics.in",
    emailsSent: 0,
    dailyLimit: 30,
    warmupEmails: 79,
    healthScore: 100,
    status: "Warmup active",
  },
  {
    id: 3,
    email: "nishant.j@ecoplastics.in",
    emailsSent: 0,
    dailyLimit: 30,
    warmupEmails: 69,
    healthScore: 100,
    status: "Warmup active",
  },
];

/* ============ GENERIC MODALS ============ */

function InsertLinkModal({ open, onClose, onInsert }) {
  const [displayText, setDisplayText] = useState("");
  const [url, setUrl] = useState("");

  if (!open) return null;

  const handleInsert = () => {
    if (!url.trim()) {
      onClose();
      return;
    }
    onInsert({
      display: displayText.trim(),
      url: url.trim(),
    });
    setDisplayText("");
    setUrl("");
    onClose();
  };

  const handleClose = () => {
    setDisplayText("");
    setUrl("");
    onClose();
  };

  return (
    <div className="ea-modal-backdrop" onClick={handleClose}>
      <div
        className="ea-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3 className="ea-modal-title">Insert Link</h3>

        <div className="ea-modal-field">
          <label className="ea-label">Display as</label>
          <input
            className="ea-input"
            value={displayText}
            onChange={(e) => setDisplayText(e.target.value)}
          />
        </div>

        <div className="ea-modal-field">
          <label className="ea-label">Web address (URL)</label>
          <input
            className="ea-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="ea-modal-footer">
          <button className="ea-modal-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="ea-modal-primary" onClick={handleInsert}>
            Insert Link
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateTagModal({ open, onClose, onCreate }) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (!label.trim()) {
      onClose();
      return;
    }
    onCreate({
      label: label.trim(),
      description: description.trim(),
    });
    setLabel("");
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    setLabel("");
    setDescription("");
    onClose();
  };

  return (
    <div className="ea-modal-backdrop" onClick={handleClose}>
      <div
        className="ea-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3 className="ea-modal-title">Create Tag</h3>

        <div className="ea-modal-field">
          <label className="ea-label">Label</label>
          <input
            className="ea-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="ea-modal-field">
          <label className="ea-label">Description</label>
          <input
            className="ea-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
          />
        </div>

        <div className="ea-modal-footer">
          <button className="ea-modal-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="ea-modal-primary" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ RIGHT SIDE BULK EDIT PANEL ============ */

function BulkEditPanel({ open, onClose, showAdvanced, setShowAdvanced }) {
  const [signature, setSignature] = useState("");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const [createTagModalOpen, setCreateTagModalOpen] = useState(false);

  if (!open) return null;

  // signature helpers
  const handleInsertLink = ({ display, url }) => {
    const toInsert = display ? `[${display}](${url})` : url;
    setSignature((prev) => (prev ? `${prev} ${toInsert}` : toInsert));
  };

  const handleEmojiClick = (emoji) => {
    setSignature((prev) => prev + emoji);
    setIsEmojiOpen(false);
  };

  // tags helpers
  const toggleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateTag = ({ label }) => {
    setTags((prev) => (prev.includes(label) ? prev : [...prev, label]));
    setSelectedTags((prev) =>
      prev.includes(label) ? prev : [...prev, label]
    );
  };

  return (
    <>
      <aside className="ea-bulk-panel">
        {/* header */}
        <div className="ea-bulk-panel-header">
          <h2 className="ea-bulk-panel-title">Bulk edit settings</h2>
          <button className="ea-bulk-panel-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ea-bulk-panel-body">
          {/* Sender name */}
          <section className="ea-section">
            <div className="ea-section-header">
              <span className="ea-section-icon">👤</span>
              <div>
                <h3 className="ea-section-title">Sender name</h3>
              </div>
            </div>

            <div className="ea-field-row">
              <div className="ea-field">
                <label className="ea-label">First Name</label>
                <input className="ea-input" />
              </div>
              <div className="ea-field">
                <label className="ea-label">Last Name</label>
                <input className="ea-input" />
              </div>
            </div>
          </section>

          {/* Signature */}
          <section className="ea-section">
            <h3 className="ea-section-title">Signature</h3>

            <div className="ea-signature-wrapper">
              <div className="ea-signature-box">
                <textarea
                  className="ea-signature-textarea"
                  placeholder="Start typing here..."
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />

                <div className="ea-signature-toolbar">
                  <button className="ea-signature-btn">B</button>
                  <button className="ea-signature-btn">I</button>
                  <button className="ea-signature-btn">U</button>
                  <button className="ea-signature-btn">A</button>

                  <button
                    className="ea-signature-btn"
                    type="button"
                    onClick={() => setIsLinkModalOpen(true)}
                  >
                    🔗
                  </button>

                  <button className="ea-signature-btn" type="button">
                    🖼
                  </button>

                  <button
                    className="ea-signature-btn"
                    type="button"
                    onClick={() => setIsEmojiOpen((v) => !v)}
                  >
                    🙂
                  </button>

                  <button className="ea-signature-btn" type="button">
                    {"</>"}
                  </button>
                </div>

                {isEmojiOpen && (
                  <div className="ea-emoji-popup">
                    {[
                      "😀",
                      "😁",
                      "😂",
                      "😅",
                      "😊",
                      "😍",
                      "🤩",
                      "😎",
                      "😇",
                      "😉",
                      "🙃",
                      "🤔",
                    ].map((em) => (
                      <button
                        key={em}
                        className="ea-emoji-btn"
                        type="button"
                        onClick={() => handleEmojiClick(em)}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Tags */}
          <section className="ea-section">
            <div className="ea-section-header">
              <span className="ea-section-icon">🏷</span>
              <h3 className="ea-section-title">Tags</h3>
              <span className="ea-info-icon">i</span>
            </div>

            <div className="ea-field">
              <label className="ea-label">Tags</label>
              <div
                className={
                  "ea-select" + (tagsDropdownOpen ? " ea-select-open" : "")
                }
                onClick={() => setTagsDropdownOpen((v) => !v)}
              >
                <span className="ea-select-placeholder">
                  {selectedTags.length === 0
                    ? "Tags"
                    : selectedTags.join(", ")}
                </span>
                <span className="ea-select-caret">▾</span>
              </div>
              <p className="ea-help-text">
                In bulk editor mode, this input shows tags across your selected
                accounts – if you add or remove a tag, they will be
                added/removed from all the selected accounts.
              </p>

              {tagsDropdownOpen && (
                <div className="ea-tags-dropdown">
                  {tags.length === 0 && (
                    <div className="ea-tags-empty">No tags yet</div>
                  )}

                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={
                        "ea-tags-item" +
                        (selectedTags.includes(tag)
                          ? " ea-tags-item-active"
                          : "")
                      }
                      onClick={() => toggleTagSelection(tag)}
                    >
                      {tag}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="ea-tags-create"
                    onClick={() => {
                      setTagsDropdownOpen(false);
                      setCreateTagModalOpen(true);
                    }}
                  >
                    Create a new tag
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Campaign Settings */}
          <section className="ea-section">
            <div className="ea-section-header">
              <span className="ea-section-icon">📣</span>
              <h3 className="ea-section-title">Campaign Settings</h3>
            </div>

            <div className="ea-field-row">
              <div className="ea-field">
                <label className="ea-label">
                  Daily campaign limit
                  <span className="ea-label-sub">Daily sending limit</span>
                </label>
                <div className="ea-inline-input">
                  <input className="ea-input" />
                  <span className="ea-inline-suffix">emails</span>
                </div>
              </div>

              <div className="ea-field">
                <label className="ea-label">
                  Minimum wait time
                  <span className="ea-label-sub">
                    When used with multiple campaigns
                  </span>
                </label>
                <div className="ea-inline-input">
                  <input className="ea-input" />
                  <span className="ea-inline-suffix">minute(s)</span>
                </div>
              </div>
            </div>

            <div className="ea-field-row ea-field-row-middle">
              <div className="ea-field ea-field-wide">
                <label className="ea-label">
                  Campaign slow ramp
                  <span className="ea-label-sub">
                    Gradually increase the number of campaign emails sent per
                    day
                  </span>
                </label>
                <div className="ea-toggle-row">
                  <label className="ea-switch-row">
                    <input type="checkbox" />
                    <span className="ea-switch-fake" />
                    <span className="ea-switch-label">Enable</span>
                  </label>

                  <button className="ea-chip-btn">Recommended</button>
                </div>
              </div>

              <div className="ea-field ea-field-wide">
                <label className="ea-label">Reply-to Address</label>
                <input
                  className="ea-input"
                  placeholder="Set a reply-to email address (optional)"
                />
              </div>
            </div>
          </section>

          {/* Daily Inbox Placement */}
          <section className="ea-section">
            <h3 className="ea-section-title">
              Daily Inbox Placement test limit
            </h3>
            <p className="ea-label-sub ea-mb8">
              Maximum number of inbox placement tests per day
            </p>
            <div className="ea-inline-input ea-inline-input-narrow">
              <input className="ea-input" />
              <span className="ea-inline-suffix">test emails</span>
            </div>
          </section>

          {/* Custom Tracking Domain */}
          <section className="ea-section">
            <div className="ea-section-header">
              <span className="ea-section-icon">🌐</span>
              <h3 className="ea-section-title">Custom Tracking Domain</h3>
            </div>

            <label className="ea-switch-row ea-switch-row-block">
              <input type="checkbox" />
              <span className="ea-switch-fake" />
              <span className="ea-switch-label">
                Enable custom tracking domain
              </span>
            </label>
          </section>

          {/* Warmup Settings */}
          <section className="ea-section">
            <div className="ea-section-header">
              <span className="ea-section-icon">🔥</span>
              <h3 className="ea-section-title">Warmup Settings</h3>
            </div>

            <div className="ea-field">
              <label className="ea-label">
                Warmup filter tag
                <span className="ea-info-icon">i</span>
              </label>
              <div className="ea-field-row ea-field-row-tight">
                <div className="ea-select ea-select-grow">
                  <span className="ea-select-placeholder">Custom tag</span>
                  <span className="ea-select-caret">⟳</span>
                </div>
                <div className="ea-input-hint">
                  Example: &apos;golden-pineapples&apos;
                </div>
              </div>
            </div>

            <div className="ea-field-row">
              <div className="ea-field">
                <label className="ea-label">
                  Increase per day
                  <span className="ea-label-sub">Suggested 1</span>
                </label>
                <input className="ea-input" />
              </div>
              <div className="ea-field">
                <label className="ea-label">
                  Daily warmup limit
                  <span className="ea-label-sub">Suggested 10</span>
                </label>
                <input className="ea-input" />
              </div>
            </div>

            <label className="ea-switch-row ea-switch-row-block ea-mt12">
              <input type="checkbox" />
              <span className="ea-switch-fake" />
              <span className="ea-switch-label">
                Disable slow warmup
                <span className="ea-info-icon">i</span>
              </span>
            </label>

            <div className="ea-field ea-mt12">
              <label className="ea-label">
                Reply rate %
                <span className="ea-label-sub">Suggested 30</span>
              </label>
              <input className="ea-input" />
            </div>

            <div className="ea-advanced-toggle">
              <button
                type="button"
                className="ea-advanced-btn"
                onClick={() => setShowAdvanced((v) => !v)}
              >
                {showAdvanced
                  ? "Hide advanced settings ▲"
                  : "Show advanced settings ▾"}
              </button>
            </div>

            {showAdvanced && (
              <div className="ea-advanced-block">
                {/* ... (same advanced rows as before, unchanged) ... */}

                <h3 className="ea-section-title">Warmup Settings Advanced</h3>

                <div className="ea-adv-row">
                  <div className="ea-adv-text">
                    <div className="ea-adv-title">Weekdays only</div>
                    <div className="ea-adv-sub">
                      Only send warmup emails on weekdays for a more natural
                      sending pattern
                    </div>
                  </div>
                  <div className="ea-adv-toggle-group">
                    <button className="ea-adv-toggle">Disable</button>
                    <button className="ea-adv-toggle ea-adv-toggle-active">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="ea-adv-row">
                  <div className="ea-adv-text">
                    <div className="ea-adv-title">Read emulation</div>
                    <div className="ea-adv-sub">
                      Spend time and scroll through your warmup email to
                      emulate human-like reading
                    </div>
                  </div>
                  <div className="ea-adv-toggle-group">
                    <button className="ea-adv-toggle">Disable</button>
                    <button className="ea-adv-toggle ea-adv-toggle-active">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="ea-adv-row">
                  <div className="ea-adv-text">
                    <div className="ea-adv-title">
                      Warm custom tracking domain
                    </div>
                    <div className="ea-adv-sub">
                      Include your custom tracking domain in your warmup emails
                      to further improve deliverability
                    </div>
                  </div>
                  <div className="ea-adv-toggle-group">
                    <button className="ea-adv-toggle">Disable</button>
                    <button className="ea-adv-toggle ea-adv-toggle-active">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="ea-adv-row">
                  <div className="ea-adv-text">
                    <div className="ea-adv-title">Open Rate</div>
                    <div className="ea-adv-sub">
                      How many of your warm up emails to open
                    </div>
                  </div>
                  <div className="ea-slider-wrapper">
                    <span className="ea-slider-value">0</span>
                    <div className="ea-slider-track">
                      <div className="ea-slider-thumb" />
                    </div>
                  </div>
                </div>

                <div className="ea-adv-row">
                  <div className="ea-adv-text">
                    <div className="ea-adv-title">Spam Protection</div>
                    <div className="ea-adv-sub">
                      How many of your warm up emails to save from spam folder
                    </div>
                  </div>
                  <div className="ea-slider-wrapper">
                    <span className="ea-slider-value">0</span>
                    <div className="ea-slider-track">
                      <div className="ea-slider-thumb" />
                    </div>
                  </div>
                </div>

                <div className="ea-adv-row">
                  <div className="ea-adv-text">
                    <div className="ea-adv-title">Mark Important</div>
                    <div className="ea-adv-sub">
                      How many of your warm up emails to mark as important
                    </div>
                  </div>
                  <div className="ea-slider-wrapper">
                    <span className="ea-slider-value">0</span>
                    <div className="ea-slider-track">
                      <div className="ea-slider-thumb" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* footer */}
        <div className="ea-bulk-panel-footer">
          <button className="ea-bulk-panel-save" onClick={onClose}>
            Save
          </button>
        </div>
      </aside>

      {/* Link + CreateTag modals */}
      <InsertLinkModal
        open={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleInsertLink}
      />
      <CreateTagModal
        open={createTagModalOpen}
        onClose={() => setCreateTagModalOpen(false)}
        onCreate={handleCreateTag}
      />
    </>
  );
}

/* ============ MAIN PAGE ============ */

export default function EmailAccountsPage() {
  const navigate = useNavigate();

  // workspaces (header dropdown)
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

  const activeWorkspaceName = useMemo(() => {
    const found = workspaces.find((w) => w.id === activeWorkspaceId);
    return found?.name || "My Organization";
  }, [workspaces, activeWorkspaceId]);

  // top bar popovers
  const [showCredits, setShowCredits] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);

  // filters
  const [statusOpen, setStatusOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState("All statuses");
  const [statusSearch, setStatusSearch] = useState("");

  // search in list
  const [searchText, setSearchText] = useState("");

  // accounts (so bulk actions can modify)
  const [accounts, setAccounts] = useState(EMAIL_ACCOUNTS);

  // row-level menu
  const [rowMenuId, setRowMenuId] = useState(null);

  // bulk toolbar
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // right panel
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredStatusOptions = useMemo(() => {
    const s = statusSearch.trim().toLowerCase();
    if (!s) return STATUS_OPTIONS;
    return STATUS_OPTIONS.filter((opt) => opt.toLowerCase().includes(s));
  }, [statusSearch]);

  const visibleAccounts = useMemo(
    () =>
      accounts.filter((acc) => {
        if (
          activeStatus !== "All statuses" &&
          acc.status.toLowerCase() !== activeStatus.toLowerCase()
        ) {
          return false;
        }
        if (!searchText.trim()) return true;
        return acc.email.toLowerCase().includes(searchText.toLowerCase());
      }),
    [accounts, activeStatus, searchText]
  );

  const handleStatusSelect = (status) => {
    setActiveStatus(status);
    setStatusOpen(false);
  };

  const toggleRowMenu = (id) => {
    setRowMenuId((prev) => (prev === id ? null : id));
  };

  // selection logic
  const isSelected = (id) => selectedIds.includes(id);

  const handleRowCheck = (id, checked) => {
    setSelectedIds((prev) => {
      if (checked) {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      } else {
        return prev.filter((x) => x !== id);
      }
    });
  };

  const allVisibleSelected =
    visibleAccounts.length > 0 &&
    visibleAccounts.every((acc) => selectedIds.includes(acc.id));

  const handleSelectAllVisible = (checked) => {
    if (checked) {
      const ids = visibleAccounts.map((a) => a.id);
      setSelectedIds(ids);
    } else {
      const visibleIds = new Set(visibleAccounts.map((a) => a.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    }
  };

  const selectedCount = selectedIds.length;
  const bulkMode = selectedCount > 0;

  const handleBulkMenuToggle = () => {
    setShowBulkMenu((v) => !v);
  };

  // 3-dots bulk menu actions
  const handleBulkActionMenu = (action) => {
    setShowBulkMenu(false);
    if (!selectedIds.length) return;

    if (action === "enable") {
      setAccounts((prev) =>
        prev.map((acc) =>
          selectedIds.includes(acc.id)
            ? { ...acc, status: "Warmup active" }
            : acc
        )
      );
    } else if (action === "pause") {
      setAccounts((prev) =>
        prev.map((acc) =>
          selectedIds.includes(acc.id)
            ? { ...acc, status: "Warmup paused" }
            : acc
        )
      );
    } else if (action === "unpause") {
      setAccounts((prev) =>
        prev.map((acc) =>
          selectedIds.includes(acc.id)
            ? { ...acc, status: "Warmup active" }
            : acc
        )
      );
    } else if (action === "delete") {
      setAccounts((prev) =>
        prev.filter((acc) => !selectedIds.includes(acc.id))
      );
      setSelectedIds([]);
    } else if (action === "csv") {
      const rows = accounts.filter((acc) => selectedIds.includes(acc.id));
      if (!rows.length) return;

      const header =
        "Email,Emails Sent,Daily Limit,Warmup Emails,Health Score,Status";
      const lines = rows.map(
        (a) =>
          `"${a.email}",${a.emailsSent},${a.dailyLimit},${a.warmupEmails},${a.healthScore},"${a.status}"`
      );
      const csv = [header, ...lines].join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "email_accounts.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleWorkspaceClick = (id) => {
    setActiveWorkspaceId(id);
    try {
      localStorage.setItem(SELECTED_WORKSPACE_KEY, id);
    } catch (e) {
      console.warn("Failed to store selected workspace", e);
    }
    setShowOrgMenu(false);
  };

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main">
        {/* TOP BAR */}
        <header className="ss-topbar">
          <div className="ss-top-left">
            <h1 className="ss-title">Email Accounts</h1>
          </div>

          <div className="ss-top-right">
            <div className="ea-coins-wrapper">
              <button
                className="ss-coins"
                onClick={() => setShowCredits((s) => !s)}
              >
                <span className="ss-coin-icon">🪙</span>
                <span className="ss-coin-value">286</span>
              </button>

              {showCredits && (
                <div className="ea-credits-popover">
                  <div className="ea-credits-title">Credits</div>
                  <div className="ea-credits-row">
                    <span>Instantly Credits</span>
                    <span>286 / 100</span>
                  </div>
                  <div className="ea-credits-bar">
                    <div className="ea-credits-bar-fill" />
                  </div>
                  <button className="ea-credits-btn">
                    Upgrade &amp; Change Limits
                  </button>
                </div>
              )}
            </div>

            <button className="ss-get-features-btn">Get All Features</button>

            {/* WORKSPACE DROPDOWN */}
            <div className="ea-org-wrapper">
              <button
                className="ss-org-btn"
                onClick={() => setShowOrgMenu((s) => !s)}
              >
                {activeWorkspaceName} ▾
              </button>

              {showOrgMenu && (
                <div className="ea-org-popover">
                  <div className="ea-org-search">
                    <input placeholder="Search" />
                  </div>

                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      className={
                        "ea-org-item" +
                        (ws.id === activeWorkspaceId
                          ? " ea-org-item-active"
                          : "")
                      }
                      onClick={() => handleWorkspaceClick(ws.id)}
                    >
                      {ws.name}
                    </button>
                  ))}

                  <button
                    className="ea-org-item ea-org-create"
                    onClick={() => {
                      setShowOrgMenu(false);
                      navigate("/copilot/workspace/create");
                    }}
                  >
                    + Create Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="ea-page">
          <div className="ea-inner">
            {/* Toolbar */}
            <div className="ea-toolbar">
              <div className="ea-search-box">
                <span className="ea-search-icon">🔍</span>
                <input
                  className="ea-search-input"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div className="ea-toolbar-right">
                {/* Status filter */}
                <div className="ea-status-wrapper">
                  <button
                    className="ea-status-btn"
                    onClick={() => setStatusOpen((o) => !o)}
                  >
                    <span className="ea-status-icon">⏳</span>
                    <span className="ea-status-text">{activeStatus}</span>
                    <span className="ea-status-caret">▾</span>
                  </button>

                  {statusOpen && (
                    <div className="ea-status-popover">
                      <div className="ea-status-search">
                        <input
                          placeholder="Search..."
                          value={statusSearch}
                          onChange={(e) => setStatusSearch(e.target.value)}
                        />
                      </div>

                      <div className="ea-status-list">
                        {filteredStatusOptions.map((opt) => (
                          <button
                            key={opt}
                            className={
                              "ea-status-option" +
                              (opt === activeStatus
                                ? " ea-status-option-active"
                                : "")
                            }
                            onClick={() => handleStatusSelect(opt)}
                          >
                            <span className="ea-status-dot" />
                            <span className="ea-status-label">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side: normal vs bulk mode */}
                {!bulkMode ? (
                  <>
                    <div className="ea-view-toggle">
                      <button className="ea-view-btn ea-view-btn-active">
                        ▤
                      </button>
                      <button className="ea-view-btn">▦</button>
                    </div>

                    <button
                      className="ea-add-btn"
                      onClick={() => navigate("/email-accounts/connect")}
                    >
                      + Add New
                    </button>
                  </>
                ) : (
                  <div className="ea-bulk-bar">
                    <button
                      className="ea-bulk-btn"
                      onClick={() => setShowBulkPanel(true)}
                    >
                      ✏️
                    </button>

                    <div className="ea-bulk-menu-wrapper">
                      <button
                        className="ea-bulk-btn"
                        onClick={handleBulkMenuToggle}
                      >
                        ⋯
                      </button>

                      {showBulkMenu && (
                        <div className="ea-bulk-menu">
                          <button
                            className="ea-bulk-menu-item"
                            onClick={() => handleBulkActionMenu("enable")}
                          >
                            Enable warmup
                          </button>
                          <button
                            className="ea-bulk-menu-item"
                            onClick={() => handleBulkActionMenu("pause")}
                          >
                            Pause warmup
                          </button>
                          <button
                            className="ea-bulk-menu-item"
                            onClick={() => handleBulkActionMenu("unpause")}
                          >
                            Unpause selected accounts
                          </button>
                          <button
                            className="ea-bulk-menu-item ea-bulk-menu-danger"
                            onClick={() => handleBulkActionMenu("delete")}
                          >
                            Delete selected accounts
                          </button>
                          <button
                            className="ea-bulk-menu-item"
                            onClick={() => handleBulkActionMenu("csv")}
                          >
                            Download CSV
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="ea-table-wrapper">
              <table className="ea-table">
                <thead>
                  <tr>
                    <th className="ea-col-check">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={(e) =>
                          handleSelectAllVisible(e.target.checked)
                        }
                      />
                    </th>
                    <th className="ea-col-email">Email</th>
                    <th>Emails Sent</th>
                    <th>Warmup Emails</th>
                    <th>Health Score</th>
                    <th className="ea-col-actions" />
                  </tr>
                </thead>
                <tbody>
                  {visibleAccounts.map((acc) => (
                    <tr key={acc.id} className="ea-row">
                      <td className="ea-col-check">
                        <input
                          type="checkbox"
                          checked={isSelected(acc.id)}
                          onChange={(e) =>
                            handleRowCheck(acc.id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="ea-col-email">{acc.email}</td>
                      <td>
                        {acc.emailsSent} of {acc.dailyLimit}
                      </td>
                      <td>{acc.warmupEmails}</td>
                      <td className="ea-health">
                        <span className="ea-health-flame">🔥</span>
                        <span>{acc.healthScore}%</span>
                      </td>
                      <td className="ea-col-actions">
                        <div className="ea-row-menu-container">
                          <button
                            className="ea-row-menu-btn"
                            onClick={() => toggleRowMenu(acc.id)}
                          >
                            ⋯
                          </button>

                          {rowMenuId === acc.id && (
                            <div className="ea-row-menu">
                              <button className="ea-row-menu-item">
                                Reconnect account
                              </button>
                              <button className="ea-row-menu-item ea-row-menu-danger">
                                Remove account
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {visibleAccounts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="ea-empty-state">
                        No accounts match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right bulk edit panel */}
          <BulkEditPanel
            open={showBulkPanel}
            onClose={() => {
              setShowBulkPanel(false);
              setShowAdvanced(false);
            }}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
          />
        </section>
      </main>
    </div>
  );
}
