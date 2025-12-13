// src/components/UniboxPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/UniboxPage.css";

import {
  Bolt,
  Inbox,
  CircleDot,
  Clock3,
  CalendarClock,
  Send,
} from "lucide-react";

// LEFT STATUS ITEMS (main list)
const STATUS_ITEMS = [
  { key: "lead", label: "Lead", color: "#22c55e" },
  { key: "interested", label: "Interested", color: "#eab308" },
  { key: "meeting-booked", label: "Meeting booked", color: "#6366f1" },
  { key: "meeting-completed", label: "Meeting completed", color: "#38bdf8" },
  { key: "won", label: "Won", color: "#22c55e" },
];

// EXTRA LABELS (More panel / status-more sublist)
const MORE_STATUS_ITEMS = [
  { key: "ooo", label: "Out of office" },
  { key: "wrong-person", label: "Wrong person" },
  { key: "not-interested", label: "Not interested" },
  { key: "lost", label: "Lost" },
];

// All Campaigns – sample data
const SAMPLE_CAMPAIGNS = [
  "Vishnuuu",
  "India Campaign-Selling-Elizabeth India",
  "India Campaign-Selling-Nishant India",
  "India Campaign-Selling-Nishant India 2",
];

// All Inboxes – sample data
const SAMPLE_INBOXES = [
  "akriti@ecoplastics.in",
  "elizabeth.a@ecoplastics.in",
  "nishant.j@ecoplastics.in",
  "sophia.h@ecoplastics.in",
  "vishnu@ecoplastics.in",
];

// EMAILS
const SAMPLE_EMAILS = [
  {
    id: 1,
    from: "rahilsheth@shethpolymers.com",
    subject: "Re: High Quality Recycled Plastics Available at Low Cost",
    preview:
      "Hello Please send me your company profile and all different grades you can supply...",
    date: "Apr 7, 2025",
    statusColor: "#22c55e",
  },
  {
    id: 2,
    from: "mailesh@ariespoly.com",
    subject: "Re: High Quality Recycled Plastics Available at Low Cost",
    preview:
      "Dear Sir we don't have any requirements as this moment in time...",
    date: "Apr 7, 2025",
    statusColor: "#ef4444",
  },
];

// LEFT "More" filter items – with REAL icons
const MORE_FILTER_ITEMS = [
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "unread", label: "Unread only", icon: CircleDot },
  { key: "reminders", label: "Reminders only", icon: Clock3 },
  { key: "scheduled", label: "Scheduled emails", icon: CalendarClock },
  { key: "sent", label: "Sent", icon: Send },
];

