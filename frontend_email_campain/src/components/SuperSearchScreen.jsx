import React, { useEffect, useRef, useState } from "react";
import {
  Save,
  ExternalLink,
  FastForward,
  ChevronDown,
  ChevronRight,
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
  Layers,
  BriefcaseBusiness,
} from "lucide-react";

/* ---------------- OPTIONS (demo) ---------------- */
const JOB_TITLE_OPTIONS = ["CEO", "CFO", "COO", "CMO", "CTO", "CIO", "VP", "Director", "Head", "Manager"];

const MGMT_LEVEL_OPTIONS = ["Entry level", "Mid-Senior level", "Director", "Associate", "Owner"];

const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Finance & Administration",
  "Human Resources",
  "IT & IS",
  "Marketing",
  "Sales",
  "Operations",
  "Product",
];

const LOCATION_OPTIONS = [
  "New York, US",
  "San Francisco, US",
  "London, UK",
  "Berlin, DE",
  "Dubai, AE",
  "Mumbai, IN",
  "Bangalore, IN",
  "Singapore, SG",
];

const INDUSTRY_OPTIONS = [
  "Agriculture & Mining",
  "Business Services",
  "Computers & Electronics",
  "Consumer Services",
  "Education",
  "Energy & Utilities",
  "Financial Services",
  "Government",
  "Healthcare",
  "Manufacturing",
  "Media & Entertainment",
  "Real Estate",
  "Retail",
  "Software & Internet",
  "Telecommunications",
  "Transportation",
];

/* ---------------- FILTERS ---------------- */
const FILTERS = [
  { key: "Job Titles", icon: Briefcase, type: "jobtitles" },
  { key: "Location", icon: MapPin, type: "location" },
  { key: "Industry and Keywords", icon: Building2, type: "industryKeywords" },
  { key: "Employees", icon: Users, type: "simple" },
  { key: "Revenue", icon: DollarSign, type: "simple" },
  { key: "Lookalike domain", icon: Radar, type: "simple" },
  { key: "Domains", icon: Globe2, rightIcon: "upload", type: "simple" },
];

/* ---------------- Saved Searches Illustration ---------------- */
function SavedSearchesIllustration() {
  return (
    <div className="ss-right-illus" aria-hidden="true">
      <svg viewBox="0 0 420 280" width="100%" height="100%">
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

        <rect x="120" y="72" rx="16" ry="16" width="210" height="150" fill="url(#paper2)" opacity="0.92" filter="url(#shadow)" />
        <rect x="95" y="55" rx="18" ry="18" width="240" height="170" fill="url(#paper)" filter="url(#shadow)" />

        <circle cx="150" cy="98" r="24" fill="rgba(148,163,184,0.35)" />
        <circle cx="150" cy="98" r="20" fill="rgba(148,163,184,0.22)" />
        <circle cx="150" cy="92" r="7" fill="rgba(59,130,246,0.55)" />
        <path d="M137 118c5-11 21-11 26 0" fill="none" stroke="rgba(59,130,246,0.55)" strokeWidth="5" strokeLinecap="round" />

        <circle cx="186" cy="78" r="12" fill="rgba(244,114,182,0.85)" />
        <path d="M181 78l3 3 7-8" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />

        <rect x="130" y="134" width="160" height="10" rx="5" fill="rgba(148,163,184,0.35)" />
        <rect x="130" y="154" width="140" height="10" rx="5" fill="rgba(148,163,184,0.28)" />
        <rect x="130" y="174" width="170" height="10" rx="5" fill="rgba(148,163,184,0.22)" />

        <circle cx="312" cy="92" r="10" fill="rgba(148,163,184,0.22)" />
        <circle cx="338" cy="92" r="10" fill="rgba(148,163,184,0.22)" />

        <circle cx="255" cy="165" r="44" fill="none" stroke="rgba(245,158,11,0.9)" strokeWidth="10" />
        <path d="M286 196l42 42" stroke="rgba(245,158,11,0.9)" strokeWidth="12" strokeLinecap="round" />
        <circle cx="255" cy="165" r="28" fill="rgba(245,158,11,0.08)" />
      </svg>
    </div>
  );
}

