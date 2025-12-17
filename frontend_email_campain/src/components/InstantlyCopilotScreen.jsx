import React, { useState, useRef } from "react";
import "../styles/InstantlyCopilot.css"; // adjust if needed

const ROW1 = ["Find Ideal Prospects", "Generate a Full Campaign", "Write a Sequence"];
const ROW2 = ["Campaign Ideas", "Weekly Analytics", "Best Performing Campaigns"];
const ROW3 = ["Get Advice", "Audit My Workspace"];

const TABS = {
  NEW_CHAT: "new_chat",
  MEMORY: "memory",
  TASKS: "tasks",
  SETTINGS: "settings",
};

const MEMORY_SCREENS = {
  OVERVIEW: "overview",
  FLOW: "flow",
};

const MEMORY_TABS = {
  BUSINESS_DETAILS: "business_details",
  CUSTOMER_PROFILES: "customer_profiles",
  GUIDANCE: "guidance",
};

export default function InstantlyCopilotScreen() {
  const [activeTab, setActiveTab] = useState(TABS.NEW_CHAT);
  const [memoryScreen, setMemoryScreen] = useState(MEMORY_SCREENS.OVERVIEW);

  const isMemory = activeTab === TABS.MEMORY;
  const isNewChat = activeTab === TABS.NEW_CHAT;
  const isTasks = activeTab === TABS.TASKS;
  const isSettings = activeTab === TABS.SETTINGS;

  const mainClassName =
    "copilot-main" +
    (isMemory ? " copilot-main--memory" : "") +
    (isTasks ? " copilot-main--tasks" : "") +
    (isSettings ? " copilot-main--settings" : "") +
    (isNewChat ? " copilot-main--home" : "");

  return (
    <div className="copilot-body">
      <aside className="copilot-left">
        <div className="copilot-left-top">
          <button
            className={"copilot-new-chat-btn" + (isNewChat ? " is-active" : "")}
            onClick={() => setActiveTab(TABS.NEW_CHAT)}
          >
            ✏️ <span>New chat</span>
          </button>

          <nav className="copilot-menu">
            <button
              className={"copilot-menu-item" + (activeTab === TABS.MEMORY ? " is-active" : "")}
              onClick={() => {
                setActiveTab(TABS.MEMORY);
                setMemoryScreen(MEMORY_SCREENS.OVERVIEW);
              }}
            >
              Memory
            </button>

            <button
              className={"copilot-menu-item" + (activeTab === TABS.TASKS ? " is-active" : "")}
              onClick={() => setActiveTab(TABS.TASKS)}
            >
              Tasks
            </button>

            <button
              className={"copilot-menu-item" + (activeTab === TABS.SETTINGS ? " is-active" : "")}
              onClick={() => setActiveTab(TABS.SETTINGS)}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="copilot-left-bottom">
          <p className="copilot-empty-text">No chat history yet</p>
          <p className="copilot-empty-sub">Start a new chat to begin</p>
        </div>
      </aside>

      <section className={mainClassName}>
        {activeTab === TABS.NEW_CHAT && <CopilotChatHome />}

        {activeTab === TABS.MEMORY && (
          <CopilotMemoryView
            screen={memoryScreen}
            onEditManually={() => setMemoryScreen(MEMORY_SCREENS.FLOW)}
            onChangeMethod={() => setMemoryScreen(MEMORY_SCREENS.OVERVIEW)}
          />
        )}

        {activeTab === TABS.TASKS && <CopilotTasksView onCreateTask={() => setActiveTab(TABS.NEW_CHAT)} />}

        {activeTab === TABS.SETTINGS && <CopilotSettingsView />}
      </section>
    </div>
  );
}

/* ---------- Home ---------- */