export default function UniboxPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("primary");

  const [creditsOpen, setCreditsOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [statusMoreOpen, setStatusMoreOpen] = useState(false);

  const [campaignsOpen, setCampaignsOpen] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState("");

  const [inboxesOpen, setInboxesOpen] = useState(false);
  const [inboxSearch, setInboxSearch] = useState("");

  const [moreFilterOpen, setMoreFilterOpen] = useState(false);

  const closeAllPopovers = () => {
    setCreditsOpen(false);
    setOrgOpen(false);

    setStatusDropdownOpen(false);
    setStatusMoreOpen(false);

    setCampaignsOpen(false);
    setInboxesOpen(false);
    setMoreFilterOpen(false);
  };

  const filteredStatusItems = useMemo(() => {
    const q = statusSearch.trim().toLowerCase();
    if (!q) return STATUS_ITEMS;
    return STATUS_ITEMS.filter((s) =>
      s.label.toLowerCase().includes(q)
    );
  }, [statusSearch]);

  const filteredCampaigns = useMemo(() => {
    const q = campaignSearch.trim().toLowerCase();
    if (!q) return SAMPLE_CAMPAIGNS;
    return SAMPLE_CAMPAIGNS.filter((c) => c.toLowerCase().includes(q));
  }, [campaignSearch]);

  const filteredInboxes = useMemo(() => {
    const q = inboxSearch.trim().toLowerCase();
    if (!q) return SAMPLE_INBOXES;
    return SAMPLE_INBOXES.filter((c) => c.toLowerCase().includes(q));
  }, [inboxSearch]);

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main" onClick={closeAllPopovers}>
        {/* ─────────── TOP BAR ─────────── */}
        <header className="ss-topbar">
          <div className="ss-top-left">
            <h1 className="ss-title">Unibox</h1>
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
                <div className="uni-credits-popover">
                  <div className="uni-credits-title">Credits</div>
                  <div className="uni-credits-row">
                    <span>Instantly Credits</span>
                    <span className="uni-credits-count">286 / 100</span>
                  </div>
                  <div className="uni-credits-bar">
                    <div className="uni-credits-bar-fill" />
                  </div>
                  <button className="uni-credits-upgrade-btn">
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
                <div className="uni-org-dropdown">
                  <div className="uni-org-search">
                    <input placeholder="Search" />
                  </div>

                  {/* YAHAN CLICK PE NEW CHAT (COPILOT) PAGE PAR REDIRECT */}
                  <button
                    className="uni-org-item uni-org-item-active"
                    onClick={() => {
                      setOrgOpen(false);
                      navigate("/copilot");
                    }}
                  >
                    My Organization
                  </button>

                  <button className="uni-org-item uni-org-create">
                    + Create Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─────────── BODY ─────────── */}
        <div className="uni-page">
          <div className="uni-inner">
            <div className="uni-layout">
              {/* ========== LEFT COLUMN ========== */}
              <aside className="uni-left">
                {/* Status select */}
                <div
                  className="uni-filter-card uni-filter-card-top"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusDropdownOpen((o) => !o);
                    setStatusMoreOpen(false);
                    setCampaignsOpen(false);
                    setInboxesOpen(false);
                    setMoreFilterOpen(false);
                  }}
                >
                  <span>Status</span>
                  <span className="uni-filter-caret">
                    {statusDropdownOpen ? "▴" : "▾"}
                  </span>
                </div>

                {statusDropdownOpen && (
                  <div
                    className="uni-status-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="uni-status-search">
                      <span className="uni-status-search-icon">🔍</span>
                      <input
                        className="uni-status-search-input"
                        placeholder="Search"
                        value={statusSearch}
                        onChange={(e) => setStatusSearch(e.target.value)}
                      />
                    </div>

                    <div className="uni-status-list">
                      {filteredStatusItems.map((item) => (
                        <button
                          key={item.key}
                          className="uni-status-item"
                          type="button"
                        >
                          <Bolt
                            className="uni-status-icon"
                            style={{ color: item.color }}
                            size={16}
                          />
                          <span className="uni-status-label">
                            {item.label}
                          </span>
                        </button>
                      ))}

                      {/* More row INSIDE Status */}
                      <button
                        type="button"
                        className="uni-status-item uni-status-more-row"
                        onClick={() => setStatusMoreOpen((o) => !o)}
                      >
                        <Bolt
                          className="uni-status-icon"
                          style={{ color: "#f97316" }}
                          size={16}
                        />
                        <span className="uni-status-label">More</span>
                        <span className="uni-status-select-caret">
                          {statusMoreOpen ? "▴" : "▾"}
                        </span>
                      </button>

                      {statusMoreOpen && (
                        <div className="uni-status-more-sublist">
                          {MORE_STATUS_ITEMS.map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              className="uni-status-item"
                            >
                              <Bolt
                                className="uni-status-icon"
                                size={16}
                              />
                              <span className="uni-status-label">
                                {item.label}
                              </span>
                            </button>
                          ))}

                          <button
                            type="button"
                            className="uni-status-item uni-status-create"
                          >
                            <span className="uni-status-icon">➕</span>
                            <span className="uni-status-label">
                              Create new label
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* All Campaigns card */}
                <div
                  className="uni-filter-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCampaignsOpen((o) => !o);
                    setStatusDropdownOpen(false);
                    setStatusMoreOpen(false);
                    setInboxesOpen(false);
                    setMoreFilterOpen(false);
                  }}
                >
                  <span>All Campaigns</span>
                  <span className="uni-filter-caret">
                    {campaignsOpen ? "▴" : "▾"}
                  </span>
                </div>

                {campaignsOpen && (
                  <div
                    className="uni-campaigns-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="uni-dropdown-search">
                      <span className="uni-status-search-icon">🔍</span>
                      <input
                        className="uni-status-search-input"
                        placeholder="Search"
                        value={campaignSearch}
                        onChange={(e) => setCampaignSearch(e.target.value)}
                      />
                    </div>

                    <div className="uni-campaigns-list">
                      {filteredCampaigns.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className="uni-campaign-item"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Inboxes card */}
                <div
                  className="uni-filter-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInboxesOpen((o) => !o);
                    setStatusDropdownOpen(false);
                    setStatusMoreOpen(false);
                    setCampaignsOpen(false);
                    setMoreFilterOpen(false);
                  }}
                >
                  <span>All Inboxes</span>
                  <span className="uni-filter-caret">
                    {inboxesOpen ? "▴" : "▾"}
                  </span>
                </div>

                {inboxesOpen && (
                  <div
                    className="uni-inboxes-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="uni-dropdown-search">
                      <span className="uni-status-search-icon">🔍</span>
                      <input
                        className="uni-status-search-input"
                        placeholder="Search"
                        value={inboxSearch}
                        onChange={(e) => setInboxSearch(e.target.value)}
                      />
                    </div>

                    <div className="uni-inboxes-list">
                      {filteredInboxes.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className="uni-inbox-item"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* More card */}
                <div
                  className="uni-filter-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreFilterOpen((o) => !o);
                    setStatusDropdownOpen(false);
                    setStatusMoreOpen(false);
                    setCampaignsOpen(false);
                    setInboxesOpen(false);
                  }}
                >
                  <span>More</span>
                  <span className="uni-filter-caret">
                    {moreFilterOpen ? "▴" : "▾"}
                  </span>
                </div>

                {moreFilterOpen && (
                  <div
                    className="uni-more-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {MORE_FILTER_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          className="uni-more-item"
                        >
                          <Icon className="uni-more-icon" size={16} />
                          <span className="uni-more-label">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </aside>

              {/* ========== CENTER COLUMN ========== */}
              <section className="uni-center">
                <div className="uni-tabs">
                  <button
                    className={
                      "uni-tab" +
                      (activeTab === "primary" ? " uni-tab-active" : "")
                    }
                    onClick={() => setActiveTab("primary")}
                  >
                    Primary
                  </button>
                  <button
                    className={
                      "uni-tab" +
                      (activeTab === "others" ? " uni-tab-active" : "")
                    }
                    onClick={() => setActiveTab("others")}
                  >
                    Others
                  </button>
                </div>

                <div className="uni-search">
                  <span className="uni-search-icon">🔍</span>
                  <input
                    className="uni-search-input"
                    placeholder="Search mail"
                  />
                </div>

                <div className="uni-email-list">
                  {SAMPLE_EMAILS.map((mail) => (
                    <div key={mail.id} className="uni-email-row">
                      <div className="uni-email-left">
                        <span
                          className="uni-email-status-dot"
                          style={{ backgroundColor: mail.statusColor }}
                        />
                        <input
                          type="checkbox"
                          className="uni-email-checkbox"
                        />
                      </div>

                      <div className="uni-email-main">
                        <div className="uni-email-from">{mail.from}</div>
                        <div className="uni-email-subject">
                          {mail.subject}
                        </div>
                        <div className="uni-email-preview">
                          {mail.preview}
                        </div>
                      </div>

                      <div className="uni-email-date">{mail.date}</div>
                    </div>
                  ))}
                </div>

                <div className="uni-empty-footer">
                  <div className="uni-empty-shadow-ball" />
                  <div className="uni-empty-footer-text">No emails found</div>
                  <button className="uni-load-more-btn">Load more</button>
                </div>
              </section>

              {/* ========== RIGHT COLUMN ========== */}
              <section className="uni-right">
                <div className="uni-qr-card">
                  <div className="uni-qr-box">
                    <div className="uni-qr-inner" />
                  </div>
                  <div className="uni-qr-title">
                    Stay connected. Take Unibox with you anywhere.
                  </div>
                  <p className="uni-qr-text">
                    Scan the QR code with your phone to download the Unibox
                    mobile app.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
