import React, { useState } from "react";
import {
  Save,
  ExternalLink,
  FastForward,
  ChevronDown,
  Search,
  Sparkles,
  Briefcase,
  MapPin,
  Building2,
  Users,
  DollarSign,
  Radar,
  Globe2,
  Bookmark,
  Clock3,
  X,
} from "lucide-react";

const FILTERS = [
  { key: "Job Titles", icon: Briefcase },
  { key: "Location", icon: MapPin },
  { key: "Industry and Keywords", icon: Building2 },
  { key: "Employees", icon: Users },
  { key: "Revenue", icon: DollarSign },
  { key: "Lookalike domain", icon: Radar },
  { key: "Domains", icon: Globe2, rightIcon: "upload" },
];

function SavedSearchesIllustration() {
  return (
    <div className="ss-right-illus" aria-hidden="true">
      <svg viewBox="0 0 420 280" width="100%" height="100%">
        {/* soft background */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.25" />
          </filter>

          <linearGradient id="paper" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.96)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.90)" />
          </linearGradient>

          <linearGradient id="paper2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.92)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.86)" />
          </linearGradient>
        </defs>

        {/* back card */}
        <rect
          x="120"
          y="72"
          rx="16"
          ry="16"
          width="210"
          height="150"
          fill="url(#paper2)"
          opacity="0.92"
          filter="url(#shadow)"
        />

        {/* front card */}
        <rect
          x="95"
          y="55"
          rx="18"
          ry="18"
          width="240"
          height="170"
          fill="url(#paper)"
          filter="url(#shadow)"
        />

        {/* avatar circle */}
        <circle cx="150" cy="98" r="24" fill="rgba(148,163,184,0.35)" />
        <circle cx="150" cy="98" r="20" fill="rgba(148,163,184,0.22)" />
        {/* avatar body */}
        <circle cx="150" cy="92" r="7" fill="rgba(59,130,246,0.55)" />
        <path
          d="M137 118c5-11 21-11 26 0"
          fill="none"
          stroke="rgba(59,130,246,0.55)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* small check */}
        <circle cx="186" cy="78" r="12" fill="rgba(244,114,182,0.85)" />
        <path
          d="M181 78l3 3 7-8"
          fill="none"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* text lines */}
        <rect x="130" y="134" width="160" height="10" rx="5" fill="rgba(148,163,184,0.35)" />
        <rect x="130" y="154" width="140" height="10" rx="5" fill="rgba(148,163,184,0.28)" />
        <rect x="130" y="174" width="170" height="10" rx="5" fill="rgba(148,163,184,0.22)" />

        {/* right tiny buttons */}
        <circle cx="312" cy="92" r="10" fill="rgba(148,163,184,0.22)" />
        <circle cx="338" cy="92" r="10" fill="rgba(148,163,184,0.22)" />
        <path
          d="M309 92h6"
          stroke="rgba(15,23,42,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M336 89l4 6M340 89l-4 6"
          stroke="rgba(15,23,42,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* magnifier */}
        <circle
          cx="255"
          cy="165"
          r="44"
          fill="none"
          stroke="rgba(245,158,11,0.9)"
          strokeWidth="10"
        />
        <path
          d="M286 196l42 42"
          stroke="rgba(245,158,11,0.9)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <circle cx="255" cy="165" r="28" fill="rgba(245,158,11,0.08)" />
      </svg>
    </div>
  );
}

export default function SuperSearchScreen() {
  const [openFilter, setOpenFilter] = useState("");
  const [skipOwned, setSkipOwned] = useState(false);

  // ✅ RIGHT SLIDE PANEL
  const [savedPanelOpen, setSavedPanelOpen] = useState(false);

  return (
    <div className="ss-body">
      {/* LEFT FILTERS */}
      <aside className="ss-filters">
        <div className="ss-filters-header">
          <h2 className="ss-filters-title">Filters</h2>

          <div className="ss-filters-actions">
            <button className="ss-mini-icon-btn" type="button" title="Save">
              <Save size={16} />
            </button>
            <button
              className="ss-mini-icon-btn"
              type="button"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        <div className="ss-skip-row">
          <div className="ss-skip-left">
            <FastForward size={16} className="ss-skip-icon" />
            <span>Skip already owned</span>
          </div>

          <button
            type="button"
            className={"ss-switch" + (skipOwned ? " ss-switch-on" : "")}
            onClick={() => setSkipOwned((v) => !v)}
            aria-pressed={skipOwned}
          >
            <span className="ss-switch-knob" />
          </button>
        </div>

        <div className="ss-filter-list">
          {FILTERS.map((f) => {
            const Icon = f.icon;
            const isOpen = openFilter === f.key;

            return (
              <div key={f.key} className="ss-filter-row">
                <button
                  type="button"
                  className={"ss-filter-btn" + (isOpen ? " is-open" : "")}
                  onClick={() =>
                    setOpenFilter((prev) => (prev === f.key ? "" : f.key))
                  }
                >
                  <span className="ss-filter-left">
                    <Icon size={18} className="ss-filter-ico" />
                    <span className="ss-filter-label">{f.key}</span>
                  </span>

                  <span className="ss-filter-right">
                    {f.rightIcon === "upload" ? (
                      <span className="ss-upload-dot" title="Upload">
                        ⤴
                      </span>
                    ) : null}

                    <ChevronDown
                      size={18}
                      className={"ss-filter-chevron" + (isOpen ? " is-open" : "")}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="ss-filter-expand">
                    <div className="ss-filter-expand-inner">
                      <input
                        className="ss-filter-input"
                        placeholder={`Type to refine ${f.key.toLowerCase()}...`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* RIGHT MAIN */}
      <section className="ss-main-panel">
        <div className="ss-main-inner">
          <h2 className="ss-main-heading">Start your search with AI</h2>

          <div className="ss-search-wrap">
            <Search size={18} className="ss-search-ico" />
            <input
              className="ss-search-input"
              placeholder="E.g Engineers in New York in software companies with more than 500 empl"
            />
            <button className="ss-ai-btn" type="button">
              <Sparkles size={16} />
              <span>AI Search</span>
            </button>
          </div>

          <div className="ss-big-card">
            {/* ✅ Saved Searches clickable */}
            <button
              type="button"
              className="ss-big-col ss-big-col-btn"
              onClick={() => setSavedPanelOpen(true)}
              aria-label="Open Saved Searches"
            >
              <div className="ss-big-head">
                <Bookmark size={16} className="ss-big-ico" />
                <span>Saved Searches</span>
              </div>
              <div className="ss-big-empty">No saved searches</div>
            </button>

            <div className="ss-big-divider" />

            {/* Recent Searches */}
            <div className="ss-big-col">
              <div className="ss-big-head">
                <Clock3 size={16} className="ss-big-ico" />
                <span>Recent Searches</span>
              </div>
              <div className="ss-big-empty">No saved searches</div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ RIGHT SLIDE PANEL */}
      {savedPanelOpen && (
        <div
          className="ss-right-overlay"
          onClick={() => setSavedPanelOpen(false)}
        >
          <aside
            className="ss-right-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ss-right-top">
              <h3 className="ss-right-title">Saved Searches</h3>
              <button
                type="button"
                className="ss-right-close"
                onClick={() => setSavedPanelOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ss-right-content">
              <SavedSearchesIllustration />
              <p className="ss-right-text">Your saved searches will appear here</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
