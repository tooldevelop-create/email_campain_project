// src/components/CrmLeadsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/CrmPage.css";

import {
  Search,
  ChevronDown,
  Zap,
  Mail,
  CheckSquare,
  Trash2,
  X,
  MoreHorizontal,
  Download,
  User,
  Edit2,
} from "lucide-react";

/* ---------------- Left folders (same as CRM) ---------------- */

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
  { key: "lists", label: "Lists" }, // yaha dropdown
  { key: "campaigns", label: "Campaigns" }, // yaha dropdown
  { key: "salesflows", label: "Salesflows" },
  { key: "website-visitors", label: "Website Visitors" },
  { key: "reports", label: "Reports" },
];

/* ---------------- Lists items (left dropdown) ---------------- */

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

/* ---------------- Campaigns items (left dropdown) ---------------- */

const CAMPAIGN_ITEMS = [
  { id: 1, name: "Vishnuuu" },
  { id: 2, name: "India Campaign-Selling-Elizabeth India" },
  { id: 3, name: "India Campaign-Selling-Nishant India" },
  { id: 4, name: "India Campaign-Selling-Nishant India" },
  { id: 5, name: "India Campaign-Selling-Elizabeth India" },
  { id: 6, name: "India Campaign-Selling-Nishant India" },
  { id: 7, name: "India Campaign-Selling-Elizabeth India" },
];

/* ---------------- Lead status / owner dropdown options ---------------- */

const LEAD_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "reply", label: "Reply received" },
  { value: "link-clicked", label: "Link clicked" },
  { value: "completed-no-reply", label: "Completed, No reply" },
  { value: "opened-no-reply", label: "Email opened, No reply" },
  { value: "no-open", label: "No emails opened" },
  { value: "unsubscribed", label: "Unsubscribed" },
  { value: "bounced", label: "Bounced" },
  { value: "skipped", label: "Skipped" },
];

const LEAD_OWNER_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "harmeet", label: "Harmeet Kohli" },
];

const CONDITION_FIELDS = [
  { value: "company", label: "Company" },
  { value: "city", label: "City" },
  { value: "emailProvider", label: "Email provider" },
  { value: "status", label: "Status" },
];

/* ---------------- Mock leads for table (50 rows) ---------------- */

const EXTRA_STATUS_VALUES = [
  "Completed, No reply",
  "Reply received",
  "Link clicked",
  "Email opened, No reply",
  "No emails opened",
  "Unsubscribed",
  "Bounced",
  "Skipped",
];

