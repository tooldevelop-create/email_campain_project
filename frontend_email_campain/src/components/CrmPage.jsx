// src/components/CrmPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/CrmPage.css";

import {
  Search,
  ChevronDown,
  Mail,
  Phone,
  CheckSquare,
  Zap,
  Check,
  User,
  Tag,
} from "lucide-react";

/* ---------------- Left folders ---------------- */

const FOLDERS = [
  {
    key: "inbox",
    label: "Inbox",
    badge: 90,
    children: [
      { key: "done", label: "Done" },
      { key: "upcoming", label: "Upcoming" },
    ],
  },
  {
    key: "opportunities",
    label: "Opportunities",
    children: [
      { key: "opp-campaigns", label: "Campaigns" },
      { key: "opp-lists", label: "Lists" },
    ],
  },
  { key: "all-leads", label: "All Leads" },
  { key: "lists", label: "Lists" }, // heading + dropdown block
  { key: "campaigns", label: "Campaigns" }, // heading + dropdown block
  { key: "salesflows", label: "Salesflows" },
  { key: "website-visitors", label: "Website Visitors" },
  { key: "reports", label: "Reports" },
];

/* ---------------- Lists (left section) ---------------- */

const LIST_ITEMS = [
  { id: 1, name: "Unnamed List" },
  { id: 2, name: "Unnamed List" },
  { id: 3, name: "Unnamed List" },
  { id: 4, name: "Unnamed List" },
  { id: 5, name: "Unnamed List" },
  { id: 6, name: "Unnamed List" },
  { id: 7, name: "Unnamed List" },
  { id: 8, name: "Unnamed List" },
];

/* ---------------- Campaigns (left section) ---------------- */

const CAMPAIGN_ITEMS = [
  { id: 1, name: "Vishnuuu" },
  { id: 2, name: "India Campaign-Selling-Elizabeth India" },
  { id: 3, name: "India Campaign-Selling-Nishant India" },
  { id: 4, name: "India Campaign-Selling-Nishant India" },
  { id: 5, name: "India Campaign-Selling-Elizabeth India" },
  { id: 6, name: "India Campaign-Selling-Nishant India" },
  { id: 7, name: "India Campaign-Selling-Elizabeth India" },
];

/* ---------------- Top tabs ---------------- */

const TABS = [
  { key: "everything", label: "Everything" },
  { key: "emails", label: "Emails" },
  { key: "calls", label: "Calls" },
  { key: "sms", label: "SMS" },
  { key: "tasks", label: "Tasks" },
];

/* ---------------- Mock leads list (with isDone + campaignId) ---------------- */

const MOCK_LEADS = [
  {
    id: 1,
    from: "bbrewer@green-innovate.com",
    subject: "Re: Interested in Purchasing Plastic ...",
    preview: "Sophia, We sell all of those grades exce...",
    date: "Apr 4",
    statusColor: "#22c55e",
    type: "interested",
    isDone: false,
    campaignId: 2,
  },
  {
    id: 2,
    from: "jkearny@blackrockplastics.com",
    subject: "RE: Interested in Purchasing Plastic ...",
    preview: "Thanks Sophia! Will put you on our buye...",
    date: "Apr 4",
    statusColor: "#22c55e",
    type: "interested",
    isDone: false,
    campaignId: 2,
  },
  {
    id: 3,
    from: "kotaiiah@vasantha.com",
    subject: "RE: High Quality Recycled Plastics ...",
    preview: "Dear Sir, Good Morning, Noted your below ...",
    date: "Apr 3",
    statusColor: "#22c55e",
    type: "interested",
    isDone: true,
    campaignId: 3,
  },
  {
    id: 4,
    from: "deepak.bakshi@dblogistics.co.in",
    subject: "Re: High Quality Recycled Plastics ...",
    preview: "Dear Elozabeth, Greetings and Thanks f...",
    date: "Apr 2",
    statusColor: "#22c55e",
    type: "interested",
    isDone: true,
    campaignId: 3,
  },
  {
    id: 5,
    from: "len.keck@westfieldconsultingco.com",
    subject: "NOT Interested in Purchasing Plastic ...",
    preview: "Hi, I retired in 2017 and request that you ...",
    date: "Apr 2",
    statusColor: "#ef4444",
    type: "not-interested",
    isDone: false,
    campaignId: 1,
  },
  {
    id: 6,
    from: "s.gupta@skemasterbatch.com",
    subject: "Re: High Quality Recycled Plastics ...",
    preview: "Hi, We require PP article white grinding. ...",
    date: "Mar 26",
    statusColor: "#22c55e",
    type: "interested",
    isDone: false,
    campaignId: 2,
  },
  // extra mock leads – cycle through campaigns
  ...Array.from({ length: 24 }).map((_, idx) => {
    const id = idx + 7;
    const cid = CAMPAIGN_ITEMS[idx % CAMPAIGN_ITEMS.length].id;
    return {
      id,
      from: `lead${id}@example.com`,
      subject:
        idx % 2 === 0
          ? "Re: High Quality Recycled Plastics ..."
          : "Re: Interested in Purchasing Plastic ...",
      preview:
        idx % 2 === 0
          ? "Thanks for reaching out, we can discuss volumes..."
          : "Please share more details about your requirements...",
      date: idx % 3 === 0 ? "Apr 1" : idx % 3 === 1 ? "Mar 29" : "Mar 27",
      statusColor: idx % 5 === 0 ? "#ef4444" : "#22c55e",
      type: idx % 5 === 0 ? "not-interested" : "interested",
      isDone: idx % 4 === 0,
      campaignId: cid,
    };
  }),
];

