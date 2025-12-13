// src/components/CrmUnnamedListPage.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/CrmPage.css";

import {
  Search,
  ChevronDown,
  Zap,
  Filter,
  Users,
  X,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";

/* ---- LEFT SIDE lists (sidebar dropdown) ---- */
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

/* ---- mock leads (table rows) ---- */
const LEADS = [
  {
    id: 1,
    firstName: "Brian",
    lastName: "Brewer",
    email: "bbrewer@green-innovate.com",
    title: "Purchasing Manager",
    provider: "Google",
    gateway: "None",
    company: "Green Innovate",
    website: "green-innovate.com",
    status: "Contacted",
    owner: "Harmeet Kohli",
    location: "USA",
    linkedin: "linkedin.com/in/brianbrewer",
  },
  {
    id: 2,
    firstName: "Sophia",
    lastName: "Hughes",
    email: "sophia.h@ecoplastics.in",
    title: "Founder",
    provider: "Zoho",
    gateway: "None",
    company: "Eco Plastics",
    website: "ecoplastics.in",
    status: "New",
    owner: "Harmeet Kohli",
    location: "India",
    linkedin: "linkedin.com/in/sophiahughes",
  },
  {
    id: 3,
    firstName: "Len",
    lastName: "Keck",
    email: "len.keck@westfieldconsultingco.com",
    title: "Consultant",
    provider: "Microsoft",
    gateway: "None",
    company: "Westfield Consulting",
    website: "westfieldconsultingco.com",
    status: "Not interested",
    owner: "Harmeet Kohli",
    location: "USA",
    linkedin: "linkedin.com/in/lenkeck",
  },
];

const SORT_COLUMNS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "title", label: "Title" },
  { key: "company", label: "Company" },
  { key: "website", label: "Website" },
  { key: "status", label: "Status" },
  { key: "owner", label: "Lead Owner" },
  { key: "location", label: "Location" },
];

/* FILTER SUB-MENU DATA */
const DATA_FIELDS = [
  "First Name",
  "Last Name",
  "Email",
  "Title",
  "Company",
  "Website",
  "Status",
  "Lead Owner",
  "Location",
  "Linkedin",
];

const LEAD_STATUS_ITEMS = [
  "Any status",
  "Reply received",
  "Link clicked",
  "Completed, No reply",
  "Email opened, No reply",
  "No emails opened",
  "Unsubscribed",
  "Bounced",
  "Skipped",
  "Contacted",
  "New",
  "Not interested",
];

const LEAD_OWNER_ITEMS = ["All owners", "Harmeet Kohli"];

const LEAD_ESP_ITEMS = [
  "All ESPs",
  "Google",
  "Microsoft",
  "Zoho",
  "Yahoo",
  "Yandex",
  "Web.de",
  "Other",
  "Not Found",
];