const LEADS = [
  {
    id: 1,
    firstName: "Debadarsan",
    lastName: "Mohanty",
    email: "debadarsan@skillzage.com",
    title: "Chief Executive Officer",
    emailProvider: "Microsoft",
    emailSecurity: "None",
    company: "skillzage",
    website: "",
    status: "Completed, No reply",
    leadOwner: "Harmeet Kohli",
    location: "Bhubaneshwar, India",
    linkedin: "LinkedIn",
    belongsTo: "India Campaign-Selling-Elizabeth India",
    city: "Bhubaneshwar, India",
    jobTitle: "Chief Executive Officer",
  },
  {
    id: 2,
    firstName: "Mahesh",
    lastName: "Chaudhari",
    email: "mahesh.chaudhari@cohizon.com",
    title: "",
    emailProvider: "Microsoft",
    emailSecurity: "None",
    company: "Cohizon Life Sciences (formulation)",
    website: "",
    status: "Reply received",
    leadOwner: "Harmeet Kohli",
    location: "Bharuch, India",
    linkedin: "LinkedIn",
    belongsTo: "India Campaign-Selling-Elizabeth India",
    city: "Bharuch, India",
    jobTitle: "Associate Director",
  },
  {
    id: 3,
    firstName: "Jayesh",
    lastName: "Jain",
    email: "jayesh@rebounce.in",
    title: "Head of Operations",
    emailProvider: "Google",
    emailSecurity: "None",
    company: "Rebounce Surat",
    website: "",
    status: "Link clicked",
    leadOwner: "Harmeet Kohli",
    location: "Bengaluru, India",
    linkedin: "LinkedIn",
    belongsTo: "India Campaign-Selling-Elizabeth India",
    city: "Bengaluru, India",
    jobTitle: "Head of Operations",
  },
  {
    id: 4,
    firstName: "Ranjit",
    lastName: "Das",
    email: "ranjitdas1032@gmail.com",
    title: "",
    emailProvider: "Google",
    emailSecurity: "None",
    company: "sheetal plastics",
    website: "",
    status: "Completed, No reply",
    leadOwner: "Harmeet Kohli",
    location: "",
    linkedin: "LinkedIn",
    belongsTo: "India Campaign-Selling-Elizabeth India",
    city: "",
    jobTitle: "",
  },
  {
    id: 5,
    firstName: "Sheetal",
    lastName: "Sali",
    email: "ssali@sheetalplastics.com",
    title: "",
    emailProvider: "Not Found",
    emailSecurity: "None",
    company: "sheetal plastics",
    website: "",
    status: "Email opened, No reply",
    leadOwner: "Harmeet Kohli",
    location: "",
    linkedin: "LinkedIn",
    belongsTo: "India Campaign-Selling-Elizabeth India",
    city: "",
    jobTitle: "",
  },
  {
    id: 6,
    firstName: "Sujoy",
    lastName: "Dey",
    email: "sujoy.dey@sharda.ac.in",
    title: "",
    emailProvider: "Google",
    emailSecurity: "None",
    company: "Sharda University, Greater Noida",
    website: "",
    status: "No emails opened",
    leadOwner: "Harmeet Kohli",
    location: "Noida, India",
    linkedin: "LinkedIn",
    belongsTo: "India Campaign-Selling-Elizabeth India",
    city: "Noida, India",
    jobTitle: "Head of the Mechanical Dept.",
  },
  {
    id: 7,
    firstName: "Ramesh",
    lastName: "Parik",
    email: "ramesh@indiamart.com",
    title: "",
    emailProvider: "Google",
    emailSecurity: "None",
    company: "Sun Irrigation Systems Pvt. Ltd.",
    website: "",
    status: "Unsubscribed",
    leadOwner: "Harmeet Kohli",
    location: "Maharashtra, India",
    linkedin: "LinkedIn",
    belongsTo: "India Campaign-Selling-Elizabeth India",
    city: "Maharashtra, India",
    jobTitle: "",
  },
  // extra mock rows
  ...Array.from({ length: 43 }).map((_, i) => {
    const id = i + 8; // 8..50
    return {
      id,
      firstName: `Lead${id}`,
      lastName: "Test",
      email: `lead${id}@example.com`,
      title: id % 3 === 0 ? "Manager" : id % 3 === 1 ? "Director" : "Executive",
      emailProvider: id % 4 === 0 ? "Microsoft" : "Google",
      emailSecurity: "None",
      company:
        id % 5 === 0
          ? "Example Plastics"
          : id % 5 === 1
          ? "Example Manufacturing"
          : id % 5 === 2
          ? "Example Tech"
          : id % 5 === 3
          ? "Example Trading"
          : "Example Industries",
      website: "",
      status: EXTRA_STATUS_VALUES[id % EXTRA_STATUS_VALUES.length],
      leadOwner: "Harmeet Kohli",
      location:
        id % 4 === 0
          ? "Mumbai, India"
          : id % 4 === 1
          ? "Delhi, India"
          : id % 4 === 2
          ? "Bengaluru, India"
          : "Chennai, India",
      linkedin: "LinkedIn",
      belongsTo: "India Campaign-Selling-Elizabeth India",
      city:
        id % 4 === 0
          ? "Mumbai, India"
          : id % 4 === 1
          ? "Delhi, India"
          : id % 4 === 2
          ? "Bengaluru, India"
          : "Chennai, India",
      jobTitle:
        id % 3 === 0 ? "Operations Manager" : id % 3 === 1 ? "Sales Head" : "",
    };
  }),
];