function CopilotChatHome() {
  return (
    <div className="copilot-center">
      <h2 className="copilot-title">What can I help with?</h2>

      <div className="copilot-input-box">
        <input className="copilot-input" placeholder="Ask Instantly AI or type / to see prompts..." />
        <div className="copilot-input-actions">
          <button className="copilot-mic-btn" title="Voice">
            🎙
          </button>
          <button className="copilot-send-btn" title="Send">
            ⬆
          </button>
        </div>
      </div>

      <div className="copilot-chip-row">
        {ROW1.map((t) => (
          <button key={t} className="copilot-chip">
            {t}
          </button>
        ))}
      </div>

      <div className="copilot-chip-row">
        {ROW2.map((t) => (
          <button key={t} className="copilot-chip">
            {t}
          </button>
        ))}
      </div>

      <div className="copilot-chip-row">
        {ROW3.map((t) => (
          <button key={t} className="copilot-chip">
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- MEMORY VIEW (overview + flow) ---------- */

function CopilotMemoryView({ screen, onEditManually, onChangeMethod }) {
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  if (screen === MEMORY_SCREENS.FLOW) {
    return <CopilotMemoryFlow onChangeMethod={onChangeMethod} />;
  }

  return (
    <>
      <div className="copilot-memory">
        <h2 className="copilot-memory-title">Memory</h2>
        <p className="copilot-memory-sub">
          Instantly Copilot can use your business details to provide context-aware responses.
        </p>

        <div className="copilot-memory-grid">
          <button className="copilot-memory-card" onClick={() => setShowWebsiteModal(true)}>
            <div className="copilot-memory-icon">🌐</div>
            <h3 className="copilot-memory-card-title">Read my website</h3>
            <p className="copilot-memory-card-text">
              We can pre-fill your business details with the content of your website.
            </p>
          </button>

          <button className="copilot-memory-card" onClick={() => setShowFileModal(true)}>
            <div className="copilot-memory-icon">🔗</div>
            <h3 className="copilot-memory-card-title">Read a PDF or text file</h3>
            <p className="copilot-memory-card-text">
              We can pre-fill your business details with the content of your text file or PDF.
            </p>
          </button>
        </div>

        <button className="copilot-memory-edit" type="button" onClick={onEditManually}>
          Edit manually
        </button>
      </div>

      {showWebsiteModal && <ReadWebsiteModal onClose={() => setShowWebsiteModal(false)} />}
      {showFileModal && <ReadFileModal onClose={() => setShowFileModal(false)} />}
    </>
  );
}

/* ---------- MEMORY FLOW ---------- */

function CopilotMemoryFlow({ onChangeMethod }) {
  const [activeMemoryTab, setActiveMemoryTab] = useState(MEMORY_TABS.BUSINESS_DETAILS);

  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [awards, setAwards] = useState("");
  const [goal, setGoal] = useState("");

  const goNext = () => {
    if (activeMemoryTab === MEMORY_TABS.BUSINESS_DETAILS) setActiveMemoryTab(MEMORY_TABS.CUSTOMER_PROFILES);
    else if (activeMemoryTab === MEMORY_TABS.CUSTOMER_PROFILES) setActiveMemoryTab(MEMORY_TABS.GUIDANCE);
  };

  const goBack = () => {
    if (activeMemoryTab === MEMORY_TABS.GUIDANCE) setActiveMemoryTab(MEMORY_TABS.CUSTOMER_PROFILES);
    else if (activeMemoryTab === MEMORY_TABS.CUSTOMER_PROFILES) setActiveMemoryTab(MEMORY_TABS.BUSINESS_DETAILS);
  };

  const handleSaveBusiness = (e) => {
    e.preventDefault();
    console.log("Business details saved:", { website, companyName, description, awards, goal });
    goNext();
  };

  return (
    <div className="memory-flow">
      <div className="memory-tabs">
        <button
          className={"memory-tab" + (activeMemoryTab === MEMORY_TABS.BUSINESS_DETAILS ? " memory-tab-active" : "")}
          onClick={() => setActiveMemoryTab(MEMORY_TABS.BUSINESS_DETAILS)}
          type="button"
        >
          Business Details
        </button>

        <button
          className={"memory-tab" + (activeMemoryTab === MEMORY_TABS.CUSTOMER_PROFILES ? " memory-tab-active" : "")}
          onClick={() => setActiveMemoryTab(MEMORY_TABS.CUSTOMER_PROFILES)}
          type="button"
        >
          Customer Profiles
        </button>

        <button
          className={"memory-tab" + (activeMemoryTab === MEMORY_TABS.GUIDANCE ? " memory-tab-active" : "")}
          onClick={() => setActiveMemoryTab(MEMORY_TABS.GUIDANCE)}
          type="button"
        >
          Guidance
        </button>
      </div>

      {activeMemoryTab === MEMORY_TABS.BUSINESS_DETAILS && (
        <div className="memory-business">
          <div className="memory-business-inner">
            <h2 className="memory-business-title">Business Details</h2>
            <p className="memory-business-sub">Enter your basic business information.</p>

            <form className="memory-business-form" onSubmit={handleSaveBusiness}>
              <div className="memory-field">
                <label className="memory-label">Website</label>
                <input
                  className="memory-input"
                  placeholder="Your website (e.g. https://example.com)"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="memory-field">
                <label className="memory-label">Company Name</label>
                <input
                  className="memory-input"
                  placeholder="Your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="memory-field">
                <label className="memory-label">Business Description</label>
                <textarea
                  className="memory-textarea"
                  placeholder="Your business description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="memory-field">
                <label className="memory-label">Awards</label>
                <input
                  className="memory-input"
                  placeholder="Your awards and recognition"
                  value={awards}
                  onChange={(e) => setAwards(e.target.value)}
                />
              </div>

              <div className="memory-field">
                <label className="memory-label">Outreach Goal</label>
                <input
                  className="memory-input"
                  placeholder="Your outreach goal (e.g. get a meeting, get a demo, etc.)"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>

              <div className="memory-sticky-footer">
                <div className="footer-pill">
                  <button type="button" className="footer-pill-btn" onClick={onChangeMethod}>
                    ← Change Method
                  </button>
                  <button type="button" className="footer-pill-icon" title="Clear">
                    🗑
                  </button>
                </div>

                <div className="footer-right">
                  <button type="submit" className="memory-next-btn">
                    Next
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeMemoryTab === MEMORY_TABS.CUSTOMER_PROFILES && (
        <CustomerProfilesScreen onChangeMethod={onChangeMethod} onBack={goBack} onNext={goNext} />
      )}

      {activeMemoryTab === MEMORY_TABS.GUIDANCE && (
        <GuidanceScreen onChangeMethod={onChangeMethod} onBack={goBack} />
      )}
    </div>
  );
}

/* ---------- CUSTOMER PROFILES ---------- */

function CustomerProfilesScreen({ onChangeMethod, onBack, onNext }) {
  return (
    <div className="customer-profiles-wrap">
      <div className="customer-profiles-inner">
        <h2 className="customer-profiles-title">Customer Profiles</h2>
        <p className="customer-profiles-sub">
          Define your ideal customer profiles to help Instantly Copilot generate more targeted content.
        </p>

        <button type="button" className="customer-profiles-addbox">
          <span className="customer-profiles-plus">＋</span>
          <span className="customer-profiles-addtext">Add new ICP</span>
        </button>

        <div className="memory-sticky-footer memory-sticky-footer--wide">
          <div className="footer-pill">
            <button type="button" className="footer-pill-btn" onClick={onChangeMethod}>
              ← Change Method
            </button>
            <button type="button" className="footer-pill-icon" title="Clear">
              🗑
            </button>
          </div>

          <div className="footer-right">
            <button type="button" className="footer-back" onClick={onBack}>
              Back
            </button>
            <button type="button" className="memory-next-btn" onClick={onNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ UPDATED GUIDANCE SCREEN (Exact like screenshot) */

function GuidanceScreen({ onChangeMethod, onBack }) {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    console.log("Guidance saved");
    alert("Saved!");
  };

  return (
    <div className="guidance-wrap">
      <div className="guidance-inner">
        <h2 className="guidance-title">Guidance</h2>
        <p className="guidance-sub">
          Add up to 10 smart rules to store additional instructions for Instantly Copilot.
        </p>

        <div className="guidance-actions">
          <button type="button" className="guidance-btn guidance-btn-primary">
            <span className="guidance-plus">＋</span>
            <span>New Rule</span>
          </button>

          <div className="guidance-dropdown">
            <button
              type="button"
              className="guidance-btn guidance-btn-secondary"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="guidance-bolt">⚡</span>
              <span>Add a predefined rule</span>
              <span className={"guidance-caret" + (open ? " is-open" : "")}>▾</span>
            </button>

            {open && (
              <div className="guidance-menu">
                <button type="button" className="guidance-menu-item" onClick={() => setOpen(false)}>
                  No links
                </button>
                <button type="button" className="guidance-menu-item" onClick={() => setOpen(false)}>
                  Keep it short
                </button>
                <button type="button" className="guidance-menu-item" onClick={() => setOpen(false)}>
                  Friendly tone
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="memory-sticky-footer memory-sticky-footer--wide">
          <div className="footer-pill">
            <button type="button" className="footer-pill-btn" onClick={onChangeMethod}>
              ← Change Method
            </button>
            <button type="button" className="footer-pill-icon" title="Clear">
              🗑
            </button>
          </div>

          <div className="footer-right">
            <button type="button" className="footer-back" onClick={onBack}>
              Back
            </button>
            <button type="button" className="memory-next-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Modals (same) ---------- */

function ReadWebsiteModal({ onClose }) {
  const [url, setUrl] = useState("");

  const handleExtract = () => {
    console.log("Extract from URL:", url);
    onClose();
  };

  return (
    <div className="copilot-modal-backdrop">
      <div className="copilot-modal">
        <div className="copilot-modal-header">
          <h3 className="copilot-modal-title">Read my website</h3>
          <button className="copilot-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="copilot-modal-body">
          <p className="copilot-modal-text">Enter your website URL and we'll extract the business details for you.</p>
          <div className="copilot-modal-input-wrap">
            <input
              className="copilot-modal-input"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="copilot-modal-footer">
          <button className="copilot-modal-btn copilot-modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="copilot-modal-btn copilot-modal-btn-primary" onClick={handleExtract}>
            Extract
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadFileModal({ onClose }) {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleChooseFile = () => fileInputRef.current && fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleExtract = () => {
    console.log("Extract from file:", fileName || "no file selected");
    onClose();
  };

  return (
    <div className="copilot-modal-backdrop">
      <div className="copilot-modal">
        <div className="copilot-modal-header">
          <h3 className="copilot-modal-title">Read a PDF or text file</h3>
          <button className="copilot-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="copilot-modal-body">
          <p className="copilot-modal-text">Select a PDF or text file and we'll extract the business details for you.</p>

          <div className="copilot-modal-filepicker">
            <button type="button" className="copilot-modal-file-btn" onClick={handleChooseFile}>
              Choose File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf,.txt"
              onChange={handleFileChange}
            />
          </div>

          {fileName && <p className="copilot-modal-filename">{fileName}</p>}
        </div>

        <div className="copilot-modal-footer">
          <button className="copilot-modal-btn copilot-modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="copilot-modal-btn copilot-modal-btn-primary" onClick={handleExtract}>
            Extract
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- TASKS / SETTINGS (short) ---------- */

function CopilotTasksView() {
  return <div className="copilot-tasks">Tasks</div>;
}
function CopilotSettingsView() {
  return <div className="copilot-settings">Settings</div>;
}