/* ---------------- Checkbox list (screenshot style) ---------------- */
function InlineCheckboxList({ options, selected, onToggle, withCaret = false }) {
  return (
    <div className="ss-inline-dd">
      <div className="ss-inline-dd-scroll">
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <label key={opt} className="ss-inline-dd-row">
              {withCaret ? <ChevronRight size={16} className="ss-inline-caret" /> : null}
              <input type="checkbox" checked={checked} onChange={() => onToggle(opt)} />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function SuperSearchScreen() {
  const wrapRef = useRef(null);

  const [openFilter, setOpenFilter] = useState(""); // top level
  const [openSub, setOpenSub] = useState(""); // nested submenu key
  const [skipOwned, setSkipOwned] = useState(false);

  // Right slide panel
  const [savedPanelOpen, setSavedPanelOpen] = useState(false);

  // Job Titles selections
  const [jtAny, setJtAny] = useState([]);
  const [jtNot, setJtNot] = useState([]);
  const [jtMgmt, setJtMgmt] = useState([]);
  const [jtDept, setJtDept] = useState([]);

  // Location selections
  const [locAny, setLocAny] = useState([]);
  const [locNot, setLocNot] = useState([]);

  // Industry & Keywords
  const [ikIndustriesOpen, setIkIndustriesOpen] = useState(false);
  const [ikKeywordsOpen, setIkKeywordsOpen] = useState(false);

  const [indAny, setIndAny] = useState([]);
  const [indNot, setIndNot] = useState([]);

  const [kwIncludeOpen, setKwIncludeOpen] = useState(false);
  const [kwExcludeOpen, setKwExcludeOpen] = useState(false);
  const [kwInclude, setKwInclude] = useState("");
  const [kwExclude, setKwExclude] = useState("");

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
        setOpenSub("");
        setKwIncludeOpen(false);
        setKwExcludeOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const toggle = (setter, list, value) => {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const jtCount = jtAny.length + jtNot.length + jtMgmt.length + jtDept.length;
  const locCount = locAny.length + locNot.length;
  const indCount = indAny.length + indNot.length + (kwInclude.trim() ? 1 : 0) + (kwExclude.trim() ? 1 : 0);

  return (
    <div className="ss-body">
      {/* LEFT FILTERS */}
      <aside className="ss-filters" ref={wrapRef}>
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

            const badge =
              f.key === "Job Titles" ? (jtCount ? `${jtCount}` : "") :
              f.key === "Location" ? (locCount ? `${locCount}` : "") :
              f.key === "Industry and Keywords" ? (indCount ? `${indCount}` : "") :
              "";

            return (
              <div key={f.key} className="ss-filter-row">
                <button
                  type="button"
                  className={"ss-filter-btn" + (isOpen ? " is-open" : "")}
                  onClick={() => {
                    setOpenFilter((prev) => (prev === f.key ? "" : f.key));
                    setOpenSub("");
                    if (f.key !== "Industry and Keywords") {
                      setIkIndustriesOpen(false);
                      setIkKeywordsOpen(false);
                      setKwIncludeOpen(false);
                      setKwExcludeOpen(false);
                    }
                  }}
                >
                  <span className="ss-filter-left">
                    <Icon size={18} className="ss-filter-ico" />
                    <span className="ss-filter-label">
                      {f.key}
                      {badge ? <span className="ss-pill-count">{badge}</span> : null}
                    </span>
                  </span>

                  <span className="ss-filter-right">
                    {f.rightIcon === "upload" ? <span className="ss-upload-dot">⤴</span> : null}
                    <ChevronDown size={18} className={"ss-filter-chevron" + (isOpen ? " is-open" : "")} />
                  </span>
                </button>

                {/* JOB TITLES */}
                {isOpen && f.type === "jobtitles" && (
                  <div className="ss-filter-expand ss-compound-expand">
                    <button
                      type="button"
                      className={"ss-subrow-btn" + (openSub === "jt:any" ? " is-active" : "")}
                      onClick={() => setOpenSub((v) => (v === "jt:any" ? "" : "jt:any"))}
                    >
                      <span className="ss-subrow-text">Is Any Of</span>
                    </button>
                    {openSub === "jt:any" && (
                      <div className="ss-subpanel">
                        <InlineCheckboxList
                          options={JOB_TITLE_OPTIONS}
                          selected={jtAny}
                          onToggle={(v) => toggle(setJtAny, jtAny, v)}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      className={"ss-subrow-btn" + (openSub === "jt:not" ? " is-active" : "")}
                      onClick={() => setOpenSub((v) => (v === "jt:not" ? "" : "jt:not"))}
                    >
                      <span className="ss-subrow-text">Is Not Any Of</span>
                    </button>
                    {openSub === "jt:not" && (
                      <div className="ss-subpanel">
                        <InlineCheckboxList
                          options={JOB_TITLE_OPTIONS}
                          selected={jtNot}
                          onToggle={(v) => toggle(setJtNot, jtNot, v)}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      className={"ss-subrow-btn ss-subrow-ico" + (openSub === "jt:mgmt" ? " is-active" : "")}
                      onClick={() => setOpenSub((v) => (v === "jt:mgmt" ? "" : "jt:mgmt"))}
                    >
                      <span className="ss-subrow-left">
                        <Layers size={16} className="ss-subrow-icon" />
                        <span className="ss-subrow-text">Management Levels</span>
                      </span>
                    </button>
                    {openSub === "jt:mgmt" && (
                      <div className="ss-subpanel">
                        <InlineCheckboxList
                          options={MGMT_LEVEL_OPTIONS}
                          selected={jtMgmt}
                          onToggle={(v) => toggle(setJtMgmt, jtMgmt, v)}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      className={"ss-subrow-btn ss-subrow-ico" + (openSub === "jt:dept" ? " is-active" : "")}
                      onClick={() => setOpenSub((v) => (v === "jt:dept" ? "" : "jt:dept"))}
                    >
                      <span className="ss-subrow-left">
                        <BriefcaseBusiness size={16} className="ss-subrow-icon" />
                        <span className="ss-subrow-text">Department</span>
                      </span>
                    </button>
                    {openSub === "jt:dept" && (
                      <div className="ss-subpanel">
                        <InlineCheckboxList
                          options={DEPARTMENT_OPTIONS}
                          selected={jtDept}
                          onToggle={(v) => toggle(setJtDept, jtDept, v)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* LOCATION */}
                {isOpen && f.type === "location" && (
                  <div className="ss-filter-expand ss-compound-expand">
                    <button
                      type="button"
                      className={"ss-subrow-btn" + (openSub === "loc:any" ? " is-active" : "")}
                      onClick={() => setOpenSub((v) => (v === "loc:any" ? "" : "loc:any"))}
                    >
                      <span className="ss-subrow-text">Is Any Of</span>
                    </button>
                    {openSub === "loc:any" && (
                      <div className="ss-subpanel">
                        <InlineCheckboxList
                          options={LOCATION_OPTIONS}
                          selected={locAny}
                          onToggle={(v) => toggle(setLocAny, locAny, v)}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      className={"ss-subrow-btn" + (openSub === "loc:not" ? " is-active" : "")}
                      onClick={() => setOpenSub((v) => (v === "loc:not" ? "" : "loc:not"))}
                    >
                      <span className="ss-subrow-text">Is Not Any Of</span>
                    </button>
                    {openSub === "loc:not" && (
                      <div className="ss-subpanel">
                        <InlineCheckboxList
                          options={LOCATION_OPTIONS}
                          selected={locNot}
                          onToggle={(v) => toggle(setLocNot, locNot, v)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* INDUSTRY & KEYWORDS */}
                {isOpen && f.type === "industryKeywords" && (
                  <div className="ss-filter-expand ss-ik-wrap">
                    {/* Industries section */}
                    <button
                      type="button"
                      className={"ss-ik-section" + (ikIndustriesOpen ? " is-open" : "")}
                      onClick={() => {
                        setIkIndustriesOpen((v) => !v);
                        setIkKeywordsOpen(false);
                        setOpenSub("");
                        setKwIncludeOpen(false);
                        setKwExcludeOpen(false);
                      }}
                    >
                      <span className="ss-ik-title">Industries</span>
                      <ChevronDown size={18} className={"ss-ik-chev" + (ikIndustriesOpen ? " is-open" : "")} />
                    </button>

                    {ikIndustriesOpen && (
                      <div className="ss-ik-inner">
                        <button
                          type="button"
                          className={"ss-subrow-btn" + (openSub === "ind:any" ? " is-active" : "")}
                          onClick={() => setOpenSub((v) => (v === "ind:any" ? "" : "ind:any"))}
                        >
                          <span className="ss-subrow-text">Is Any Of</span>
                        </button>
                        {openSub === "ind:any" && (
                          <div className="ss-subpanel">
                            <InlineCheckboxList
                              options={INDUSTRY_OPTIONS}
                              selected={indAny}
                              onToggle={(v) => toggle(setIndAny, indAny, v)}
                              withCaret
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          className={"ss-subrow-btn" + (openSub === "ind:not" ? " is-active" : "")}
                          onClick={() => setOpenSub((v) => (v === "ind:not" ? "" : "ind:not"))}
                        >
                          <span className="ss-subrow-text">Is Not Any Of</span>
                        </button>
                        {openSub === "ind:not" && (
                          <div className="ss-subpanel">
                            <InlineCheckboxList
                              options={INDUSTRY_OPTIONS}
                              selected={indNot}
                              onToggle={(v) => toggle(setIndNot, indNot, v)}
                              withCaret
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Keywords section */}
                    <button
                      type="button"
                      className={"ss-ik-section" + (ikKeywordsOpen ? " is-open" : "")}
                      onClick={() => {
                        setIkKeywordsOpen((v) => !v);
                        setIkIndustriesOpen(false);
                        setOpenSub("");
                      }}
                    >
                      <span className="ss-ik-title">Keywords</span>
                      <ChevronDown size={18} className={"ss-ik-chev" + (ikKeywordsOpen ? " is-open" : "")} />
                    </button>

                    {ikKeywordsOpen && (
                      <div className="ss-ik-inner">
                        <button
                          type="button"
                          className={"ss-kw-row" + (kwIncludeOpen ? " is-active" : "")}
                          onClick={() => {
                            setKwIncludeOpen((v) => !v);
                            setKwExcludeOpen(false);
                          }}
                        >
                          <span className="ss-kw-left">
                            <ChevronRight size={16} className={"ss-kw-caret" + (kwIncludeOpen ? " is-open" : "")} />
                            <span>Include Keywords</span>
                          </span>
                        </button>
                        {kwIncludeOpen && (
                          <div className="ss-kw-input-wrap">
                            <input
                              className="ss-kw-input"
                              value={kwInclude}
                              onChange={(e) => setKwInclude(e.target.value)}
                              placeholder="e.g. Agency"
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          className={"ss-kw-row" + (kwExcludeOpen ? " is-active" : "")}
                          onClick={() => {
                            setKwExcludeOpen((v) => !v);
                            setKwIncludeOpen(false);
                          }}
                        >
                          <span className="ss-kw-left">
                            <ChevronRight size={16} className={"ss-kw-caret" + (kwExcludeOpen ? " is-open" : "")} />
                            <span>Exclude Keywords</span>
                          </span>
                        </button>
                        {kwExcludeOpen && (
                          <div className="ss-kw-input-wrap">
                            <input
                              className="ss-kw-input"
                              value={kwExclude}
                              onChange={(e) => setKwExclude(e.target.value)}
                              placeholder="e.g. Agency"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* SIMPLE */}
                {isOpen && f.type === "simple" && (
                  <div className="ss-filter-expand">
                    <div className="ss-filter-expand-inner">
                      <input className="ss-filter-input" placeholder={`Type to refine ${f.key.toLowerCase()}...`} />
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
            <input className="ss-search-input" placeholder="E.g Engineers in New York in software companies with more than 500 empl" />
            <button className="ss-ai-btn" type="button">
              <Sparkles size={16} />
              <span>AI Search</span>
            </button>
          </div>

          <div className="ss-big-card">
            <button type="button" className="ss-big-col ss-big-col-btn" onClick={() => setSavedPanelOpen(true)}>
              <div className="ss-big-head">
                <Bookmark size={16} className="ss-big-ico" />
                <span>Saved Searches</span>
              </div>
              <div className="ss-big-empty">No saved searches</div>
            </button>

            <div className="ss-big-divider" />

            <div className="ss-big-col">
              <div className="ss-big-head">
                <Clock3 size={16} className="ss-big-ico" />
                <span>Recent Searches</span>
              </div>
              <div className="ss-big-empty ss-recent-demo">
                United States, Business Services, Software &amp; Internet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SLIDE PANEL */}
      {savedPanelOpen && (
        <div className="ss-right-overlay" onClick={() => setSavedPanelOpen(false)}>
          <aside className="ss-right-panel" onClick={(e) => e.stopPropagation()}>
            <div className="ss-right-top">
              <h3 className="ss-right-title">Saved Searches</h3>
              <button type="button" className="ss-right-close" onClick={() => setSavedPanelOpen(false)} aria-label="Close">
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