/* ---------------- Dropdown data ---------------- */

const STATUS_OPTIONS = [
  { key: "all-leads", label: "All statuses", color: "#e5e7eb" },
  { key: "interested", label: "Interested", color: "#22c55e" },
  { key: "meeting-booked", label: "Meeting booked", color: "#facc15" },
  { key: "meeting-completed", label: "Meeting completed", color: "#38bdf8" },
  { key: "won", label: "Won", color: "#22c55e" },
  { key: "out-of-office", label: "Out of office", color: "#a855f7" },
  { key: "wrong-person", label: "Wrong person", color: "#f97316" },
  { key: "not-interested", label: "Not interested", color: "#ef4444" },
  { key: "lost", label: "Lost", color: "#6b7280" },
];

const SORT_OPTIONS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
];

const USER_OPTIONS = [
  { key: "all", label: "All Users", initials: "All Users" },
  { key: "hk", label: "Harmeet Kohli", initials: "Harmeet Kohli" },
];

export default function CrmPage() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const location = useLocation();

  /* ---------- URL / mode ---------- */
  const [activeTab, setActiveTab] = useState("everything");

  const isArchive = location.pathname === "/crm/archive";
  const isUpcoming = location.pathname === "/crm/upcoming";

  useEffect(() => {
    const urlTab = tab || "everything";
    const valid = TABS.some((t) => t.key === urlTab) ? urlTab : "everything";
    setActiveTab(valid);
  }, [tab]);

  const isEmailTab = activeTab === "emails" || activeTab === "everything";
  const isLockedTab =
    activeTab === "calls" || activeTab === "sms" || activeTab === "tasks";

  /* ---------- state ---------- */
  const [leads, setLeads] = useState(MOCK_LEADS);

  const [activeFolder, setActiveFolder] = useState("inbox");
  const [search, setSearch] = useState("");

  const [activeInboxSection, setActiveInboxSection] = useState("done");
  const [activeOppSub, setActiveOppSub] = useState("opp-campaigns");

  // Lists section (left)
  const [listsOpen, setListsOpen] = useState(true);
  const [listsSearch, setListsSearch] = useState("");
  const [activeListId, setActiveListId] = useState(LIST_ITEMS[0].id);

  // Campaigns section (left)
  const [campaignsOpen, setCampaignsOpen] = useState(true);
  const [campaignsSearch, setCampaignsSearch] = useState("");
  const [activeCampaignId, setActiveCampaignId] = useState(
    CAMPAIGN_ITEMS[0].id
  );

  const [creditsOpen, setCreditsOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [activeStatusKey, setActiveStatusKey] = useState("all-leads");

  const [sortOpen, setSortOpen] = useState(false);
  const [activeSortKey, setActiveSortKey] = useState("newest");

  const [userOpen, setUserOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [activeUserKey, setActiveUserKey] = useState("all");

  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkStatusSearch, setBulkStatusSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [openThreadId, setOpenThreadId] = useState(null);

  const closeAllPopovers = () => {
    setCreditsOpen(false);
    setOrgOpen(false);
    setStatusOpen(false);
    setSortOpen(false);
    setUserOpen(false);
    setBulkStatusOpen(false);
  };

  // force folder+section when archive / upcoming
  useEffect(() => {
    if (isArchive) {
      setActiveFolder("inbox");
      setActiveInboxSection("done");
    } else if (isUpcoming) {
      setActiveFolder("inbox");
      setActiveInboxSection("upcoming");
    }
  }, [isArchive, isUpcoming]);

  // URL → left CRM sidebar active state sync
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/crm/opportunities")) {
      setActiveFolder("opportunities");
    } else if (path.startsWith("/crm/leads")) {
      setActiveFolder("all-leads");
    } else if (path.startsWith("/crm")) {
      setActiveFolder("inbox");
    }
  }, [location.pathname]);

  /* ---------- derived lists ---------- */

  // base (archive / inbox) + campaign filter when "Campaigns" section is active
  const baseLeads = leads
    .filter((lead) => (isArchive ? lead.isDone : !lead.isDone))
    .filter((lead) => {
      if (activeFolder === "campaigns" && activeCampaignId) {
        return lead.campaignId === activeCampaignId;
      }
      return true;
    });

  const filteredLeads = baseLeads.filter(
    (lead) =>
      !search ||
      lead.from.toLowerCase().includes(search.toLowerCase()) ||
      lead.subject.toLowerCase().includes(search.toLowerCase()) ||
      lead.preview.toLowerCase().includes(search.toLowerCase())
  );

  // real Inbox count
  const inboxCount = leads.filter((l) => !l.isDone).length;

  const visibleStatusOptions = STATUS_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(statusSearch.toLowerCase())
  );

  const visibleUserOptions = USER_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(userSearch.toLowerCase())
  );

  const activeSort =
    SORT_OPTIONS.find((opt) => opt.key === activeSortKey) || SORT_OPTIONS[0];

  const activeUser =
    USER_OPTIONS.find((opt) => opt.key === activeUserKey) || USER_OPTIONS[0];

  const activeStatus =
    STATUS_OPTIONS.find((opt) => opt.key === activeStatusKey) ||
    STATUS_OPTIONS[0];

  const bulkVisibleStatusOptions = STATUS_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(bulkStatusSearch.toLowerCase())
  );

  const inboxOpen = activeFolder === "inbox";
  const oppsOpen = activeFolder === "opportunities";

  const allSelected =
    filteredLeads.length > 0 && selectedIds.length === filteredLeads.length;
  const anySelected = selectedIds.length > 0;

  // LEFT Lists derived
  const visibleLists = LIST_ITEMS.filter((l) =>
    l.name.toLowerCase().includes(listsSearch.toLowerCase())
  );

  // LEFT Campaigns derived
  const visibleCampaigns = CAMPAIGN_ITEMS.filter((c) =>
    c.name.toLowerCase().includes(campaignsSearch.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleLeadDone = (id) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, isDone: !lead.isDone } : lead
      )
    );
  };

  const handleBulkDone = () => {
    setLeads((prev) =>
      prev.map((lead) =>
        selectedIds.includes(lead.id)
          ? { ...lead, isDone: !isArchive }
          : lead
      )
    );
    setSelectedIds([]);
  };

  const handleBulkAssign = () => {
    setAssignModalOpen(true);
  };

  const handleBulkStatusChange = (statusKey) => {
    console.log("Change status to", statusKey, "for", selectedIds);
    setBulkStatusOpen(false);
  };

  const handleModalCancel = () => {
    setAssignModalOpen(false);
  };

  const handleModalDelete = () => {
    console.log("Delete / block leads:", selectedIds);
    setAssignModalOpen(false);
  };

  const handleRowClick = (id) => {
    setOpenThreadId((prev) => (prev === id ? null : (prev = id)));
  };

  const bulkPrimaryLabel = isArchive ? "Move to inbox" : "Done";

  /* 👉 NEW: control where email list is visible 👈 */
  const showEmailList =
    !isUpcoming &&
    isEmailTab &&
    (activeFolder === "inbox" ||
      activeFolder === "lists" ||
      activeFolder === "campaigns" ||
      activeFolder === "" ||
      activeFolder === "all-leads");

  const isOtherFolder =
    activeFolder === "salesflows" ||
    activeFolder === "website-visitors" ||
    activeFolder === "reports";

  /* =================================================================== */

  return (
    <div className="ss-app">
      {/* Sidebar with real inbox count */}
      <Sidebar inboxCount={inboxCount} />

      <main className="ss-main crm-main" onClick={closeAllPopovers}>
        {/* ================= TOP BAR ================= */}
        <div className="crm-topbar">
          <div className="crm-topbar-left">
            <span className="crm-topbar-title">CRM</span>

            <button className="crm-topbar-square-btn" aria-label="CRM settings">
              <span className="crm-topbar-square-inner" />
            </button>
          </div>

          <div className="crm-topbar-right">
            {/* Credits */}
            <div
              className="crm-coins-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="crm-coins-btn"
                onClick={() => setCreditsOpen((o) => !o)}
              >
                <Zap size={16} />
                <span>286</span>
                <ChevronDown size={14} />
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

            <button className="crm-primary-btn">Get All Features</button>

            {/* My Organization dropdown */}
            <div
              className="crm-org-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="crm-outline-btn"
                onClick={() => setOrgOpen((o) => !o)}
              >
                My Organization...
                <ChevronDown size={14} />
              </button>

              {orgOpen && (
                <div className="uni-org-dropdown">
                  <div className="uni-org-search">
                    <input placeholder="Search" />
                  </div>

                  <button
                    className="uni-org-item uni-org-item-active"
                    onClick={() => {
                      closeAllPopovers();
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
        </div>

        {/* ================= TABS + SEARCH (hide on Upcoming) ================= */}
        {!isUpcoming && (
          <div className="crm-tabs-main-row">
            <div className="crm-tab-strip">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={
                    "crm-tab-main-btn" +
                    (activeTab === t.key ? " crm-tab-main-btn-active" : "")
                  }
                  onClick={() => {
                    const path =
                      t.key === "everything" ? "/crm" : `/crm/${t.key}`;
                    navigate(path);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="crm-top-search">
              <Search size={16} />
              <input
                className="crm-top-search-input"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ================= FILTERS ROW (hide on Upcoming) ================= */}
        {!isUpcoming && (
          <div className="crm-filters-row">
            {/* STATUS FILTER */}
            <div
              className="crm-filter-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="crm-filter-btn"
                onClick={() => {
                  setStatusOpen((o) => !o);
                  setSortOpen(false);
                  setUserOpen(false);
                  setBulkStatusOpen(false);
                }}
              >
                <Zap size={16} className="crm-filter-icon" />
                <span>{activeStatus.label}</span>
                <ChevronDown size={14} />
              </button>

              {statusOpen && (
                <div className="crm-filter-popover">
                  <div className="crm-filter-popover-search">
                    <Search size={14} />
                    <input
                      placeholder="Search statuses"
                      value={statusSearch}
                      onChange={(e) => setStatusSearch(e.target.value)}
                    />
                  </div>
                  <div className="crm-filter-options">
                    {visibleStatusOptions.map((opt) => (
                      <button
                        key={opt.key}
                        className={
                          "crm-filter-option" +
                          (activeStatusKey === opt.key
                            ? " crm-filter-option-active"
                            : "")
                        }
                        onClick={() => {
                          setActiveStatusKey(opt.key);
                          setStatusOpen(false);
                        }}
                      >
                        <span
                          className="crm-status-dot"
                          style={{ backgroundColor: opt.color }}
                        />
                        <span className="crm-filter-option-label">
                          {opt.label}
                        </span>
                        {activeStatusKey === opt.key && (
                          <Check size={14} className="crm-filter-check" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE FILTERS (Sort + Users) */}
            <div className="crm-filters-right">
              {/* SORT */}
              <div
                className="crm-filter-wrapper"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="crm-filter-btn"
                  onClick={() => {
                    setSortOpen((o) => !o);
                    setStatusOpen(false);
                    setUserOpen(false);
                    setBulkStatusOpen(false);
                  }}
                >
                  <span>{activeSort.label}</span>
                  <ChevronDown size={14} />
                </button>

                {sortOpen && (
                  <div className="crm-filter-popover">
                    <div className="crm-filter-options">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          className={
                            "crm-filter-option" +
                            (activeSortKey === opt.key
                              ? " crm-filter-option-active"
                              : "")
                          }
                          onClick={() => {
                            setActiveSortKey(opt.key);
                            setSortOpen(false);
                          }}
                        >
                          <span className="crm-filter-option-label">
                            {opt.label}
                          </span>
                          {activeSortKey === opt.key && (
                            <Check size={14} className="crm-filter-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* USERS */}
              <div
                className="crm-filter-wrapper"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="crm-filter-btn"
                  onClick={() => {
                    setUserOpen((o) => !o);
                    setStatusOpen(false);
                    setSortOpen(false);
                    setBulkStatusOpen(false);
                  }}
                >
                  <span>{activeUser.label}</span>
                  <ChevronDown size={14} />
                </button>

                {userOpen && (
                  <div className="crm-filter-popover">
                    <div className="crm-filter-popover-search">
                      <Search size={14} />
                      <input
                        placeholder="Search users"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                    <div className="crm-filter-options">
                      {visibleUserOptions.map((opt) => (
                        <button
                          key={opt.key}
                          className={
                            "crm-filter-option" +
                            (activeUserKey === opt.key
                              ? " crm-filter-option-active"
                              : "")
                          }
                          onClick={() => {
                            setActiveUserKey(opt.key);
                            setUserOpen(false);
                          }}
                        >
                          <span className="crm-filter-option-label">
                            {opt.label}
                          </span>
                          {activeUserKey === opt.key && (
                            <Check size={14} className="crm-filter-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= MAIN BODY ================= */}
        <section className="crm-body">
          {/* LEFT NAV */}
          <aside className="crm-sidebar">
            <ul className="crm-folder-list">
              {FOLDERS.map((f) => {
                // Inbox
                if (f.key === "inbox") {
                  return (
                    <li key="inbox">
                      <button
                        className={
                          "crm-folder-item" +
                          (activeFolder === "inbox"
                            ? " crm-folder-item-active"
                            : "")
                        }
                        onClick={() => {
                          setActiveFolder("inbox");
                          setActiveInboxSection("done");
                          navigate("/crm");
                        }}
                      >
                        <span>{f.label}</span>
                        <div className="crm-folder-right">
                          {inboxCount > 0 && (
                            <span className="crm-folder-badge">
                              {inboxCount}
                            </span>
                          )}
                          <ChevronDown
                            size={14}
                            className={
                              "crm-inbox-chevron" +
                              (inboxOpen ? " crm-inbox-chevron-open" : "")
                            }
                          />
                        </div>
                      </button>

                      {inboxOpen && (
                        <ul className="crm-inbox-sublist">
                          {f.children.map((child) => (
                            <li key={child.key}>
                              <button
                                className={
                                  "crm-inbox-subitem" +
                                  (activeInboxSection === child.key
                                    ? " crm-inbox-subitem-active"
                                    : "")
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveFolder("inbox");
                                  setActiveInboxSection(child.key);

                                  if (child.key === "done") {
                                    navigate("/crm/archive");
                                  } else if (child.key === "upcoming") {
                                    navigate("/crm/upcoming");
                                  } else {
                                    navigate("/crm");
                                  }
                                }}
                              >
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Opportunities
                if (f.key === "opportunities") {
                  return (
                    <li key="opportunities">
                      <button
                        className={
                          "crm-folder-item" +
                          (activeFolder === "opportunities"
                            ? " crm-folder-item-active"
                            : "")
                        }
                        onClick={() => {
                          setActiveFolder((prev) =>
                            prev === "opportunities" ? "" : "opportunities"
                          );
                          navigate("/crm/opportunities");
                        }}
                      >
                        <span>{f.label}</span>
                        <ChevronDown
                          size={14}
                          className={
                            "crm-inbox-chevron" +
                            (oppsOpen ? " crm-inbox-chevron-open" : "")
                          }
                        />
                      </button>

                      {oppsOpen && (
                        <ul className="crm-inbox-sublist">
                          {f.children.map((child) => (
                            <li key={child.key}>
                              <button
                                className={
                                  "crm-inbox-subitem" +
                                  (activeOppSub === child.key
                                    ? " crm-inbox-subitem-active"
                                    : "")
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveFolder("opportunities");
                                  setActiveOppSub(child.key);
                                  navigate("/crm/opportunities");
                                }}
                              >
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                // All Leads -> /crm/leads
                if (f.key === "all-leads") {
                  return (
                    <li key={f.key}>
                      <button
                        className={
                          "crm-folder-item" +
                          (activeFolder === "all-leads"
                            ? " crm-folder-item-active"
                            : "")
                        }
                        onClick={() => {
                          setActiveFolder("all-leads");
                          navigate("/crm/leads");
                        }}
                      >
                        <span>{f.label}</span>
                      </button>
                    </li>
                  );
                }

                // LISTS BLOCK (dropdown)
                if (f.key === "lists") {
                  return (
                    <li key="lists" className="crm-lists-block">
                      {/* Header row with caret */}
                      <button
                        className={
                          "crm-folder-item crm-lists-header" +
                          (activeFolder === "lists"
                            ? " crm-folder-item-active"
                            : "")
                        }
                        onClick={() => {
                          setActiveFolder("lists");
                          setListsOpen((o) => !o);
                        }}
                      >
                        <span>{f.label}</span>
                        <ChevronDown
                          size={14}
                          className={
                            "crm-inbox-chevron" +
                            (listsOpen ? " crm-inbox-chevron-open" : "")
                          }
                        />
                      </button>

                      {listsOpen && (
                        <div className="crm-lists-panel">
                          {/* small search box */}
                          <div className="crm-lists-search">
                            <Search size={14} />
                            <input
                              placeholder="Search"
                              value={listsSearch}
                              onChange={(e) => setListsSearch(e.target.value)}
                            />
                          </div>

                          {/* list items */}
                          <ul className="crm-inbox-sublist crm-lists-sublist">
                            {visibleLists.map((item) => (
                              <li key={item.id}>
                                <button
                                  className={
                                    "crm-inbox-subitem crm-list-item" +
                                    (activeListId === item.id
                                      ? " crm-inbox-subitem-active crm-list-item-active"
                                      : "")
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveFolder("lists");
                                    setActiveListId(item.id);
                                    navigate(`/crm/unnamed-list/${item.id}`);
                                  }}
                                >
                                  {item.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                }

                // CAMPAIGNS BLOCK (dropdown + search + list)
                if (f.key === "campaigns") {
                  return (
                    <li key="campaigns" className="crm-lists-block">
                      {/* Header row with caret */}
                      <button
                        className={
                          "crm-folder-item crm-lists-header" +
                          (activeFolder === "campaigns"
                            ? " crm-folder-item-active"
                            : "")
                        }
                        onClick={() => {
                          setActiveFolder("campaigns");
                          setCampaignsOpen((o) => !o);
                        }}
                      >
                        <span>{f.label}</span>
                        <ChevronDown
                          size={14}
                          className={
                            "crm-inbox-chevron" +
                            (campaignsOpen ? " crm-inbox-chevron-open" : "")
                          }
                        />
                      </button>

                      {campaignsOpen && (
                        <div className="crm-lists-panel">
                          {/* small search box */}
                          <div className="crm-lists-search">
                            <Search size={14} />
                            <input
                              placeholder="Search"
                              value={campaignsSearch}
                              onChange={(e) =>
                                setCampaignsSearch(e.target.value)
                              }
                            />
                          </div>

                          {/* campaigns items */}
                          <ul className="crm-inbox-sublist crm-lists-sublist">
                            {visibleCampaigns.map((item) => (
                              <li key={item.id}>
                                <button
                                  className={
                                    "crm-inbox-subitem crm-list-item" +
                                    (activeCampaignId === item.id
                                      ? " crm-inbox-subitem-active crm-list-item-active"
                                      : "")
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveFolder("campaigns");
                                    setActiveCampaignId(item.id);
                                    // future: URL filter if needed
                                  }}
                                >
                                  {item.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                }

                // other folders (Salesflows, Website visitors, Reports)
                return (
                  <li key={f.key}>
                    <button
                      className={
                        "crm-folder-item" +
                        (activeFolder === f.key
                          ? " crm-folder-item-active"
                          : "")
                      }
                      onClick={() => setActiveFolder(f.key)}
                    >
                      <span>{f.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* RIGHT PANEL */}
          <div className="crm-main-panel">
            {/* ---------- UPCOMING EMPTY STATE (special) ---------- */}
            {isUpcoming ? (
              <div className="crm-upcoming-empty">
                <div className="crm-upcoming-inner">
                  <div className="crm-upcoming-illustration" />
                  <h2 className="crm-upcoming-title">All done for now!</h2>
                  <p className="crm-upcoming-subtitle">
                    Enjoy your empty inbox.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* ---------- EMAIL LIST (Everything + Emails) ---------- */}
                {showEmailList && (
                  <>
                    <div className="crm-type-row">
                      <input
                        type="checkbox"
                        className="crm-checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        onClick={(e) => e.stopPropagation()}
                      />

                      {anySelected && (
                        <div className="crm-bulk-actions">
                          <button
                            type="button"
                            className="crm-bulk-pill"
                            onClick={handleBulkDone}
                          >
                            <CheckSquare
                              size={16}
                              color="#f9fafb"
                              strokeWidth={2.1}
                            />
                            <span>{bulkPrimaryLabel}</span>
                          </button>

                          <button
                            type="button"
                            className="crm-bulk-icon-btn"
                            onClick={handleBulkAssign}
                            title="Assign owner"
                          >
                            <User size={20} color="#f9fafb" strokeWidth={2.1} />
                          </button>

                          <div
                            className="crm-filter-wrapper"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="crm-bulk-icon-btn"
                              onClick={() => {
                                setBulkStatusOpen((o) => !o);
                                setStatusOpen(false);
                                setSortOpen(false);
                                setUserOpen(false);
                              }}
                              title="Change status"
                            >
                              <Tag
                                size={20}
                                color="#f9fafb"
                                strokeWidth={2.1}
                              />
                            </button>

                            {bulkStatusOpen && (
                              <div className="crm-filter-popover">
                                <div className="crm-filter-popover-search">
                                  <Search size={14} />
                                  <input
                                    placeholder="Search statuses"
                                    value={bulkStatusSearch}
                                    onChange={(e) =>
                                      setBulkStatusSearch(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="crm-filter-options">
                                  {bulkVisibleStatusOptions.map((opt) => (
                                    <button
                                      key={opt.key}
                                      className="crm-filter-option"
                                      onClick={() =>
                                        handleBulkStatusChange(opt.key)
                                      }
                                    >
                                      <span
                                        className="crm-status-dot"
                                        style={{ backgroundColor: opt.color }}
                                      />
                                      <span className="crm-filter-option-label">
                                        {opt.label}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="crm-table">
                      {filteredLeads.map((lead) => (
                        <React.Fragment key={lead.id}>
                          {/* main list row */}
                          <div
                            className={
                              "crm-row" +
                              (openThreadId === lead.id ? " crm-row-open" : "")
                            }
                            onMouseEnter={() => setHoveredId(lead.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => handleRowClick(lead.id)}
                          >
                            <div className="crm-row-left">
                              <input
                                type="checkbox"
                                className="crm-checkbox"
                                checked={selectedIds.includes(lead.id)}
                                onChange={() => toggleRow(lead.id)}
                                onClick={(e) => e.stopPropagation()}
                              />

                              <div className="crm-avatar">
                                <Mail size={16} />
                              </div>

                              <div className="crm-row-main">
                                <div className="crm-row-topline">
                                  <span className="crm-row-from">
                                    {lead.from}
                                  </span>

                                  <span className="crm-row-subject-chip">
                                    <Zap
                                      size={14}
                                      className="crm-row-status-icon"
                                      style={{ color: lead.statusColor }}
                                    />
                                    <span
                                      className="crm-row-subject-text"
                                      style={{ color: lead.statusColor }}
                                    >
                                      {lead.subject}
                                    </span>
                                  </span>

                                  <span className="crm-row-preview">
                                    {lead.preview}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="crm-row-right">
                              {hoveredId === lead.id && (
                                <div className="crm-row-actions">
                                  {/* Done / Move to inbox toggle */}
                                  <button
                                    className="crm-row-action-btn"
                                    title={
                                      isArchive
                                        ? "Move to inbox"
                                        : "Mark as done"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLeadDone(lead.id);
                                    }}
                                  >
                                    <CheckSquare size={16} />
                                  </button>

                                  {lead.type !== "not-interested" && (
                                    <>
                                      <button
                                        className="crm-row-action-btn"
                                        title="Reply"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Mail size={16} />
                                      </button>
                                      <button
                                        className="crm-row-action-btn"
                                        title="Call"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Phone size={16} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}

                              <span className="crm-row-date">{lead.date}</span>
                            </div>
                          </div>

                          {/* expanded mail thread */}
                          {openThreadId === lead.id && (
                            <div className="crm-thread">
                              {/* top quick actions */}
                              <div className="crm-thread-toolbar">
                                <button className="crm-thread-btn">
                                  <Mail size={14} />
                                  <span>Reply</span>
                                </button>
                                <button className="crm-thread-btn">
                                  <Phone size={14} />
                                  <span>Call</span>
                                </button>
                                <button
                                  className="crm-thread-btn"
                                  onClick={() => toggleLeadDone(lead.id)}
                                >
                                  <CheckSquare size={14} />
                                  <span>{bulkPrimaryLabel}</span>
                                </button>
                              </div>

                              {/* AI Reply card */}
                              <div className="crm-thread-ai-card">
                                <div className="crm-thread-ai-icon">
                                  <Zap size={16} />
                                </div>
                                <h3 className="crm-thread-ai-title">
                                  Create AI Reply Agent
                                </h3>
                                <p className="crm-thread-ai-subtitle">
                                  Automate your email responses with
                                  AI-powered reply suggestions.
                                </p>
                                <div className="crm-thread-ai-actions">
                                  <button className="crm-thread-ai-primary">
                                    + Create Now
                                  </button>
                                  <button className="crm-thread-ai-secondary">
                                    View Demo
                                  </button>
                                </div>
                                <button className="crm-thread-ai-later">
                                  Remind me later
                                </button>
                              </div>

                              {/* Email card 1 */}
                              <div className="crm-thread-email-card">
                                <div className="crm-thread-email-header">
                                  <div>
                                    <div className="crm-thread-email-subject">
                                      Re: Interested in Purchasing Plastic
                                      Materials
                                    </div>
                                    <div className="crm-thread-email-meta">
                                      From: {lead.from}
                                      <br />
                                      To: Sophia Hughes &lt;
                                      sophia.h@ecoplastics.in&gt;
                                    </div>
                                  </div>
                                  <div className="crm-thread-email-date">
                                    Friday, Apr 4, 2025 at 9:28 pm
                                  </div>
                                </div>

                                <div className="crm-thread-email-body">
                                  <p>Sophia,</p>
                                  <p>
                                    We sell all of those grades except the
                                    barrels in bales. We have ongoing m/c LDPE
                                    rolls we export 3 times per week. We have
                                    stretch rolls monthly. All of our material
                                    is post industrial.
                                  </p>
                                  <p>
                                    We have ongoing LD purge. What price range
                                    do you have for mixed color LD purge?
                                  </p>
                                  <p>- Brian Brewer</p>
                                  <p className="crm-thread-email-footer">
                                    Brian Brewer
                                    <br />
                                    P – 216-341-4000 x 408
                                    <br />
                                    C – 216-260-1112
                                  </p>
                                </div>
                              </div>

                              {/* Email card 2 */}
                              <div className="crm-thread-email-card">
                                <div className="crm-thread-email-header">
                                  <div>
                                    <div className="crm-thread-email-subject">
                                      Interested in Purchasing Plastic Materials
                                    </div>
                                    <div className="crm-thread-email-meta">
                                      From: Sophia Hughes &lt;
                                      sophia.h@ecoplastics.in&gt;
                                      <br />
                                      To: {lead.from}
                                    </div>
                                  </div>
                                  <div className="crm-thread-email-date">
                                    04/04/2025 11:46 AM
                                  </div>
                                </div>

                                <div className="crm-thread-email-body">
                                  <p>Hi Brian,</p>
                                  <p>Hope you are well!</p>
                                  <p>
                                    We are actively purchasing various types of
                                    plastic materials for recycling from
                                    suppliers across the USA. Below is the list
                                    of materials we are currently sourcing:
                                  </p>
                                  <ul>
                                    <li>LLDPE Grade A</li>
                                    <li>LDPE Grade A</li>
                                    <li>LDPE/LLDPE Natural Purge</li>
                                    <li>LLDPE/LDPE Rolls</li>
                                    <li>LLDPE Shrink Wrap Clean Scrap</li>
                                    <li>HDPE Barrels in Bales</li>
                                    <li>HDPE Barrel Regrind</li>
                                  </ul>
                                  <p>
                                    If you deal in any of these materials, we
                                    would love to discuss further. Kindly share
                                    the details, including the available
                                    quantities and specifications.
                                  </p>
                                  <p>Looking forward to hearing from you.</p>
                                  <p>
                                    Best regards,
                                    <br />
                                    Sophia
                                    <br />
                                    Eco Plastics
                                  </p>
                                  <p className="crm-thread-email-ps">
                                    PS: If this is not of interest to you,
                                    please feel free to let me know, and I’ll
                                    ensure you’re removed from the list.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}

                      {filteredLeads.length === 0 && (
                        <div className="crm-empty-state">
                          No conversations found.
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ---------- LOCKED / SUBSCRIBE SCREEN (Calls, SMS, Tasks) ---------- */}
                {isLockedTab && (
                  <div className="crm-locked-wrapper">
                    <div className="crm-locked-card">
                      <h1 className="crm-locked-title">Almost There!</h1>
                      <p className="crm-locked-text">
                        Subscribe to the Hyper CRM plan to use this feature.
                      </p>
                      <button className="crm-locked-btn">Subscribe</button>
                    </div>
                  </div>
                )}

                {/* ---------- OTHER FOLDERS (Salesflows / Website Visitors / Reports) ---------- */}
                {!showEmailList && !isLockedTab && isOtherFolder && (
                  <div className="crm-locked-wrapper">
                    <div className="crm-locked-card">
                      <h1 className="crm-locked-title">Coming soon</h1>
                      <p className="crm-locked-text">
                        This section is not available yet.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ================= CENTER MODAL ================= */}
        {assignModalOpen && (
          <div className="crm-modal-overlay" onClick={handleModalCancel}>
            <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="crm-modal-header">
                <span className="crm-modal-title">Delete / Block lead</span>
              </div>

              <div className="crm-modal-body">
                <label className="crm-modal-row">
                  <input type="checkbox" />
                  <div className="crm-modal-text">
                    <span className="crm-modal-main">
                      Delete all leads from the same company
                    </span>
                    <span className="crm-modal-sub">(email domain)</span>
                  </div>
                </label>

                <label className="crm-modal-row">
                  <input type="checkbox" defaultChecked />
                  <div className="crm-modal-text">
                    <span className="crm-modal-main">
                      Delete from all campaign
                    </span>
                  </div>
                </label>

                <label className="crm-modal-row">
                  <input type="checkbox" defaultChecked />
                  <div className="crm-modal-text">
                    <span className="crm-modal-main">
                      Delete from all list
                    </span>
                  </div>
                </label>

                <label className="crm-modal-row">
                  <input type="checkbox" />
                  <div className="crm-modal-text">
                    <span className="crm-modal-main">
                      Add email to blocklist
                    </span>
                  </div>
                </label>
              </div>

              <div className="crm-modal-footer">
                <button
                  type="button"
                  className="crm-modal-btn crm-modal-btn-cancel"
                  onClick={handleModalCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="crm-modal-btn crm-modal-btn-delete"
                  onClick={handleModalDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
