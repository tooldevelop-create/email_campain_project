import React, { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/WebsiteVisitorsPage.css";

export default function WebsiteVisitorsPage() {
  const [range, setRange] = useState("Last 7 days");

  return (
    <div className="layout wv-layout">
      <Sidebar />

      <main className="wv-shell">
        {/* Top bar */}
        <header className="wv-topbar">
          <div className="wv-title">
            <h1>Website Visitors</h1>
          </div>

          <div className="wv-topbar-right">
            <div className="wv-credits">
              <span className="wv-coin">🪙</span>
              <span className="wv-credits-val">286</span>
              <ChevronDown size={16} className="wv-dd" />
            </div>

            <button className="wv-btn wv-btn-primary">Get All Features</button>

            <button className="wv-org">
              My Organizatio…
              <ChevronDown size={16} className="wv-dd" />
            </button>
          </div>
        </header>

        <section className="wv-body">
          {/* Left inner nav */}
          <aside className="wv-left">
            <div className="wv-left-card">
              <div className="wv-left-item wv-left-item-active">
                Website Visitors
              </div>
              <div className="wv-left-item">Setup</div>
              <div className="wv-left-item">Billing</div>
            </div>
          </aside>

          {/* Main content */}
          <section className="wv-main">
            {/* toolbar row */}
            <div className="wv-toolbar">
              <div className="wv-toolbar-left">
                <label className="wv-check">
                  <input type="checkbox" />
                  <span>0 website visitors</span>
                </label>
              </div>

              <div className="wv-toolbar-right">
                <button className="wv-ddbtn">
                  {range}
                  <ChevronDown size={16} className="wv-dd" />
                </button>

                <button className="wv-btn wv-btn-dark">
                  <SlidersHorizontal size={18} />
                  Filter
                </button>

                <button className="wv-btn wv-btn-blue">Create View</button>
              </div>
            </div>

            {/* Empty state */}
            <div className="wv-empty">
              <div className="wv-illustration">
                <VisitorsIllustration />
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

function VisitorsIllustration() {
  // Simple inline SVG “UFO + hands” style similar to screenshot
  return (
    <svg
      viewBox="0 0 520 320"
      width="520"
      height="320"
      role="img"
      aria-label="Website visitors illustration"
    >
      <defs>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* blue blob */}
      <g filter="url(#soft)">
        <path
          d="M110 170c0-80 70-140 160-140s170 55 170 145c0 88-75 135-165 135S110 255 110 170Z"
          fill="#3B82F6"
          opacity="0.92"
        />
      </g>

      {/* UFOs */}
      <g>
        <ellipse cx="270" cy="85" rx="95" ry="30" fill="#0B0F16" opacity="0.9" />
        <ellipse cx="270" cy="78" rx="90" ry="26" fill="#E5E7EB" />
        <ellipse cx="270" cy="78" rx="52" ry="14" fill="#FFFFFF" opacity="0.9" />
        <circle cx="225" cy="70" r="6" fill="#9CA3AF" />
        <circle cx="255" cy="63" r="6" fill="#9CA3AF" />
        <circle cx="295" cy="63" r="6" fill="#9CA3AF" />
        <circle cx="325" cy="70" r="6" fill="#9CA3AF" />

        <ellipse cx="400" cy="120" rx="65" ry="22" fill="#0B0F16" opacity="0.85" />
        <ellipse cx="400" cy="114" rx="60" ry="19" fill="#E5E7EB" />
        <ellipse cx="400" cy="114" rx="34" ry="10" fill="#FFFFFF" opacity="0.9" />
        <circle cx="378" cy="108" r="5" fill="#9CA3AF" />
        <circle cx="402" cy="104" r="5" fill="#9CA3AF" />
        <circle cx="425" cy="108" r="5" fill="#9CA3AF" />
      </g>

      {/* confetti squares */}
      <g opacity="0.85">
        <rect x="195" y="160" width="12" height="12" fill="#111827" />
        <rect x="245" y="190" width="10" height="10" fill="#111827" />
        <rect x="318" y="175" width="10" height="10" fill="#111827" />
        <rect x="368" y="200" width="8" height="8" fill="#111827" />
      </g>

      {/* cards */}
      <g>
        <rect x="190" y="205" width="42" height="42" rx="10" fill="#FFFFFF" />
        <path d="M205 235c10-10 18-6 25-18" stroke="#111827" strokeWidth="4" fill="none" />

        <rect x="252" y="214" width="42" height="42" rx="10" fill="#FFFFFF" />
        <path d="M265 245l18-16" stroke="#111827" strokeWidth="4" />
        <path d="M265 233l18 16" stroke="#111827" strokeWidth="4" />

        <rect x="314" y="205" width="42" height="42" rx="10" fill="#FFFFFF" />
        <path d="M327 233h18" stroke="#111827" strokeWidth="4" />
        <path d="M336 224v18" stroke="#111827" strokeWidth="4" />
      </g>

      {/* hands */}
      <g fill="#FFFFFF" stroke="#111827" strokeWidth="3">
        <path d="M150 280c8-30 5-55 18-75 12 20 12 45 8 75Z" />
        <path d="M185 285c10-38 6-62 20-85 16 22 15 52 10 85Z" />
        <path d="M225 290c8-32 6-58 18-78 12 20 12 50 8 78Z" />
        <path d="M355 290c8-32 6-58 18-78 12 20 12 50 8 78Z" />
        <path d="M395 285c10-38 6-62 20-85 16 22 15 52 10 85Z" />
        <path d="M430 280c8-30 5-55 18-75 12 20 12 45 8 75Z" />
      </g>
    </svg>
  );
}