// src/components/AnalyticsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/AnalyticsPage.css";

import {
  Share2,
  SlidersHorizontal,
  CalendarDays,
  Zap,
  Play,
  Pause,
  CheckCircle2,
  Check,
  BarChart3,
  LineChart,
  MoreHorizontal,
  Download,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ───── Helper: download CSV for a single campaign row ───── */

function downloadCampaignCsv(row) {
  if (typeof document === "undefined") return;

  const headers = [
    "Campaign",
    "Sequence started",
    "Opened",
    "Replied",
    "Opportunities",
  ];

  const values = [
    row.name,
    row.sequenceStarted,
    row.opened,
    row.replied,
    row.opportunities,
  ];

  const csvLines = [headers.join(","), values.join(",")];
  const csvContent = csvLines.join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${row.name || "campaign"}-analytics.csv`.replace(/\s+/g, "-")
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ───── Top metric cards data ───── */

const METRICS = [
  { key: "sent", label: "Total sent", value: "2", color: "#facc15" },
  { key: "open", label: "Open rate", value: "0%", color: "#3b82f6" },
  { key: "click", label: "Click rate", value: "0%", color: "#0f172a" },
  { key: "reply", label: "Reply rate", value: "0%", color: "#a855f7" },
  { key: "opp", label: "Opportunities", value: "0 | $0", color: "#22c55e" },
];

/* ───── Status filter dropdown items ───── */

const STATUS_FILTER_ITEMS = [
  { key: "all", label: "All statuses", icon: Zap },
  { key: "active", label: "Active", icon: Play },
  { key: "paused", label: "Paused", icon: Pause },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
];

/* ───── Date range dropdown options ───── */

const RANGE_OPTIONS = [
  "Last 7 days",
  "Month to date",
  "Last 4 weeks",
  "Last 3 months",
  "Last 6 months",
  "Last 12 months",
  "Custom",
];

/* ───── Chart data (dummy) ───── */

const CHART_DATA = [
  {
    label: "30 Oct",
    sent: 0,
    totalOpens: 0,
    uniqueOpens: 0,
    totalReplies: 0,
    totalClicks: 0,
    uniqueClicks: 0,
  },
  {
    label: "01 Nov",
    sent: 0,
    totalOpens: 0,
    uniqueOpens: 0,
    totalReplies: 0,
    totalClicks: 0,
    uniqueClicks: 0,
  },
  {
    label: "03 Nov",
    sent: 0,
    totalOpens: 0,
    uniqueOpens: 0,
    totalReplies: 0,
    totalClicks: 0,
    uniqueClicks: 0,
  },
  {
    label: "05 Nov",
    sent: 2,
    totalOpens: 0,
    uniqueOpens: 0,
    totalReplies: 0,
    totalClicks: 0,
    uniqueClicks: 0,
  },
  {
    label: "08 Nov",
    sent: 0,
    totalOpens: 0,
    uniqueOpens: 0,
    totalReplies: 0,
    totalClicks: 0,
    uniqueClicks: 0,
  },
  {
    label: "11 Nov",
    sent: 0,
    totalOpens: 0,
    uniqueOpens: 0,
    totalReplies: 0,
    totalClicks: 0,
    uniqueClicks: 0,
  },
  {
    label: "13 Nov",
    sent: 0,
    totalOpens: 0,
    uniqueOpens: 0,
    totalReplies: 0,
    totalClicks: 0,
    uniqueClicks: 0,
  },
];

/* ───── Chart series config (legend + series) ───── */

const CHART_SERIES = [
  { key: "sent", label: "Sent", dotClass: "ana-dot-sent", kind: "sent" },
  {
    key: "totalOpens",
    label: "Total opens",
    dotClass: "ana-dot-total-opens",
    kind: "line",
  },
  {
    key: "uniqueOpens",
    label: "Unique opens",
    dotClass: "ana-dot-unique-opens",
    kind: "line",
  },
  {
    key: "totalReplies",
    label: "Total replies",
    dotClass: "ana-dot-total-replies",
    kind: "line",
  },
  {
    key: "totalClicks",
    label: "Total clicks",
    dotClass: "ana-dot-total-clicks",
    kind: "line",
  },
  {
    key: "uniqueClicks",
    label: "Unique clicks",
    dotClass: "ana-dot-unique-clicks",
    kind: "line",
  },
];

/* ───── Bottom tables (dummy rows) ───── */

const CAMPAIGN_ROWS = [
  {
    id: 1,
    name: "Vishnuuu",
    status: "Paused",
    sequenceStarted: 2,
    opened: 0,
    replied: 0,
    opportunities: 0,
  },
];

const ACCOUNT_ROWS = [
  {
    id: 1,
    account: "akriti@ecoplastics.in",
    contacted: 2,
    opened: 0,
    replied: 0,
    score: 0,
  },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();

  /* ── Top-right popover states ── */
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  /* ── Filter dropdowns ── */
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");

  const [rangeOpen, setRangeOpen] = useState(false);
  const [rangeSearch, setRangeSearch] = useState("");
  const [activeRange, setActiveRange] = useState("Last 4 weeks");

  /* ── Metric settings dropdown ── */
  const [metricMenuOpen, setMetricMenuOpen] = useState(false);
  const [metricSearch, setMetricSearch] = useState("");
  const [includeAutoReplies, setIncludeAutoReplies] = useState(true);

  const [metricVisibility, setMetricVisibility] = useState(() =>
    METRICS.reduce((acc, m) => {
      acc[m.key] = true;
      return acc;
    }, {})
  );

  /* ── Chart series visibility (legend toggle) ── */
  const [seriesVisibility, setSeriesVisibility] = useState(() =>
    CHART_SERIES.reduce((acc, s) => {
      acc[s.key] = true;
      return acc;
    }, {})
  );

  /* ── Bottom tabs: Campaign / Account ── */
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState("campaign");

  /* ── Actions menu (3 dots) ── */
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const closeAllPopovers = () => {
    setCreditsOpen(false);
    setOrgOpen(false);
    setFilterOpen(false);
    setRangeOpen(false);
    setMetricMenuOpen(false);
    setOpenActionMenuId(null);
  };

  /** Root click handler – actions wrapper ke andar click pe close mat karo */
  const handleMainClick = (e) => {
    if (e.target.closest(".ana-actions-wrapper")) return;
    closeAllPopovers();
  };

  const visibleMetrics = METRICS.filter((m) => metricVisibility[m.key]);

  const filteredStatusItems = STATUS_FILTER_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const filteredRanges = RANGE_OPTIONS.filter((label) =>
    label.toLowerCase().includes(rangeSearch.toLowerCase())
  );

  const filteredMetricItems = [
    { key: "auto", label: "Include auto replies" },
    ...METRICS,
  ].filter((item) =>
    item.label.toLowerCase().includes(metricSearch.toLowerCase())
  );

  /* real handlers */

  const handleDownloadCampaignCsv = (row) => {
    downloadCampaignCsv(row);
  };

  const handleShareCampaign = (row) => {
    console.log("Share campaign:", row);
  };

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main" onClick={handleMainClick}>
        {/* ───────── TOP BAR ───────── */}
        <header className="ss-topbar">
          <div className="ss-top-left">
            <h1 className="ss-title">Analytics</h1>
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
                onClick={() => {
                  setOrgOpen((o) => !o);
                }}
              >
                My Organization ▾
              </button>

              {orgOpen && (
                <div className="uni-org-dropdown">
                  <div className="uni-org-search">
                    <input placeholder="Search" />
                  </div>

                  <button
                    className="uni-org-item uni-org-item-active"
                    onClick={() => navigate("/copilot")}
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

        {/* ───────── PAGE BODY ───────── */}
        <div className="ana-page">
          <div className="ana-inner">
            {/* ===== Controls row ===== */}
            <div className="ana-controls-row">
              <div className="ana-controls-left" />

              <div className="ana-controls-right">
                <button className="ana-chip-btn">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>

                {/* Filter dropdown (Statuses) */}
                <div
                  className="ana-chip-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="ana-chip-btn"
                    onClick={() => {
                      setFilterOpen((o) => !o);
                      setRangeOpen(false);
                      setMetricMenuOpen(false);
                    }}
                  >
                    <SlidersHorizontal size={16} />
                    <span>Filter</span>
                    <span className="ana-caret">▾</span>
                  </button>

                  {filterOpen && (
                    <div className="ana-dd ana-dd-wide">
                      <div className="ana-dd-search">
                        <input
                          placeholder="Search..."
                          value={filterSearch}
                          onChange={(e) => setFilterSearch(e.target.value)}
                        />
                      </div>

                      {filteredStatusItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeStatusFilter === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            className={
                              "ana-dd-row" + (active ? " ana-dd-row-active" : "")
                            }
                            onClick={() => setActiveStatusFilter(item.key)}
                          >
                            <div className="ana-dd-left">
                              <Icon className="ana-dd-icon-status" size={16} />
                              <span>{item.label}</span>
                            </div>
                            <div className="ana-dd-right">
                              {active && (
                                <Check
                                  size={16}
                                  className="ana-dd-check-icon"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Date Range dropdown */}
                <div
                  className="ana-chip-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="ana-chip-btn"
                    onClick={() => {
                      setRangeOpen((o) => !o);
                      setFilterOpen(false);
                      setMetricMenuOpen(false);
                    }}
                  >
                    <CalendarDays size={16} />
                    <span>{activeRange}</span>
                    <span className="ana-caret">▾</span>
                  </button>

                  {rangeOpen && (
                    <div className="ana-dd ana-dd-wide">
                      <div className="ana-dd-search">
                        <input
                          placeholder="Search..."
                          value={rangeSearch}
                          onChange={(e) => setRangeSearch(e.target.value)}
                        />
                      </div>

                      {filteredRanges.map((label) => (
                        <button
                          key={label}
                          type="button"
                          className={
                            "ana-dd-row" +
                            (activeRange === label ? " ana-dd-row-active" : "")
                          }
                          onClick={() => setActiveRange(label)}
                        >
                          <div className="ana-dd-left">
                            <span>{label}</span>
                          </div>
                          <div className="ana-dd-right">
                            {activeRange === label && (
                              <Check
                                size={16}
                                className="ana-dd-check-icon"
                              />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Metrics dropdown (settings / gear) */}
                <div
                  className="ana-chip-wrapper"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="ana-icon-btn"
                    onClick={() => {
                      setMetricMenuOpen((o) => !o);
                      setFilterOpen(false);
                      setRangeOpen(false);
                    }}
                  >
                    <span className="ana-icon-gear">⚙</span>
                  </button>

                  {metricMenuOpen && (
                    <div className="ana-dd ana-dd-wide ana-dd-metrics">
                      <div className="ana-dd-search">
                        <input
                          placeholder="Search..."
                          value={metricSearch}
                          onChange={(e) => setMetricSearch(e.target.value)}
                        />
                      </div>

                      {filteredMetricItems.map((item) => {
                        if (item.key === "auto") {
                          return (
                            <button
                              key="auto"
                              type="button"
                              className={
                                "ana-dd-row" +
                                (includeAutoReplies
                                  ? " ana-dd-row-active"
                                  : "")
                              }
                              onClick={() =>
                                setIncludeAutoReplies((v) => !v)
                              }
                            >
                              <div className="ana-dd-left">
                                <span>Include auto replies</span>
                              </div>
                              <div className="ana-dd-right">
                                {includeAutoReplies && (
                                  <Check
                                    size={16}
                                    className="ana-dd-check-icon"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        }

                        const activeMetric = metricVisibility[item.key];
                        return (
                          <button
                            key={item.key}
                            type="button"
                            className={
                              "ana-dd-row" +
                              (activeMetric ? " ana-dd-row-active" : "")
                            }
                            onClick={() =>
                              setMetricVisibility((prev) => ({
                                ...prev,
                                [item.key]: !prev[item.key],
                              }))
                            }
                          >
                            <div className="ana-dd-left">
                              <span>{item.label}</span>
                            </div>
                            <div className="ana-dd-right">
                              {activeMetric && (
                                <Check
                                  size={16}
                                  className="ana-dd-check-icon"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== Metric summary cards ===== */}
            <section className="ana-metrics-row">
              {visibleMetrics.map((m) => (
                <article key={m.key} className="ana-metric-card">
                  <div className="ana-metric-header">
                    <span
                      className="ana-metric-dot"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="ana-metric-label">{m.label}</span>
                    <span className="ana-metric-info">•</span>
                  </div>
                  <div className="ana-metric-value">{m.value}</div>
                </article>
              ))}
            </section>

            {/* ===== Combined Chart + Bottom analytics CARD ===== */}
            <section className="ana-chart-card">
              {/* --- Chart area + legend --- */}
              <div className="ana-chart-section">
                <div className="ana-chart-legend">
                  {CHART_SERIES.map((s) => {
                    const active = seriesVisibility[s.key];
                    return (
                      <button
                        key={s.key}
                        type="button"
                        className={
                          "ana-legend-item" +
                          (active ? "" : " ana-legend-item-disabled")
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeriesVisibility((prev) => ({
                            ...prev,
                            [s.key]: !prev[s.key],
                          }));
                        }}
                      >
                        <span
                          className={`ana-legend-dot ${s.dotClass}`}
                        />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="ana-chart-frame">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={CHART_DATA}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="sentGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                          <stop
                            offset="100%"
                            stopColor="#1d4ed8"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#111827"
                        strokeDasharray="0"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, "dataMax + 0.5"]}
                        allowDecimals={false}
                      />

                      <Tooltip
                        cursor={{ stroke: "#374151", strokeWidth: 1 }}
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #111827",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "#e5e7eb",
                        }}
                        labelStyle={{ color: "#e5e7eb", marginBottom: 4 }}
                      />

                      {/* Total opens */}
                      {seriesVisibility.totalOpens && (
                        <Area
                          type="monotone"
                          dataKey="totalOpens"
                          stroke="#eab308"
                          strokeWidth={2}
                          fill="transparent"
                          dot={false}
                          activeDot={false}
                        />
                      )}

                      {/* Unique opens */}
                      {seriesVisibility.uniqueOpens && (
                        <Area
                          type="monotone"
                          dataKey="uniqueOpens"
                          stroke="#22c55e"
                          strokeWidth={2}
                          fill="transparent"
                          dot={false}
                          activeDot={false}
                        />
                      )}

                      {/* Total replies */}
                      {seriesVisibility.totalReplies && (
                        <Area
                          type="monotone"
                          dataKey="totalReplies"
                          stroke="#a855f7"
                          strokeWidth={2}
                          fill="transparent"
                          dot={false}
                          activeDot={false}
                        />
                      )}

                      {/* Total clicks */}
                      {seriesVisibility.totalClicks && (
                        <Area
                          type="monotone"
                          dataKey="totalClicks"
                          stroke="#6b7280"
                          strokeWidth={2}
                          fill="transparent"
                          dot={false}
                          activeDot={false}
                        />
                      )}

                      {/* Unique clicks */}
                      {seriesVisibility.uniqueClicks && (
                        <Area
                          type="monotone"
                          dataKey="uniqueClicks"
                          stroke="#f97316"
                          strokeWidth={2}
                          fill="transparent"
                          dot={false}
                          activeDot={false}
                        />
                      )}

                      {/* Main Sent area */}
                      {seriesVisibility.sent && (
                        <Area
                          type="monotone"
                          dataKey="sent"
                          stroke="#0ea5e9"
                          strokeWidth={0}
                          fill="url(#sentGradient)"
                          activeDot={{ r: 4, fill: "#0ea5e9" }}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* --- Bottom analytics: Campaign / Account --- */}
              <div className="ana-bottom">
                <div className="ana-bottom-tabs">
                  <button
                    type="button"
                    className={
                      "ana-bottom-tab" +
                      (activeAnalyticsTab === "campaign"
                        ? " ana-bottom-tab-active"
                        : "")
                    }
                    onClick={() => setActiveAnalyticsTab("campaign")}
                  >
                    <BarChart3 size={14} className="ana-bottom-tab-icon" />
                    <span>Campaign Analytics</span>
                  </button>

                  <button
                    type="button"
                    className={
                      "ana-bottom-tab" +
                      (activeAnalyticsTab === "account"
                        ? " ana-bottom-tab-active"
                        : "")
                    }
                    onClick={() => setActiveAnalyticsTab("account")}
                  >
                    <LineChart size={14} className="ana-bottom-tab-icon" />
                    <span>Account Analytics</span>
                  </button>
                </div>

                {activeAnalyticsTab === "campaign" ? (
                  <div className="ana-bottom-section">
                    <div className="ana-bottom-title-row">
                      <div className="ana-bottom-title">
                        Campaign analytics
                      </div>
                    </div>

                    <div className="ana-table-wrapper">
                      <table className="ana-table">
                        <thead className="ana-table-head">
                          <tr>
                            <th>Campaign</th>
                            <th>Sequence started</th>
                            <th>Opened</th>
                            <th>Replied</th>
                            <th>Opportunities</th>
                            <th className="ana-table-actions">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CAMPAIGN_ROWS.map((row) => (
                            <tr key={row.id} className="ana-table-row">
                              <td>
                                <div className="ana-campaign-cell">
                                  <span className="ana-campaign-name">
                                    {row.name}
                                  </span>
                                  <span className="ana-pill ana-pill-completed">
                                    {row.status}
                                  </span>
                                </div>
                              </td>
                              <td className="ana-table-cell-center">
                                {row.sequenceStarted}
                              </td>
                              <td className="ana-table-cell-center">
                                {row.opened}
                              </td>
                              <td className="ana-table-cell-center">
                                {row.replied}
                              </td>
                              <td className="ana-table-cell-center">
                                {row.opportunities}
                              </td>
                              <td className="ana-table-actions-cell">
                                <div className="ana-actions-wrapper">
                                  <button className="ana-table-icon-btn">
                                    <Play size={14} />
                                  </button>
                                  <button
                                    className="ana-table-icon-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionMenuId((prev) =>
                                        prev === row.id ? null : row.id
                                      );
                                    }}
                                  >
                                    <MoreHorizontal size={14} />
                                  </button>

                                  {openActionMenuId === row.id && (
                                    <div
                                      className="ana-actions-menu"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        type="button"
                                        className="ana-actions-item"
                                        onClick={() => {
                                          handleDownloadCampaignCsv(row);
                                          setOpenActionMenuId(null);
                                        }}
                                      >
                                        <Download
                                          size={14}
                                          className="ana-actions-icon"
                                        />
                                        <span>Download analytics CSV</span>
                                      </button>
                                      <button
                                        type="button"
                                        className="ana-actions-item"
                                        onClick={() => {
                                          handleShareCampaign(row);
                                          setOpenActionMenuId(null);
                                        }}
                                      >
                                        <Share2
                                          size={14}
                                          className="ana-actions-icon"
                                        />
                                        <span>Share Campaign</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="ana-bottom-section">
                    <div className="ana-bottom-title-row">
                      <div className="ana-bottom-title">
                        Account performance
                      </div>
                    </div>

                    <div className="ana-table-wrapper">
                      <table className="ana-table">
                        <thead className="ana-table-head">
                          <tr>
                            <th>Sending account</th>
                            <th>Contacted</th>
                            <th>Opened</th>
                            <th>Replied</th>
                            <th>Combined score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ACCOUNT_ROWS.map((row) => (
                            <tr key={row.id} className="ana-table-row">
                              <td>{row.account}</td>
                              <td className="ana-table-cell-center">
                                {row.contacted}
                              </td>
                              <td className="ana-table-cell-center">
                                {row.opened}
                              </td>
                              <td className="ana-table-cell-center">
                                {row.replied}
                              </td>
                              <td className="ana-table-cell-center">
                                {row.score}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
