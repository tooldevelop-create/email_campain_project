// src/components/CrmOpportunitiesPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/CrmPage.css";

import { Search, ChevronDown, Zap, Check } from "lucide-react";

/* ---------- Left nav data ---------- */
const FOLDERS = [
  {
    key: "inbox",
    label: "Inbox",
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
  { key: "lists", label: "Lists" }, // yahan ke neeche dropdown dikhayenge
  { key: "campaigns", label: "Campaigns" },
  { key: "salesflows", label: "Salesflows" },
  { key: "website-visitors", label: "Website Visitors" },
  { key: "reports", label: "Reports" },
];

/* ---------- LEFT – Lists items ---------- */
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

/* ---------- KPI cards ---------- */
const OPP_CARDS = [
  { key: "interested", label: "Interested" },
  { key: "meeting-booked", label: "Meeting booked" },
  { key: "meeting-completed", label: "Meeting completed" },
  { key: "won", label: "Won" },
];

/* ---------- Dropdown data ---------- */

// Date range
const DATE_RANGE_OPTIONS = [
  { key: "last7", label: "Last 7 days" },
  { key: "monthToDate", label: "Month to date" },
  { key: "last4weeks", label: "Last 4 weeks" },
  { key: "last3months", label: "Last 3 months" },
  { key: "last6months", label: "Last 6 months" },
  { key: "last12months", label: "Last 12 months" },
  { key: "custom", label: "Custom Range" },
  { key: "alltime", label: "All Time" },
];

// Sort field
const SORT_FIELD_OPTIONS = [
  { key: "closeDate", label: "Close Date" },
  { key: "creationDate", label: "Creation Date" },
  { key: "oppValue", label: "Opportunity Value" },
  { key: "lastUpdated", label: "Last Updated" },
];

// Users
const USER_OPTIONS = [
  { key: "all", label: "All Users", initials: "All" },
  { key: "hk", label: "Harmeet Kohli", initials: "HK" },
];

// Labels (status)
const LABEL_OPTIONS = [
  { key: "interested", label: "Interested" },
  { key: "meetingBooked", label: "Meeting booked" },
  { key: "meetingCompleted", label: "Meeting completed" },
  { key: "won", label: "Won" },
  { key: "wrongPerson", label: "Wrong person" },
  { key: "notInterested", label: "Not interested" },
  { key: "lost", label: "Lost" },
];

/* ---------- Mock campaigns (Vishnuuu group) ---------- */
const CAMPAIGN_GROUPS = [
  {
    owner: "Vishnuuu",
    campaigns: [
      "India Campaign- Selling-Elizabeth India",
      "India Campaign- Selling-Nishant India",
      "India Campaign- Selling-Nishant India",
      "India Campaign- Selling-Elizabeth India",
      "India Camp-Selling- Vishnu India1",
      "India Campaign- Selling-Akriti India",
    ],
  },
];

export default function CrmOpportunitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- left nav state ---------- */
  const [inboxOpen, setInboxOpen] = useState(true);
  const [activeInboxSection, setActiveInboxSection] = useState("done");

  const [oppsOpen, setOppsOpen] = useState(true);
  const [activeOppSub, setActiveOppSub] = useState("opp-campaigns");
  const [campaignsOpen, setCampaignsOpen] = useState(true); // campaigns dropdown

  const [activeFolder, setActiveFolder] = useState("opportunities");

  // Lists block (same as CrmLeads / CrmPage)
  const [listsOpen, setListsOpen] = useState(false);
  const [listsSearch, setListsSearch] = useState("");
  const [activeListId, setActiveListId] = useState(LIST_ITEMS[0].id);

  const visibleLists = useMemo(
    () =>
      LIST_ITEMS.filter((l) =>
        l.name.toLowerCase().includes(listsSearch.toLowerCase())
      ),
    [listsSearch]
  );

  /* ---------- top-right popovers ---------- */
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  /* ---------- filters dropdown state ---------- */
  // 1) Date range
  const [dateOpen, setDateOpen] = useState(false);
  const [dateSearch, setDateSearch] = useState("");
  const [activeDateKey, setActiveDateKey] = useState("last7");

  // 2) Sort (field + direction)
  const [sortOpen, setSortOpen] = useState(false);
  const [sortDir, setSortDir] = useState("desc"); // 'desc' | 'asc'
  const [activeSortFieldKey, setActiveSortFieldKey] = useState("oppValue");

  // 3) Users
  const [userOpen, setUserOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [activeUserKey, setActiveUserKey] = useState("hk");

  // 4) Labels (gear icon)
  const [labelOpen, setLabelOpen] = useState(false);
  const [labelSearch, setLabelSearch] = useState("");
  const [activeLabelKeys, setActiveLabelKeys] = useState(
    LABEL_OPTIONS.map((l) => l.key)
  );

  /* ---------- campaigns state ---------- */
  const [campaignSearch, setCampaignSearch] = useState("");
  const [activeCampaign, setActiveCampaign] = useState(null); // { owner, name }

  const closeAllPopovers = () => {
    setCreditsOpen(false);
    setOrgOpen(false);
    setDateOpen(false);
    setSortOpen(false);
    setUserOpen(false);
    setLabelOpen(false);
  };

  /* ---------- URL -> campaign state sync ---------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("campaignId");

    if (!id || id === "all-campaigns") {
      setActiveCampaign(null);
      return;
    }

    let matchedOwner = null;
    let matchedName = null;

    CAMPAIGN_GROUPS.forEach((group) => {
      group.campaigns.forEach((c) => {
        if (encodeURIComponent(c) === id || c === id) {
          matchedOwner = group.owner;
          matchedName = c;
        }
      });
    });

    if (matchedName) {
      setActiveCampaign({ owner: matchedOwner, name: matchedName });
    } else {
      setActiveCampaign(null);
    }
  }, [location.search]);

  /* ---------- derived ---------- */

  const activeDate =
    DATE_RANGE_OPTIONS.find((o) => o.key === activeDateKey) ||
    DATE_RANGE_OPTIONS[0];

  const activeSortField =
    SORT_FIELD_OPTIONS.find((o) => o.key === activeSortFieldKey) ||
    SORT_FIELD_OPTIONS[0];

  const activeUser =
    USER_OPTIONS.find((o) => o.key === activeUserKey) || USER_OPTIONS[0];

  const visibleDateOptions = DATE_RANGE_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(dateSearch.toLowerCase())
  );

  const visibleUserOptions = USER_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(userSearch.toLowerCase())
  );

  const visibleLabelOptions = LABEL_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(labelSearch.toLowerCase())
  );

  const toggleLabelKey = (key) => {
    setActiveLabelKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // campaigns search + filtered list
  const filteredCampaignGroups = useMemo(() => {
    const q = campaignSearch.toLowerCase();
    return CAMPAIGN_GROUPS.map((g) => ({
      ...g,
      campaigns: g.campaigns.filter((c) => c.toLowerCase().includes(q)),
    })).filter((g) => g.campaigns.length > 0);
  }, [campaignSearch]);

  /* ========================================================= */

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main crm-main" onClick={closeAllPopovers}>
        {/* ---------- TOP BAR ---------- */}
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

            {/* My Organization */}
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

        {/* ---------- MAIN BODY ---------- */}
        <section className="crm-body">
          {/* ==== LEFT NAV ==== */}
          <aside className="crm-sidebar">
            <ul className="crm-folder-list">
              {FOLDERS.map((f) => {
                // INBOX (Done / Upcoming)
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
                          setInboxOpen((o) => !o);
                        }}
                      >
                        <span>{f.label}</span>
                        <div className="crm-folder-right">
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
                                  setInboxOpen(true);
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

                // OPPORTUNITIES + sub menu + campaigns list
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
                          setActiveFolder("opportunities");
                          setOppsOpen((o) => !o);
                          navigate(
                            "/crm/opportunities?campaignId=all-campaigns"
                          );
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
                                  setOppsOpen(true);
                                  setActiveOppSub(child.key);

                                  if (child.key === "opp-campaigns") {
                                    setCampaignsOpen((prev) => !prev);
                                    setActiveCampaign(null);
                                    navigate(
                                      "/crm/opportunities?campaignId=all-campaigns"
                                    );
                                  } else {
                                    setCampaignsOpen(false);
                                    navigate("/crm/opportunities");
                                  }
                                }}
                              >
                                {child.label}
                              </button>

                              {/* Campaigns list – only when Campaigns is active & open */}
                              {child.key === "opp-campaigns" &&
                                activeOppSub === "opp-campaigns" &&
                                campaignsOpen && (
                                  <div className="crm-opp-camp-embed">
                                    <div className="crm-opp-camp-search">
                                      <Search
                                        size={14}
                                        className="crm-opp-camp-search-icon"
                                      />
                                      <input
                                        className="crm-opp-camp-search-input"
                                        placeholder="Search"
                                        value={campaignSearch}
                                        onChange={(e) =>
                                          setCampaignSearch(e.target.value)
                                        }
                                      />
                                    </div>

                                    <div className="crm-opp-camp-scroll">
                                      {filteredCampaignGroups.map((group) => (
                                        <div
                                          key={group.owner}
                                          className="crm-opp-camp-group"
                                        >
                                          <div className="crm-opp-camp-owner">
                                            {group.owner}
                                          </div>
                                          <div className="crm-opp-camp-list">
                                            {group.campaigns.map(
                                              (name, idx) => {
                                                const isActive =
                                                  activeCampaign &&
                                                  activeCampaign.name ===
                                                    name &&
                                                  activeCampaign.owner ===
                                                    group.owner;
                                                return (
                                                  <button
                                                    key={idx}
                                                    type="button"
                                                    className={
                                                      "crm-opp-camp-item" +
                                                      (isActive
                                                        ? " crm-opp-camp-item-active"
                                                        : "")
                                                    }
                                                    onClick={() => {
                                                      setActiveCampaign({
                                                        owner: group.owner,
                                                        name,
                                                      });
                                                      navigate(
                                                        `/crm/opportunities?campaignId=${encodeURIComponent(
                                                          name
                                                        )}`
                                                      );
                                                    }}
                                                  >
                                                    {name}
                                                  </button>
                                                );
                                              }
                                            )}
                                          </div>
                                        </div>
                                      ))}

                                      {filteredCampaignGroups.length === 0 && (
                                        <div className="crm-opp-camp-empty">
                                          No campaigns found.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                // SPECIAL: All Leads -> /crm/leads
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

                // SPECIAL: Lists block – dropdown with search + items
                if (f.key === "lists") {
                  return (
                    <li key="lists" className="crm-lists-block">
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
                          <div className="crm-lists-search">
                            <Search size={14} />
                            <input
                              placeholder="Search"
                              value={listsSearch}
                              onChange={(e) =>
                                setListsSearch(e.target.value)
                              }
                            />
                          </div>

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
                                  onClick={() => {
                                    setActiveFolder("lists");
                                    setActiveListId(item.id);
                                    // future: yahan se opportunities ko filter kar sakte ho
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

                // other folders (Campaigns, Salesflows, ...)
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

          {/* ==== RIGHT: Opportunities content ==== */}
          {/* key => campaign change pe component remount ho jaye (screen refresh feel) */}
          <div
            key={activeCampaign ? activeCampaign.name : "all-campaigns"}
            className="crm-opp-main"
          >
            {/* header numbers */}
            <div className="crm-opp-header">
              <div>
                <strong>0</strong> opportunities
              </div>
              <div>
                <strong>Total:</strong> $0
              </div>
            </div>

            {/* search + filters row */}
            <div className="crm-opp-search-row">
              <div className="crm-top-search crm-opp-search">
                <Search size={16} />
                <input
                  className="crm-top-search-input"
                  placeholder="Search..."
                />
              </div>

              <div className="crm-opp-filters-right">
                {/* 1) Date range */}
                <div
                  className="crm-filter-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="crm-filter-btn"
                    onClick={() => {
                      setDateOpen((o) => !o);
                      setSortOpen(false);
                      setUserOpen(false);
                      setLabelOpen(false);
                    }}
                  >
                    {activeDate.label} <ChevronDown size={14} />
                  </button>

                  {dateOpen && (
                    <div className="crm-dd crm-dd-wide">
                      <div className="crm-dd-search">
                        <input
                          placeholder="Search..."
                          value={dateSearch}
                          onChange={(e) => setDateSearch(e.target.value)}
                        />
                      </div>

                      {visibleDateOptions.map((opt) => {
                        const active = opt.key === activeDateKey;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            className={
                              "crm-dd-row" + (active ? " crm-dd-row-active" : "")
                            }
                            onClick={() => setActiveDateKey(opt.key)}
                          >
                            <div className="crm-dd-left">
                              <span>{opt.label}</span>
                            </div>
                            <div className="crm-dd-right">
                              {active && (
                                <Check
                                  size={16}
                                  className="crm-dd-check-icon"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2) Sort (Opportunity Value) */}
                <div
                  className="crm-filter-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="crm-filter-btn"
                    onClick={() => {
                      setSortOpen((o) => !o);
                      setDateOpen(false);
                      setUserOpen(false);
                      setLabelOpen(false);
                    }}
                  >
                    {activeSortField.label} <ChevronDown size={14} />
                  </button>

                  {sortOpen && (
                    <div className="crm-dd crm-dd-wide">
                      {/* DESC / ASC toggle */}
                      <div className="crm-dd-sort-toggle">
                        <button
                          type="button"
                          className={
                            "crm-dd-sort-btn" +
                            (sortDir === "desc"
                              ? " crm-dd-sort-btn-active"
                              : "")
                          }
                          onClick={() => setSortDir("desc")}
                        >
                          DESCENDING
                        </button>
                        <button
                          type="button"
                          className={
                            "crm-dd-sort-btn" +
                            (sortDir === "asc"
                              ? " crm-dd-sort-btn-active"
                              : "")
                          }
                          onClick={() => setSortDir("asc")}
                        >
                          ASCENDING
                        </button>
                      </div>

                      {SORT_FIELD_OPTIONS.map((opt) => {
                        const active = opt.key === activeSortFieldKey;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            className={
                              "crm-dd-row" + (active ? " crm-dd-row-active" : "")
                            }
                            onClick={() => setActiveSortFieldKey(opt.key)}
                          >
                            <div className="crm-dd-left">
                              <span>{opt.label}</span>
                            </div>
                            <div className="crm-dd-right">
                              {active && (
                                <Check
                                  size={16}
                                  className="crm-dd-check-icon"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3) All Users */}
                <div
                  className="crm-filter-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="crm-filter-btn"
                    onClick={() => {
                      setUserOpen((o) => !o);
                      setDateOpen(false);
                      setSortOpen(false);
                      setLabelOpen(false);
                    }}
                  >
                    {activeUser.label} <ChevronDown size={14} />
                  </button>

                  {userOpen && (
                    <div className="crm-dd crm-dd-wide">
                      <div className="crm-dd-search">
                        <input
                          placeholder="Search..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                        />
                      </div>

                      {visibleUserOptions.map((opt) => {
                        const active = opt.key === activeUserKey;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            className={
                              "crm-dd-row" + (active ? " crm-dd-row-active" : "")
                            }
                            onClick={() => setActiveUserKey(opt.key)}
                          >
                            <div className="crm-dd-left">
                              <div className="crm-user-avatar">
                                {opt.initials}
                              </div>
                              <span>{opt.label}</span>
                            </div>
                            <div className="crm-dd-right">
                              {active && (
                                <Check
                                  size={16}
                                  className="crm-dd-check-icon"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4) Labels (gear icon) */}
                <div
                  className="crm-filter-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="crm-round-icon-btn"
                    onClick={() => {
                      setLabelOpen((o) => !o);
                      setDateOpen(false);
                      setSortOpen(false);
                      setUserOpen(false);
                    }}
                    aria-label="Labels"
                  >
                    <span>⚙</span>
                  </button>

                  {labelOpen && (
                    <div className="crm-dd crm-dd-wide">
                      <div className="crm-dd-search">
                        <input
                          placeholder="Search..."
                          value={labelSearch}
                          onChange={(e) => setLabelSearch(e.target.value)}
                        />
                      </div>

                      {visibleLabelOptions.map((opt) => {
                        const active = activeLabelKeys.includes(opt.key);
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            className={
                              "crm-dd-row" + (active ? " crm-dd-row-active" : "")
                            }
                            onClick={() => toggleLabelKey(opt.key)}
                          >
                            <div className="crm-dd-left">
                              <span>{opt.label}</span>
                            </div>
                            <div className="crm-dd-right">
                              {active && (
                                <Check
                                  size={16}
                                  className="crm-dd-check-icon"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        className="crm-dd-row crm-dd-create-label"
                      >
                        <div className="crm-dd-left">
                          <span>+ Create Label</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* KPI cards row */}
            <div className="crm-opp-kpi-row">
              {OPP_CARDS.map((card) => (
                <div key={card.key} className="crm-opp-card">
                  <div className="crm-opp-card-top">
                    <div className="crm-opp-label">
                      <Zap size={14} />
                      <span>{card.label}</span>
                    </div>
                  </div>
                  <div className="crm-opp-money">$0</div>
                  <div className="crm-opp-deals">0 deals</div>
                </div>
              ))}
            </div>

            <div className="crm-opp-empty">
              You don&apos;t have any leads in dealflow yet.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