export default function CrmUnnamedListPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* --------- top controls state --------- */
  const [search, setSearch] = useState("");

  // Filters main dropdown
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] =
    useState("dataFields"); // "dataFields" | "leadStatus" | "leadOwner" | "leadESP"

  // extra dropdowns
  const [sortOpen, setSortOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  // actual filters chosen from popover
  const [statusFilter, setStatusFilter] = useState("Any status");
  const [ownerFilter, setOwnerFilter] = useState("All owners");
  const [espFilter, setEspFilter] = useState("All ESPs");

  const closeAllPopovers = () => {
    setFiltersOpen(false);
    setSortOpen(false);
    setActionsOpen(false);
  };

  /* --------- derived rows --------- */
  const filteredLeads = useMemo(() => {
    let rows = LEADS;

    // text search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => {
        const haystack = [
          r.firstName,
          r.lastName,
          r.email,
          r.company,
          r.location,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    // status filter
    if (statusFilter && statusFilter !== "Any status") {
      rows = rows.filter(
        (r) => (r.status || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // owner filter
    if (ownerFilter && ownerFilter !== "All owners") {
      rows = rows.filter(
        (r) => (r.owner || "").toLowerCase() === ownerFilter.toLowerCase()
      );
    }

    // ESP filter
    if (espFilter && espFilter !== "All ESPs") {
      if (espFilter === "Other") {
        rows = rows.filter(
          (r) =>
            !["google", "microsoft", "zoho", "yahoo", "yandex", "web.de"].includes(
              (r.provider || "").toLowerCase()
            ) && (r.provider || "") !== ""
        );
      } else if (espFilter === "Not Found") {
        rows = rows.filter(
          (r) => (r.provider || "").toLowerCase() === "not found"
        );
      } else {
        rows = rows.filter(
          (r) => (r.provider || "").toLowerCase() === espFilter.toLowerCase()
        );
      }
    }

    // sort
    if (sortField) {
      rows = [...rows].sort((a, b) => {
        const av = (a[sortField] || "").toString().toLowerCase();
        const bv = (b[sortField] || "").toString().toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [search, statusFilter, ownerFilter, espFilter, sortField, sortDir]);

  const allSelected =
    filteredLeads.length > 0 &&
    selectedIds.length === filteredLeads.length &&
    filteredLeads.every((r) => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredLeads.map((r) => r.id));
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* --------- sort helpers ---------- */
  const handleSelectSortColumn = (colKey) => {
    if (sortField === colKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(colKey);
      setSortDir("asc");
    }
  };

  const currentSortLabel =
    sortField &&
    SORT_COLUMNS.find((c) => c.key === sortField)?.label + " (" + sortDir + ")";

  /* --------- table edit ---------- */
  const openEdit = (lead) => {
    setEditLead(lead);
  };

  const closeEdit = () => setEditLead(null);

  const handleEditChange = (field, value) => {
    setEditLead((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveLead = () => {
    console.log("Save lead:", editLead);
    closeEdit();
  };

  /* ------------ Filter popover handlers ------------ */

  const handleQuickStatusClick = (label) => {
    setStatusFilter(label);
    setFiltersOpen(false);
  };

  const handleStatusMenuClick = (label) => {
    setStatusFilter(label);
    setFiltersOpen(false);
  };

  const handleOwnerMenuClick = (label) => {
    setOwnerFilter(label);
    setFiltersOpen(false);
  };

  const handleEspMenuClick = (label) => {
    setEspFilter(label);
    setFiltersOpen(false);
  };

  /* --------- render ---------- */

  return (
    <div className="ss-app">
      <Sidebar inboxCount={0} />

      <main className="ss-main crm-main" onClick={closeAllPopovers}>
        {/* ------------ TOP BAR ------------ */}
        <div className="crm-topbar">
          <div className="crm-topbar-left">
            <span className="crm-topbar-title">CRM</span>
            <button className="crm-topbar-square-btn" aria-label="CRM settings">
              <span className="crm-topbar-square-inner" />
            </button>
          </div>

          <div className="crm-topbar-right">
            <div
              className="crm-coins-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="crm-coins-btn"
                onClick={() => setFiltersOpen(false)}
              >
                <Zap size={16} />
                <span>286</span>
                <ChevronDown size={14} />
              </button>
            </div>

            <button className="crm-primary-btn">Get All Features</button>

            <div
              className="crm-org-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="crm-outline-btn">
                My Organization...
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ------------ BODY ------------ */}
        <section className="crm-body">
          {/* LEFT NAV – Lists active */}
          <aside className="crm-sidebar">
            <ul className="crm-folder-list">
              <li>
                <button
                  className="crm-folder-item"
                  onClick={() => navigate("/crm")}
                >
                  <span>Inbox</span>
                </button>
              </li>

              <li>
                <button
                  className="crm-folder-item"
                  onClick={() => navigate("/crm/opportunities")}
                >
                  <span>Opportunities</span>
                </button>
              </li>

              <li>
                <button
                  className="crm-folder-item"
                  onClick={() => navigate("/crm/leads")}
                >
                  <span>All Leads</span>
                </button>
              </li>

              <li className="crm-lists-block">
                <button className="crm-folder-item crm-lists-header crm-folder-item-active">
                  <span>Lists</span>
                  <ChevronDown
                    size={14}
                    className="crm-inbox-chevron crm-inbox-chevron-open"
                  />
                </button>

                <div className="crm-lists-panel">
                  <div className="crm-lists-search">
                    <Search size={14} />
                    <input placeholder="Search" />
                  </div>

                  <ul className="crm-inbox-sublist crm-lists-sublist">
                    {LIST_ITEMS.map((item) => (
                      <li key={item.id}>
                        <button
                          className={
                            "crm-inbox-subitem crm-list-item" +
                            (String(item.id) === String(id)
                              ? " crm-inbox-subitem-active crm-list-item-active"
                              : "")
                          }
                          onClick={() =>
                            navigate(`/crm/unnamed-list/${item.id}`)
                          }
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </aside>

          {/* RIGHT PANEL – Unnamed list table */}
          <div className="crm-main-panel" onClick={closeAllPopovers}>
            <div className="crm-table" style={{ padding: "12px 16px" }}>
              {/* top controls row */}
              <div className="crm-leads-top-row">
                {/* search */}
                <div className="crm-top-search crm-leads-search">
                  <Search size={16} />
                  <input
                    className="crm-top-search-input"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* right controls: people count + Filters + Sort + Enrich + Actions */}
                <div className="crm-filters-right">
                  <button className="crm-filter-btn">
                    <Users size={16} />
                    <span>{filteredLeads.length}</span>
                  </button>

                  {/* FILTERS button */}
                  <div
                    className="crm-filter-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="crm-filter-btn"
                      onClick={() => {
                        setFiltersOpen((o) => !o);
                        setSortOpen(false);
                        setActionsOpen(false);
                      }}
                    >
                      <Filter size={16} />
                      <span>Filters</span>
                      <ChevronDown size={14} />
                    </button>

                    {filtersOpen && (
                      <div
                        className="crm-filter-popover crm-filter-popover-wide"
                        style={{
                          display: "flex",
                          alignItems: "stretch",
                          minWidth: 520,
                        }}
                      >
                        {/* LEFT COLUMN – sections */}
                        <div
                          className="crm-filter-col-left"
                          style={{
                            width: 220,
                            paddingRight: 8,
                            borderRight:
                              "1px solid rgba(255,255,255,0.06)",
                            maxHeight: 360,
                            overflowY: "auto",
                          }}
                        >
                          <button
                            className={
                              "crm-filter-option" +
                              (activeFilterCategory === "dataFields"
                                ? " crm-filter-option-active"
                                : "")
                            }
                            onMouseEnter={() =>
                              setActiveFilterCategory("dataFields")
                            }
                            onClick={() =>
                              setActiveFilterCategory("dataFields")
                            }
                          >
                            <span className="crm-filter-option-label">
                              Data fields
                            </span>
                            <ChevronDown size={14} />
                          </button>

                          <button
                            className={
                              "crm-filter-option" +
                              (activeFilterCategory === "leadStatus"
                                ? " crm-filter-option-active"
                                : "")
                            }
                            onMouseEnter={() =>
                              setActiveFilterCategory("leadStatus")
                            }
                            onClick={() =>
                              setActiveFilterCategory("leadStatus")
                            }
                          >
                            <span className="crm-filter-option-label">
                              Lead status
                            </span>
                            <ChevronDown size={14} />
                          </button>

                          <button
                            className={
                              "crm-filter-option" +
                              (activeFilterCategory === "leadOwner"
                                ? " crm-filter-option-active"
                                : "")
                            }
                            onMouseEnter={() =>
                              setActiveFilterCategory("leadOwner")
                            }
                            onClick={() =>
                              setActiveFilterCategory("leadOwner")
                            }
                          >
                            <span className="crm-filter-option-label">
                              Lead owner
                            </span>
                            <ChevronDown size={14} />
                          </button>

                          <button
                            className={
                              "crm-filter-option" +
                              (activeFilterCategory === "leadESP"
                                ? " crm-filter-option-active"
                                : "")
                            }
                            onMouseEnter={() =>
                              setActiveFilterCategory("leadESP")
                            }
                            onClick={() => setActiveFilterCategory("leadESP")}
                          >
                            <span className="crm-filter-option-label">
                              Lead ESP
                            </span>
                            <ChevronDown size={14} />
                          </button>

                          {/* quick filters bottom */}
                          <button
                            className="crm-filter-option"
                            onClick={() =>
                              handleQuickStatusClick("Email opened, No reply")
                            }
                          >
                            <span className="crm-filter-option-label">
                              Email opened
                            </span>
                          </button>

                          <button
                            className="crm-filter-option"
                            onClick={() =>
                              handleQuickStatusClick("Link clicked")
                            }
                          >
                            <span className="crm-filter-option-label">
                              Link clicked
                            </span>
                          </button>

                          <button
                            className="crm-filter-option"
                            onClick={() =>
                              handleQuickStatusClick("Reply received")
                            }
                          >
                            <span className="crm-filter-option-label">
                              Reply received
                            </span>
                          </button>
                        </div>

                        {/* RIGHT COLUMN – submenu items */}
                        <div
                          className="crm-filter-col-right"
                          style={{
                            flex: 1,
                            paddingLeft: 8,
                            maxHeight: 360,
                            overflowY: "auto",
                          }}
                        >
                          {/* Data fields submenu */}
                          {activeFilterCategory === "dataFields" && (
                            <div className="crm-filter-options">
                              {DATA_FIELDS.map((label) => (
                                <button
                                  key={label}
                                  className="crm-filter-option"
                                  onClick={() => {
                                    const colMapping = {
                                      "First Name": "firstName",
                                      "Last Name": "lastName",
                                      Email: "email",
                                      Title: "title",
                                      Company: "company",
                                      Website: "website",
                                      Status: "status",
                                      "Lead Owner": "owner",
                                      Location: "location",
                                      Linkedin: "linkedin",
                                    };
                                    const key = colMapping[label];
                                    if (key) handleSelectSortColumn(key);
                                    closeAllPopovers();
                                  }}
                                >
                                  <span className="crm-filter-option-label">
                                    {label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Lead status submenu */}
                          {activeFilterCategory === "leadStatus" && (
                            <div className="crm-filter-options">
                              {LEAD_STATUS_ITEMS.map((label) => (
                                <button
                                  key={label}
                                  className={
                                    "crm-filter-option" +
                                    (statusFilter === label
                                      ? " crm-filter-option-active"
                                      : "")
                                  }
                                  onClick={() => handleStatusMenuClick(label)}
                                >
                                  <span className="crm-filter-option-label">
                                    {label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Lead owner submenu */}
                          {activeFilterCategory === "leadOwner" && (
                            <div className="crm-filter-options">
                              {LEAD_OWNER_ITEMS.map((label) => (
                                <button
                                  key={label}
                                  className={
                                    "crm-filter-option" +
                                    (ownerFilter === label
                                      ? " crm-filter-option-active"
                                      : "")
                                  }
                                  onClick={() => handleOwnerMenuClick(label)}
                                >
                                  <span className="crm-filter-option-label">
                                    {label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Lead ESP submenu */}
                          {activeFilterCategory === "leadESP" && (
                            <div className="crm-filter-options">
                              {LEAD_ESP_ITEMS.map((label) => (
                                <button
                                  key={label}
                                  className={
                                    "crm-filter-option" +
                                    (espFilter === label
                                      ? " crm-filter-option-active"
                                      : "")
                                  }
                                  onClick={() => handleEspMenuClick(label)}
                                >
                                  <span className="crm-filter-option-label">
                                    {label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SORT – "No sort" dropdown */}
                  <div
                    className="crm-filter-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="crm-filter-btn"
                      onClick={() => {
                        setSortOpen((o) => !o);
                        setFiltersOpen(false);
                        setActionsOpen(false);
                      }}
                    >
                      <span>{sortField ? currentSortLabel : "No sort"}</span>
                      <ChevronDown size={14} />
                    </button>

                    {sortOpen && (
                      <div className="crm-filter-popover crm-dd-wide">
                        <div className="crm-filter-options">
                          {SORT_COLUMNS.map((col) => (
                            <button
                              key={col.key}
                              className="crm-filter-option"
                              onClick={() => handleSelectSortColumn(col.key)}
                            >
                              <span className="crm-filter-option-label">
                                {col.label}
                              </span>
                              {sortField === col.key && (
                                <span style={{ fontSize: 11 }}>
                                  {sortDir === "asc"
                                    ? "Ascending (A → Z)"
                                    : "Descending (Z → A)"}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enrich & AI – simple button, NO dropdown */}
                  <div
                    className="crm-filter-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="crm-filter-btn"
                      type="button"
                      onClick={() => {
                        // future: yahan koi action add kar sakte ho
                        console.log("Enrich & AI clicked");
                      }}
                    >
                      <Zap size={16} />
                      <span>Enrich &amp; AI</span>
                    </button>
                  </div>

                  {/* Actions dropdown */}
                  <div
                    className="crm-filter-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="crm-filter-btn"
                      onClick={() => {
                        setActionsOpen((o) => !o);
                        setFiltersOpen(false);
                        setSortOpen(false);
                      }}
                    >
                      <span>Actions</span>
                      <ChevronDown size={14} />
                    </button>

                    {actionsOpen && (
                      <div className="crm-leads-actions-dd">
                        <button className="crm-leads-actions-item">
                          <span>+ Add Leads</span>
                        </button>
                        <button
                          className="crm-leads-actions-item"
                          onClick={() => {
                            setFiltersDrawerOpen(true);
                            setActionsOpen(false);
                          }}
                        >
                          <span>Filters</span>
                        </button>
                        <button
                          className="crm-leads-actions-item"
                          onClick={() => alert("Delete List (demo)")}
                        >
                          <Trash2 size={14} />
                          <span>Delete List</span>
                        </button>
                        <button
                          className="crm-leads-actions-item"
                          onClick={() => alert("Edit List (demo)")}
                        >
                          <Edit2 size={14} />
                          <span>Edit List</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TABLE */}
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
                      <th className="crm-leads-th">FIRST NAME</th>
                      <th className="crm-leads-th">LAST NAME</th>
                      <th className="crm-leads-th">EMAIL</th>
                      <th className="crm-leads-th">TITLE</th>
                      <th className="crm-leads-th">EMAIL PROVIDER</th>
                      <th className="crm-leads-th">EMAIL SECURITY GATEWAY</th>
                      <th className="crm-leads-th">COMPANY</th>
                      <th className="crm-leads-th">WEBSITE</th>
                      <th className="crm-leads-th">STATUS</th>
                      <th className="crm-leads-th">LEAD OWNER</th>
                      <th className="crm-leads-th">LOCATION</th>
                      <th className="crm-leads-th">LINKEDIN</th>
                      <th className="crm-leads-th crm-leads-th-edit" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((row, idx) => (
                      <tr key={row.id} className="crm-leads-tr">
                        <td className="crm-leads-td crm-leads-td-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleRow(row.id)}
                          />
                        </td>
                        <td className="crm-leads-td crm-leads-td-index">
                          {idx + 1}
                        </td>
                        <td className="crm-leads-td">{row.firstName}</td>
                        <td className="crm-leads-td">{row.lastName}</td>
                        <td className="crm-leads-td crm-leads-email">
                          {row.email}
                        </td>
                        <td className="crm-leads-td">{row.title}</td>
                        <td className="crm-leads-td">{row.provider}</td>
                        <td className="crm-leads-td">{row.gateway}</td>
                        <td className="crm-leads-td">{row.company}</td>
                        <td className="crm-leads-td">{row.website}</td>
                        <td className="crm-leads-td">{row.status}</td>
                        <td className="crm-leads-td">{row.owner}</td>
                        <td className="crm-leads-td">{row.location}</td>
                        <td className="crm-leads-td crm-leads-link">
                          {row.linkedin}
                        </td>
                        <td className="crm-leads-td crm-leads-td-edit">
                          <button
                            className="crm-leads-edit-btn"
                            type="button"
                            onClick={() => openEdit(row)}
                          >
                            <Edit2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredLeads.length === 0 && (
                      <tr className="crm-leads-tr">
                        <td
                          className="crm-leads-td"
                          colSpan={15}
                          style={{ textAlign: "center" }}
                        >
                          No leads in this list.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* footer */}
              <div className="crm-leads-footer">
                <div>
                  Showing{" "}
                  <strong>
                    {filteredLeads.length ? 1 : 0}-{filteredLeads.length}
                  </strong>{" "}
                  of <strong>{filteredLeads.length}</strong> rows
                </div>
                <div className="crm-leads-footer-right">
                  <button className="crm-leads-page-btn">{"<"}</button>
                  <button className="crm-leads-page-btn">{">"}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT FILTER DRAWER (Actions → Filters) */}
        {filtersDrawerOpen && (
          <div
            className="crm-leads-filter-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="crm-leads-filter-header">
              <div className="crm-leads-filter-title">Filters</div>
              <button
                className="crm-leads-filter-close"
                onClick={() => setFiltersDrawerOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="crm-leads-filter-body">
              <div className="crm-leads-filter-group">
                <div className="crm-leads-filter-label">Status</div>
                <div className="crm-leads-filter-help">
                  Filter by current lead status.
                </div>
                <div className="crm-leads-filter-select-wrapper">
                  <button className="crm-leads-filter-select-btn">
                    <span>{statusFilter || "Any status"}</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              <div className="crm-leads-filter-group">
                <div className="crm-leads-filter-label">Lead owner</div>
                <div className="crm-leads-filter-select-wrapper">
                  <button className="crm-leads-filter-select-btn">
                    <span>{ownerFilter || "All owners"}</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              <div className="crm-leads-filter-group">
                <div className="crm-leads-filter-label">
                  Add conditions (AND)
                </div>
                <div className="crm-leads-filter-help">
                  Narrow down this list using custom fields.
                </div>

                <div className="crm-leads-cond-list">
                  <div className="crm-leads-cond-row">
                    <input
                      className="crm-leads-cond-field"
                      defaultValue="First Name"
                    />
                    <input
                      className="crm-leads-cond-value"
                      placeholder="is not empty"
                    />
                    <button className="crm-leads-cond-remove">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <button className="crm-leads-cond-add">
                  + Add another condition
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT EDIT DRAWER */}
        {editLead && (
          <div
            className="crm-leads-edit-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="crm-leads-edit-header">
              <div className="crm-leads-edit-avatar">
                {editLead.firstName?.[0]}
              </div>
              <div className="crm-leads-edit-header-text">
                <div className="crm-leads-edit-email">{editLead.email}</div>
                <div className="crm-leads-edit-badge">Lead details</div>
              </div>
              <button
                className="crm-leads-edit-close"
                onClick={closeEdit}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <div className="crm-leads-edit-tabs">Lead Details</div>

            <div className="crm-leads-edit-body">
              <div className="crm-leads-edit-field">
                <label>First Name</label>
                <input
                  value={editLead.firstName}
                  onChange={(e) =>
                    handleEditChange("firstName", e.target.value)
                  }
                />
              </div>

              <div className="crm-leads-edit-field">
                <label>Last Name</label>
                <input
                  value={editLead.lastName}
                  onChange={(e) =>
                    handleEditChange("lastName", e.target.value)
                  }
                />
              </div>

              <div className="crm-leads-edit-field">
                <label>Email</label>
                <input
                  value={editLead.email}
                  onChange={(e) => handleEditChange("email", e.target.value)}
                />
              </div>

              <div className="crm-leads-edit-field">
                <label>Title</label>
                <input
                  value={editLead.title}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                />
              </div>

              <div className="crm-leads-edit-field">
                <label>Company</label>
                <input
                  value={editLead.company}
                  onChange={(e) => handleEditChange("company", e.target.value)}
                />
              </div>

              <div className="crm-leads-edit-variable-block">
                <button className="crm-leads-edit-add-var">
                  + Add custom variable
                </button>

                <div className="crm-leads-edit-variable-actions">
                  <button
                    className="crm-leads-edit-cancel"
                    type="button"
                    onClick={closeEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="crm-leads-edit-save"
                    type="button"
                    onClick={handleSaveLead}
                  >
                    <Check size={14} style={{ marginRight: 4 }} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