export default function CrmLeadsPage() {
  const navigate = useNavigate();

  const [activeFolder, setActiveFolder] = useState("all-leads");
  const [activeInboxSection, setActiveInboxSection] = useState("done");
  const [activeOppSub, setActiveOppSub] = useState("opp-campaigns");

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [creditsOpen, setCreditsOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  // actions + filter drawer
  const [actionsOpen, setActionsOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // EDIT drawer
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editForm, setEditForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    city: "",
    jobTitle: "",
    variableName: "",
    variableValue: "",
    variableType: "custom",
  });
  const [showVariableFields, setShowVariableFields] = useState(false);

  // filter panel internal dropdowns
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [leadStatusSearch, setLeadStatusSearch] = useState("");
  const [leadStatusDdOpen, setLeadStatusDdOpen] = useState(false);

  const [leadOwnerFilter, setLeadOwnerFilter] = useState("all");
  const [leadOwnerSearch, setLeadOwnerSearch] = useState("");
  const [leadOwnerDdOpen, setLeadOwnerDdOpen] = useState(false);

  const [conditions, setConditions] = useState([]);

  // refreshing banner
  const [refreshing, setRefreshing] = useState(false);

  // table / pagination state
  const [rows, setRows] = useState(LEADS);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1); // 1-based

  // inbox count – same everywhere (4)
  const inboxCount = 4;

  const inboxOpen = activeFolder === "inbox";
  const oppsOpen = activeFolder === "opportunities";

  // 🔵 Lists dropdown state
  const [listsOpen, setListsOpen] = useState(true);
  const [listsSearch, setListsSearch] = useState("");
  const [activeListId, setActiveListId] = useState(LIST_ITEMS[0].id);

  const visibleLists = useMemo(
    () =>
      LIST_ITEMS.filter((l) =>
        l.name.toLowerCase().includes(listsSearch.toLowerCase())
      ),
    [listsSearch]
  );

  // 🔵 Campaigns dropdown state
  const [campaignsOpen, setCampaignsOpen] = useState(true);
  const [campaignsSearch, setCampaignsSearch] = useState("");
  const [activeCampaignId, setActiveCampaignId] = useState(
    CAMPAIGN_ITEMS[0].id
  );

  const visibleCampaigns = useMemo(
    () =>
      CAMPAIGN_ITEMS.filter((c) =>
        c.name.toLowerCase().includes(campaignsSearch.toLowerCase())
      ),
    [campaignsSearch]
  );

  const closeAllPopovers = () => {
    setCreditsOpen(false);
    setOrgOpen(false);
    setActionsOpen(false);
  };

  /* ------------ table derived data (search + filters) ------------ */

  const visibleLeads = useMemo(() => {
    const q = search.toLowerCase();

    return rows.filter((l) => {
      // search text
      if (q) {
        const haystack = [
          l.firstName,
          l.lastName,
          l.email,
          l.company,
          l.location,
          l.belongsTo,
          l.city,
          l.jobTitle,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // lead status filter
      if (leadStatusFilter !== "all") {
        const s = (l.status || "").toLowerCase();
        switch (leadStatusFilter) {
          case "reply":
            if (!s.includes("reply received")) return false;
            break;
          case "link-clicked":
            if (!s.includes("link clicked")) return false;
            break;
          case "completed-no-reply":
            if (!s.includes("completed, no reply")) return false;
            break;
          case "opened-no-reply":
            if (!s.includes("email opened, no reply")) return false;
            break;
          case "no-open":
            if (!s.includes("no emails opened")) return false;
            break;
          case "unsubscribed":
            if (!s.includes("unsubscribed")) return false;
            break;
          case "bounced":
            if (!s.includes("bounced")) return false;
            break;
          case "skipped":
            if (!s.includes("skipped")) return false;
            break;
          default:
            break;
        }
      }

      // lead owner filter
      if (leadOwnerFilter === "harmeet") {
        if ((l.leadOwner || "").toLowerCase() !== "harmeet kohli") return false;
      }

      // conditions (AND)
      for (const c of conditions) {
        if (!c.field || !c.value) continue;
        const fieldVal = (l[c.field] || "").toString().toLowerCase();
        if (!fieldVal.includes(c.value.toLowerCase())) return false;
      }

      return true;
    });
  }, [rows, search, leadStatusFilter, leadOwnerFilter, conditions]);

  const totalRows = visibleLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  // ensure current page valid even after delete
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageLeads = visibleLeads.slice(startIdx, startIdx + rowsPerPage);

  const allSelected =
    pageLeads.length > 0 && selectedIds.length === pageLeads.length;

  const isAnySelected = selectedIds.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(pageLeads.map((l) => l.id));
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => setSelectedIds([]);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setRows((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
    setSelectedIds([]);
  };

  // -------- Row actions handlers --------

  const handleDownloadSelected = () => {
    if (selectedIds.length === 0) return;
    const selectedRows = rows.filter((r) => selectedIds.includes(r.id));
    if (!selectedRows.length) return;

    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Title",
      "Email Provider",
      "Email Security",
      "Company",
      "Website",
      "Status",
      "Lead Owner",
      "Location",
      "City",
      "Job Title",
    ];

    const csvLines = [
      headers.join(","),
      ...selectedRows.map((r) =>
        [
          r.firstName,
          r.lastName,
          r.email,
          r.title,
          r.emailProvider,
          r.emailSecurity,
          r.company,
          r.website,
          r.status,
          r.leadOwner,
          r.location,
          r.city,
          r.jobTitle,
        ]
          .map((val) =>
            `"${String(val ?? "")
              .replace(/"/g, '""')
              .trim()}"`,
          )
          .join(","),
      ),
    ];

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-selected.csv";
    a.click();
    URL.revokeObjectURL(url);
    setActionsOpen(false);
  };

  const handleSendEmail = () => {
    if (!selectedIds.length) return;
    alert(
      `Demo: would send email to ${selectedIds.length} selected leads. (Frontend only)`,
    );
    setActionsOpen(false);
  };

  const handleAssignLeads = () => {
    if (!selectedIds.length) return;
    alert(
      `Demo: would open assign-leads dialog for ${selectedIds.length} leads. (Frontend only)`,
    );
    setActionsOpen(false);
  };

  // ------------ Edit drawer handlers ------------

  const openEditPanelForLead = (lead) => {
    if (!lead) return;
    setEditingLeadId(lead.id);
    setEditForm({
      email: lead.email || "",
      firstName: lead.firstName || "",
      lastName: lead.lastName || "",
      company: lead.company || "",
      city: lead.city || "",
      jobTitle: lead.jobTitle || "",
      variableName: "",
      variableValue: "",
      variableType: "custom",
    });
    setShowVariableFields(false);
    setEditPanelOpen(true);
  };

  const closeEditPanel = () => {
    setEditPanelOpen(false);
    setEditingLeadId(null);
    setShowVariableFields(false);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = () => {
    if (!editingLeadId) return;

    setRows((prev) =>
      prev.map((row) =>
        row.id === editingLeadId
          ? {
              ...row,
              email: editForm.email,
              firstName: editForm.firstName,
              lastName: editForm.lastName,
              company: editForm.company,
              city: editForm.city,
              jobTitle: editForm.jobTitle,
            }
          : row,
      ),
    );

    closeEditPanel();
  };

  // search / filters / rowsPerPage change → page 1 + selection reset
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [search, rowsPerPage, leadStatusFilter, leadOwnerFilter, conditions]);

  // small "Refreshing..." banner when filters change
  useEffect(() => {
    if (!filterPanelOpen) return;
    setRefreshing(true);
    const t = setTimeout(() => setRefreshing(false), 500);
    return () => clearTimeout(t);
  }, [filterPanelOpen, search, leadStatusFilter, leadOwnerFilter, conditions]);

  /* ------------ Conditions handlers ------------ */

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { id: Date.now(), field: "company", value: "" },
    ]);
  };

  const updateConditionField = (id, field) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, field } : c)),
    );
  };

  const updateConditionValue = (id, value) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c)),
    );
  };

  const removeCondition = (id) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  /* ========================================================== */

  return (
    <div className="ss-app">
      {/* Sidebar with same inbox count */}
      <Sidebar inboxCount={inboxCount} />

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

        {/* ---------- MAIN BODY ---------- */}
        <section className="crm-body">
          {/* ===== LEFT NAV ===== */}
          <aside className="crm-sidebar">
            <ul className="crm-folder-list">
              {FOLDERS.map((f) => {
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
                          setActiveOppSub("opp-campaigns");
                          navigate(
                            "/crm/opportunities?campaignId=all-campaigns",
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

                // Lists dropdown
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
                              onChange={(e) => setListsSearch(e.target.value)}
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

                // 🔵 Campaigns dropdown – yahi naya part
                if (f.key === "campaigns") {
                  return (
                    <li key="campaigns" className="crm-lists-block">
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
                          {/* search box */}
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

                          {/* campaigns list */}
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
                                  onClick={() => {
                                    setActiveFolder("campaigns");
                                    setActiveCampaignId(item.id);
                                    // yaha pe agar aap leads ko campaign se filter karna chahte ho
                                    // to baad me logic add kar sakte hain.
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

                // baaki normal folders
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

          {/* ===== RIGHT: LEADS TABLE ===== */}
          <div className="crm-main-panel">
            {/* Refreshing banner (top center) */}
            {refreshing && (
              <div className="crm-leads-refresh-banner">Refreshing...</div>
            )}

            {/* top search + actions row */}
            <div className="crm-leads-top-row">
              <div className="crm-top-search crm-leads-search">
                <Search size={16} />
                <input
                  className="crm-top-search-input"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div
                className="crm-leads-actions-wrapper"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="crm-leads-actions-btn"
                  onClick={() => setActionsOpen((o) => !o)}
                >
                  {isAnySelected ? "Row actions" : "Actions"}
                  <ChevronDown size={14} />
                </button>

                {actionsOpen && (
                  <div className="crm-leads-actions-dd">
                    {!isAnySelected && (
                      <button
                        className="crm-leads-actions-item"
                        onClick={() => {
                          setFilterPanelOpen(true);
                          setActionsOpen(false);
                        }}
                      >
                        Filters
                      </button>
                    )}

                    {isAnySelected && (
                      <>
                        <button
                          className="crm-leads-actions-item"
                          onClick={handleDownloadSelected}
                        >
                          <Download size={14} />
                          <span>Download selected</span>
                        </button>
                        <button
                          className="crm-leads-actions-item"
                          onClick={handleSendEmail}
                        >
                          <Mail size={14} />
                          <span>Send Email</span>
                        </button>
                        <button
                          className="crm-leads-actions-item"
                          onClick={handleAssignLeads}
                        >
                          <User size={14} />
                          <span>Assign Leads</span>
                        </button>
                        <button
                          className="crm-leads-actions-item"
                          onClick={() => {
                            handleDeleteSelected();
                            setActionsOpen(false);
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Delete selected</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* bulk selection toolbar */}
            {selectedIds.length > 0 && (
              <div
                className="crm-bulk-actions"
                style={{ margin: "0 0 8px 8px" }}
              >
                <button className="crm-bulk-pill">
                  <CheckSquare size={14} />
                  {selectedIds.length} selected
                </button>
                <button
                  className="crm-bulk-icon-btn"
                  onClick={handleClearSelection}
                >
                  <X size={14} />
                </button>
                <button
                  className="crm-bulk-icon-btn"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 size={14} />
                </button>
                <button className="crm-bulk-icon-btn">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            )}

            {/* table */}
            <div className="crm-leads-table-wrapper">
              <table className="crm-leads-table">
                <thead>
                  <tr>
                    <th className="crm-leads-th crm-leads-th-checkbox">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="crm-leads-th crm-leads-th-index">#</th>

                    <th className="crm-leads-th">
                      <span className="crm-leads-th-label">
                        <Search size={12} />
                        FIRST NAME
                      </span>
                    </th>
                    <th className="crm-leads-th">
                      <span className="crm-leads-th-label">
                        <Search size={12} />
                        LAST NAME
                      </span>
                    </th>
                    <th className="crm-leads-th">
                      <span className="crm-leads-th-label">
                        <Mail size={12} />
                        EMAIL
                      </span>
                    </th>
                    <th className="crm-leads-th">TITLE</th>
                    <th className="crm-leads-th">EMAIL PROVIDER</th>
                    <th className="crm-leads-th">EMAIL SECURITY</th>
                    <th className="crm-leads-th">COMPANY</th>
                    <th className="crm-leads-th">WEBSITE</th>
                    <th className="crm-leads-th">STATUS</th>
                    <th className="crm-leads-th">LEAD OWNER</th>
                    <th className="crm-leads-th">LOCATION</th>
                    <th className="crm-leads-th">LINKEDIN</th>
                    <th className="crm-leads-th">BELONGS TO</th>
                    <th className="crm-leads-th">CITY</th>
                    <th className="crm-leads-th">TITLE (JOB)</th>
                    <th className="crm-leads-th crm-leads-th-edit" />
                  </tr>
                </thead>

                <tbody>
                  {pageLeads.map((l, idx) => (
                    <tr key={l.id} className="crm-leads-tr">
                      <td className="crm-leads-td crm-leads-td-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(l.id)}
                          onChange={() => toggleRow(l.id)}
                        />
                      </td>
                      <td className="crm-leads-td crm-leads-td-index">
                        {startIdx + idx + 1}
                      </td>

                      <td className="crm-leads-td">{l.firstName}</td>
                      <td className="crm-leads-td">{l.lastName}</td>
                      <td className="crm-leads-td crm-leads-email">
                        {l.email}
                      </td>
                      <td className="crm-leads-td">{l.title}</td>
                      <td className="crm-leads-td">{l.emailProvider}</td>
                      <td className="crm-leads-td">{l.emailSecurity}</td>
                      <td className="crm-leads-td">{l.company}</td>
                      <td className="crm-leads-td">{l.website}</td>
                      <td className="crm-leads-td">{l.status}</td>
                      <td className="crm-leads-td">{l.leadOwner}</td>
                      <td className="crm-leads-td">{l.location}</td>
                      <td className="crm-leads-td crm-leads-link">
                        {l.linkedin}
                      </td>
                      <td className="crm-leads-td">{l.belongsTo}</td>
                      <td className="crm-leads-td">{l.city}</td>
                      <td className="crm-leads-td">{l.jobTitle}</td>

                      {/* hover edit button */}
                      <td className="crm-leads-td crm-leads-td-edit">
                        <button
                          className="crm-leads-edit-btn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditPanelForLead(l);
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {pageLeads.length === 0 && (
                    <tr>
                      <td
                        className="crm-leads-td"
                        colSpan={18}
                        style={{ textAlign: "center" }}
                      >
                        No leads found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* footer – rows per page / pagination */}
              <div className="crm-leads-footer">
                <div className="crm-leads-footer-left">
                  Rows per page
                  <select
                    className="crm-leads-footer-dd"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="crm-leads-footer-right">
                  <span>
                    Page {totalRows === 0 ? 0 : currentPage} of {totalPages}
                  </span>
                  <button
                    className="crm-leads-page-btn"
                    disabled={currentPage <= 1 || totalRows === 0}
                    onClick={() => setPage((p) => (p > 1 ? p - 1 : p))}
                  >
                    ‹
                  </button>
                  <button
                    className="crm-leads-page-btn"
                    disabled={currentPage >= totalPages || totalRows === 0}
                    onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT SLIDER: FILTER PANEL ===== */}
          {filterPanelOpen && (
            <div
              className="crm-leads-filter-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="crm-leads-filter-header">
                <div className="crm-leads-filter-title">Filters</div>
                <button
                  className="crm-leads-filter-close"
                  onClick={() => setFilterPanelOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="crm-leads-filter-body">
                {/* Lead Status */}
                <div className="crm-leads-filter-group">
                  <div className="crm-leads-filter-label">Lead Status</div>

                  <div className="crm-leads-filter-select-wrapper">
                    <button
                      className="crm-leads-filter-select-btn"
                      onClick={() => setLeadStatusDdOpen((open) => !open)}
                    >
                      <span>
                        {
                          LEAD_STATUS_OPTIONS.find(
                            (o) => o.value === leadStatusFilter,
                          )?.label
                        }
                      </span>
                      <ChevronDown size={14} />
                    </button>

                    {leadStatusDdOpen && (
                      <div className="crm-leads-filter-dd">
                        <div className="crm-leads-filter-dd-search">
                          <input
                            placeholder="Search..."
                            value={leadStatusSearch}
                            onChange={(e) =>
                              setLeadStatusSearch(e.target.value)
                            }
                          />
                        </div>
                        <div className="crm-leads-filter-dd-list">
                          {LEAD_STATUS_OPTIONS.filter((o) =>
                            o.label
                              .toLowerCase()
                              .includes(leadStatusSearch.toLowerCase()),
                          ).map((o) => (
                            <button
                              key={o.value}
                              className={
                                "crm-leads-filter-dd-item" +
                                (leadStatusFilter === o.value
                                  ? " crm-leads-filter-dd-item-active"
                                  : "")
                              }
                              onClick={() => {
                                setLeadStatusFilter(o.value);
                                setLeadStatusDdOpen(false);
                              }}
                            >
                              <span>{o.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lead Owner */}
                <div className="crm-leads-filter-group">
                  <div className="crm-leads-filter-label">Lead Owner</div>

                  <div className="crm-leads-filter-select-wrapper">
                    <button
                      className="crm-leads-filter-select-btn"
                      onClick={() => setLeadOwnerDdOpen((open) => !open)}
                    >
                      <span>
                        {
                          LEAD_OWNER_OPTIONS.find(
                            (o) => o.value === leadOwnerFilter,
                          )?.label
                        }
                      </span>
                      <ChevronDown size={14} />
                    </button>

                    {leadOwnerDdOpen && (
                      <div className="crm-leads-filter-dd">
                        <div className="crm-leads-filter-dd-search">
                          <input
                            placeholder="Search..."
                            value={leadOwnerSearch}
                            onChange={(e) =>
                              setLeadOwnerSearch(e.target.value)
                            }
                          />
                        </div>
                        <div className="crm-leads-filter-dd-list">
                          {LEAD_OWNER_OPTIONS.filter((o) =>
                            o.label
                              .toLowerCase()
                              .includes(leadOwnerSearch.toLowerCase()),
                          ).map((o) => (
                            <button
                              key={o.value}
                              className={
                                "crm-leads-filter-dd-item" +
                                (leadOwnerFilter === o.value
                                  ? " crm-leads-filter-dd-item-active"
                                  : "")
                              }
                              onClick={() => {
                                setLeadOwnerFilter(o.value);
                                setLeadOwnerDdOpen(false);
                              }}
                            >
                              <span>{o.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditions */}
                <div className="crm-leads-filter-group">
                  <div className="crm-leads-filter-label">Conditions</div>
                  <div className="crm-leads-filter-help">
                    Add conditions to filter the leads
                  </div>

                  <div className="crm-leads-cond-list">
                    {conditions.map((c, idx) => (
                      <React.Fragment key={c.id}>
                        {idx > 0 && (
                          <div className="crm-leads-cond-and">AND</div>
                        )}
                        <div className="crm-leads-cond-row">
                          <select
                            className="crm-leads-cond-field"
                            value={c.field}
                            onChange={(e) =>
                              updateConditionField(c.id, e.target.value)
                            }
                          >
                            {CONDITION_FIELDS.map((f) => (
                              <option key={f.value} value={f.value}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                          <input
                            className="crm-leads-cond-value"
                            placeholder="Contains..."
                            value={c.value}
                            onChange={(e) =>
                              updateConditionValue(c.id, e.target.value)
                            }
                          />
                          <button
                            className="crm-leads-cond-remove"
                            onClick={() => removeCondition(c.id)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    className="crm-leads-cond-add"
                    onClick={addCondition}
                  >
                    + Add Condition
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== RIGHT SLIDER: LEAD EDIT PANEL ===== */}
          {editPanelOpen && (
            <div
              className="crm-leads-edit-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="crm-leads-edit-header">
                <div className="crm-leads-edit-avatar">
                  {editForm.firstName.charAt(0).toUpperCase() || "L"}
                  {editForm.lastName.charAt(0).toUpperCase() || ""}
                </div>
                <div className="crm-leads-edit-header-text">
                  <div className="crm-leads-edit-email">{editForm.email}</div>
                  <div className="crm-leads-edit-badge">Lead</div>
                </div>
                <button
                  className="crm-leads-edit-close"
                  onClick={closeEditPanel}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="crm-leads-edit-tabs">Lead Details</div>

              <div className="crm-leads-edit-body">
                <div className="crm-leads-edit-field">
                  <label>Email</label>
                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      handleEditChange("email", e.target.value)
                    }
                  />
                </div>

                <div className="crm-leads-edit-field">
                  <label>lastName</label>
                  <input
                    value={editForm.lastName}
                    onChange={(e) =>
                      handleEditChange("lastName", e.target.value)
                    }
                  />
                </div>

                <div className="crm-leads-edit-field">
                  <label>firstName</label>
                  <input
                    value={editForm.firstName}
                    onChange={(e) =>
                      handleEditChange("firstName", e.target.value)
                    }
                  />
                </div>

                <div className="crm-leads-edit-field">
                  <label>companyName</label>
                  <input
                    value={editForm.company}
                    onChange={(e) =>
                      handleEditChange("company", e.target.value)
                    }
                  />
                </div>

                <div className="crm-leads-edit-field">
                  <label>City</label>
                  <input
                    value={editForm.city}
                    onChange={(e) =>
                      handleEditChange("city", e.target.value)
                    }
                  />
                </div>

                <div className="crm-leads-edit-field">
                  <label>jobTitle</label>
                  <input
                    value={editForm.jobTitle}
                    onChange={(e) =>
                      handleEditChange("jobTitle", e.target.value)
                    }
                  />
                </div>

                {/* Add Variable section */}
                <div className="crm-leads-edit-variable-block">
                  <button
                    type="button"
                    className="crm-leads-edit-add-var"
                    onClick={() => setShowVariableFields(true)}
                  >
                    + Add Variable
                  </button>

                  {showVariableFields && (
                    <>
                      <div className="crm-leads-edit-field">
                        <label>Variable Name</label>
                        <input
                          placeholder="example: phone_number"
                          value={editForm.variableName}
                          onChange={(e) =>
                            handleEditChange("variableName", e.target.value)
                          }
                        />
                      </div>

                      <div className="crm-leads-edit-field">
                        <label>Variable Value</label>
                        <input
                          placeholder="example: 123-456-7890"
                          value={editForm.variableValue}
                          onChange={(e) =>
                            handleEditChange("variableValue", e.target.value)
                          }
                        />
                      </div>

                      <div className="crm-leads-edit-field">
                        <label>Variable Type</label>
                        <select
                          value={editForm.variableType}
                          onChange={(e) =>
                            handleEditChange("variableType", e.target.value)
                          }
                        >
                          <option value="personalization">
                            Personalization
                          </option>
                          <option value="phone">Phone</option>
                          <option value="website">Website</option>
                          <option value="location">Location</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="custom">Custom Variable</option>
                        </select>
                      </div>

                      <div className="crm-leads-edit-variable-actions">
                        <button
                          type="button"
                          className="crm-leads-edit-cancel"
                          onClick={closeEditPanel}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="crm-leads-edit-save"
                          onClick={handleSaveLead}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
