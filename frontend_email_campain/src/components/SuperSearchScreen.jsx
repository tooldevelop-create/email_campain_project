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

export default function SuperSearchScreen() {
  const [openFilter, setOpenFilter] = useState(""); // screenshot: default all closed
  const [skipOwned, setSkipOwned] = useState(false); // screenshot: toggle off/grey

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
            <button className="ss-mini-icon-btn" type="button" title="Open in new tab">
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
                  onClick={() => setOpenFilter((prev) => (prev === f.key ? "" : f.key))}
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
            <div className="ss-big-col">
              <div className="ss-big-head">
                <Bookmark size={16} className="ss-big-ico" />
                <span>Saved Searches</span>
              </div>
              <div className="ss-big-empty">No saved searches</div>
            </div>

            <div className="ss-big-divider" />

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
    </div>
  );
}
