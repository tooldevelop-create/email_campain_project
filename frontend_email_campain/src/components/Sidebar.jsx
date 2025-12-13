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
} from "lucide-react";

/**
 * URL se active key nikalna
 * IMPORTANT:
 *  - /crm, /crm/opportunities, /crm/leads, /crm/... sab ko "inbox" se map kar rahe hain
 *    taaki hamesha lightning + badge (CRM icon) hi active dikhe.
 */
function getKeyFromPath(pathname) {
  if (pathname === "/copilot") return "copilot";
  if (pathname === "/supersearch") return "supersearch";
  if (pathname === "/email-accounts") return "email";
  if (pathname === "/campaigns") return "campaigns";
  if (pathname === "/unibox") return "unibox";
  if (pathname === "/analytics") return "analytics";

  // 🔵 CRM ke saare routes
  if (pathname.startsWith("/crm")) return "inbox";

  // fallback (agar kuch aur ho)
  return "campaigns";
}

export default function Sidebar({ inboxCount }) {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(
    getKeyFromPath(location.pathname)
  );

  useEffect(() => {
    setActiveKey(getKeyFromPath(location.pathname));
  }, [location.pathname]);

  const btnClass = (key, extra = "") =>
    "ss-icon-btn" +
    (activeKey === key ? " ss-icon-btn-active" : "") +
    (extra ? " " + extra : "");

  // ✅ CRM badge:
  //    1) agar prop aaya hai to wahi use karo
  //    2) nahi aaya to default 22 (aapke mock inbox ke mails)
  const crmBadgeValue =
    typeof inboxCount === "number" && !Number.isNaN(inboxCount)
      ? inboxCount
      : 22;

  return (
    <aside className="ss-sidebar">
      {/* ========== TOP SECTION ========== */}
      <div className="ss-sidebar-top">
        {/* Logo */}
        <div className="ss-logo">
          <span className="ss-logo-icon">⚡</span>
        </div>

        {/* 1. Star = Copilot */}
        <Link
          to="/copilot"
          className={btnClass("copilot")}
          title="Instantly Copilot"
          onClick={() => setActiveKey("copilot")}
        >
          <Star className="ss-icon" />
        </Link>

        {/* 2. Search = SuperSearch */}
        <Link
          to="/supersearch"
          className={btnClass("supersearch")}
          title="SuperSearch"
          onClick={() => setActiveKey("supersearch")}
        >
          <Search className="ss-icon" />
        </Link>

        {/* 3. Mail = Email Accounts */}
        <Link
          to="/email-accounts"
          className={btnClass("email")}
          title="Email Accounts"
          onClick={() => setActiveKey("email")}
        >
          <Mail className="ss-icon" />
        </Link>

        {/* 4. Paper plane = Campaigns */}
        <Link
          to="/campaigns"
          className={btnClass("campaigns")}
          title="Campaigns"
          onClick={() => setActiveKey("campaigns")}
        >
          <Send className="ss-icon" />
        </Link>

        {/* 5. Linked squares = Unibox */}
        <Link
          to="/unibox"
          className={btnClass("unibox")}
          title="Unibox"
          onClick={() => setActiveKey("unibox")}
        >
          <Copy className="ss-icon" />
        </Link>

        {/* 6. Graph = Analytics */}
        <Link
          to="/analytics"
          className={btnClass("analytics")}
          title="Analytics"
          onClick={() => setActiveKey("analytics")}
        >
          <LineChart className="ss-icon" />
        </Link>

        {/* 7. Lightning + badge = CRM */}
        <Link
          to="/crm"
          className={btnClass("inbox", "ss-icon-btn-notif")}
          title="CRM"
          onClick={() => setActiveKey("inbox")}
        >
          <Zap className="ss-icon" />
          {/* badge sirf tab dikhana jab value > 0 ho */}
          {crmBadgeValue > 0 && (
            <span className="ss-badge">{crmBadgeValue}</span>
          )}
        </Link>
      </div>

      {/* ========== BOTTOM SECTION ========== */}
      <div className="ss-sidebar-bottom">
        <button
          className={btnClass("labs")}
          title="Labs"
          onClick={() => setActiveKey("labs")}
        >
          <Rocket className="ss-icon" />
        </button>

        <button
          className={btnClass("dashboard")}
          title="Dashboard"
          onClick={() => setActiveKey("dashboard")}
        >
          <Monitor className="ss-icon" />
        </button>

        <button
          className={btnClass("workspaces")}
          title="Workspaces"
          onClick={() => setActiveKey("workspaces")}
        >
          <CircleDashed className="ss-icon" />
        </button>

        <button
          className={btnClass("support")}
          title="Support / Chat"
          onClick={() => setActiveKey("support")}
        >
          <MessageCircle className="ss-icon" />
        </button>
      </div>
    </aside>
  );
}
