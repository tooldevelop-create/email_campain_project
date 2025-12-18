// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

import {
  Star,
  Search,
  Mail,
  Send,
  Copy,
  LineChart,
  Zap,
  Rocket,
  Monitor,
  CircleDashed,
  MessageCircle,
  Radar, // ✅ add
} from "lucide-react";

function getKeyFromPath(pathname) {
  if (pathname === "/copilot" || pathname.startsWith("/copilot/"))
    return "copilot";

  if (pathname === "/supersearch" || pathname.startsWith("/supersearch/"))
    return "supersearch";

  if (pathname === "/email-accounts" || pathname.startsWith("/email-accounts/"))
    return "email";

  if (pathname === "/campaigns" || pathname.startsWith("/campaigns/"))
    return "campaigns";

  if (pathname === "/unibox" || pathname.startsWith("/unibox/"))
    return "unibox";

  if (pathname === "/analytics" || pathname.startsWith("/analytics/"))
    return "analytics";

  // ✅ Website Visitors
  if (pathname === "/website-visitors" || pathname.startsWith("/website-visitors/") )
    return "website-visitors";

  if (pathname.startsWith("/crm")) return "inbox";

  return "copilot";
}

export default function Sidebar({ inboxCount }) {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(getKeyFromPath(location.pathname));

  useEffect(() => {
    setActiveKey(getKeyFromPath(location.pathname));
  }, [location.pathname]);

  const btnClass = (key, extra = "") =>
    "ss-icon-btn" +
    (activeKey === key ? " ss-icon-btn-active" : "") +
    (extra ? " " + extra : "");

  const crmBadgeValue =
    typeof inboxCount === "number" && !Number.isNaN(inboxCount)
      ? inboxCount
      : 22;

  return (
    <aside className="ss-sidebar">
      <div className="ss-sidebar-top">
        <div className="ss-logo">
          <span className="ss-logo-icon">⚡</span>
        </div>

        <Link
          to="/copilot"
          className={btnClass("copilot")}
          data-tip="Instantly Copilot"
          onClick={() => setActiveKey("copilot")}
        >
          <Star className="ss-icon" />
        </Link>

        <Link
          to="/supersearch"
          className={btnClass("supersearch")}
          data-tip="SuperSearch"
          onClick={() => setActiveKey("supersearch")}
        >
          <Search className="ss-icon" />
        </Link>

        <Link
          to="/email-accounts"
          className={btnClass("email")}
          data-tip="Email Accounts"
          onClick={() => setActiveKey("email")}
        >
          <Mail className="ss-icon" />
        </Link>

        <Link
          to="/campaigns"
          className={btnClass("campaigns")}
          data-tip="Campaigns"
          onClick={() => setActiveKey("campaigns")}
        >
          <Send className="ss-icon" />
        </Link>

        <Link
          to="/unibox"
          className={btnClass("unibox")}
          data-tip="Unibox"
          onClick={() => setActiveKey("unibox")}
        >
          <Copy className="ss-icon" />
        </Link>

        <Link
          to="/analytics"
          className={btnClass("analytics")}
          data-tip="Analytics"
          onClick={() => setActiveKey("analytics")}
        >
          <LineChart className="ss-icon" />
        </Link>

        <Link
          to="/crm"
          className={btnClass("inbox", "ss-icon-btn-notif")}
          data-tip="CRM"
          onClick={() => setActiveKey("inbox")}
        >
          <Zap className="ss-icon" />
          {crmBadgeValue > 0 && <span className="ss-badge">{crmBadgeValue}</span>}
        </Link>
      </div>

      <div className="ss-sidebar-bottom">
        {/* ✅ Website Visitors icon (like screenshot bottom UFO) */}
        <Link
          to="/website-visitors"
          className={btnClass("website-visitors")}
          data-tip="Website Visitors"
          onClick={() => setActiveKey("website-visitors")}
        >
          <Radar className="ss-icon" />
        </Link>

        <button
          className={btnClass("labs")}
          data-tip="Labs"
          onClick={() => setActiveKey("labs")}
        >
          <Rocket className="ss-icon" />
        </button>

        <button
          className={btnClass("dashboard")}
          data-tip="Dashboard"
          onClick={() => setActiveKey("dashboard")}
        >
          <Monitor className="ss-icon" />
        </button>

        <button
          className={btnClass("workspaces")}
          data-tip="Workspaces"
          onClick={() => setActiveKey("workspaces")}
        >
          <CircleDashed className="ss-icon" />
        </button>

        <button
          className={btnClass("support")}
          data-tip="Support / Chat"
          onClick={() => setActiveKey("support")}
        >
          <MessageCircle className="ss-icon" />
        </button>
      </div>
    </aside>
  );
}