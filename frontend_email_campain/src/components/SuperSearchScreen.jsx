import React, { useState } from "react";

const FILTERS = [
  "Job Titles",
  "Location",
  "Industry and Keywords",
  "Employees",
  "Revenue",
  "Lookalike domain",
  "Domains",
];

export default function SuperSearchScreen() {
  const [openFilter, setOpenFilter] = useState("Job Titles");
  const [skipOwned, setSkipOwned] = useState(true);

  return (
    <div className="ss-body">
      {/* LEFT FILTERS COLUMN */}
      <section className="ss-filters">
        <div className="ss-filters-header">
          <h2>Filters</h2>
          <div className="ss-filters-actions">
            <button className="ss-square-btn" title="Collapse">
              ▢
            </button>
            <button className="ss-square-btn" title="Pin">
              📌
            </button>
          </div>
        </div>

        <div className="ss-toggle-row">
          <span>Skip already owned</span>
          <button
            className={"ss-switch" + (skipOwned ? " ss-switch-on" : "")}
            onClick={() => setSkipOwned((v) => !v)}
          >
            <span className="ss-switch-knob" />
          </button>
        </div>

        <div className="ss-filter-list">
          {FILTERS.map((f) => {
            const open = openFilter === f;
            return (
              <div
                key={f}
                className={
                  "ss-filter-item" + (open ? " ss-filter-item-open" : "")
                }
              >
                <button
                  className="ss-filter-header"
                  onClick={() =>
                    setOpenFilter((prev) => (prev === f ? "" : f))
                  }
                >
                  <span className="ss-filter-icon">⚙</span>
                  <span>{f}</span>
                  <span className="ss-filter-arrow">{open ? "▾" : "▸"}</span>
                </button>

                {open && (
                  <div className="ss-filter-body">
                    <p className="ss-filter-hint">
                      Configure <strong>{f}</strong> filter here.
                    </p>
                    <input
                      className="ss-filter-input"
                      placeholder={`Type to refine ${f.toLowerCase()}...`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MAIN RIGHT PANEL */}
      <section className="ss-main-panel">
        <div className="ss-main-inner">
          <h2 className="ss-main-heading">Start your search with AI</h2>
          <p className="ss-main-sub">
            E.g. Engineers in New York in software companies with more than 500
            employees
          </p>

          <div className="ss-search-bar">
            <div className="ss-search-icon">🔍</div>
            <input
              className="ss-search-input"
              placeholder="Describe your ideal leads with natural language..."
            />
            <button className="ss-search-btn">⭐ AI Search</button>
          </div>

          <div className="ss-cards-row">
            <div className="ss-card">
              <div className="ss-card-header">
                <span className="ss-card-icon">💾</span>
                <span className="ss-card-title">Saved Searches</span>
              </div>
              <p className="ss-card-text">No saved searches</p>
            </div>

            <div className="ss-card">
              <div className="ss-card-header">
                <span className="ss-card-icon">⏱</span>
                <span className="ss-card-title">Recent Searches</span>
              </div>
              <p className="ss-card-text">No saved searches</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
