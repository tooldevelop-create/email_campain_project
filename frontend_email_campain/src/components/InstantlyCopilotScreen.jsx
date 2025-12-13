import React, { useState, useRef } from "react";

const ROW1 = [
  "Find Ideal Prospects",
  "Generate a Full Campaign",
  "Write a Sequence",
];
const ROW2 = [
  "Campaign Ideas",
  "Weekly Analytics",
  "Best Performing Campaigns",
];
const ROW3 = ["Get Advice", "Audit My Workspace"];

const TABS = {
  NEW_CHAT: "new_chat",
  MEMORY: "memory",
  TASKS: "tasks",
  SETTINGS: "settings",
};

// memory ke andar 2 views: overview + business-details form
const MEMORY_SCREENS = {
  OVERVIEW: "overview",
  BUSINESS: "business-details",
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
    (isSettings ? " copilot-main--settings" : "");

  return (
    <div className="copilot-body">
      {/* LEFT INTERNAL SIDEBAR */}
      <aside className="copilot-left">
        <div className="copilot-left-top">
          {/* New chat button */}
          <button
            className={
              "copilot-new-chat-btn" + (isNewChat ? " is-active" : "")
            }
            onClick={() => setActiveTab(TABS.NEW_CHAT)}
          >
            ✏️ <span>New chat</span>
          </button>

          {/* Side menu */}
          <nav className="copilot-menu">
            <button
              className={
                "copilot-menu-item" +
                (activeTab === TABS.MEMORY ? " is-active" : "")
              }
              onClick={() => {
                setActiveTab(TABS.MEMORY);
                // memory kholte hi always overview se start
                setMemoryScreen(MEMORY_SCREENS.OVERVIEW);
              }}
            >
              Memory
            </button>
            <button
              className={
                "copilot-menu-item" +
                (activeTab === TABS.TASKS ? " is-active" : "")
              }
              onClick={() => setActiveTab(TABS.TASKS)}
            >
              Tasks
            </button>
            <button
              className={
                "copilot-menu-item" +
                (activeTab === TABS.SETTINGS ? " is-active" : "")
              }
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

      {/* MAIN AREA – different view per tab */}
      <section className={mainClassName}>
        {activeTab === TABS.NEW_CHAT && <CopilotChatHome />}

        {activeTab === TABS.MEMORY && (
          <CopilotMemoryView
            screen={memoryScreen}
            onEditManually={() =>
              setMemoryScreen(MEMORY_SCREENS.BUSINESS)
            }
            onChangeMethod={() =>
              setMemoryScreen(MEMORY_SCREENS.OVERVIEW)
            }
          />
        )}

        {activeTab === TABS.TASKS && (
          <CopilotTasksView onCreateTask={() => setActiveTab(TABS.NEW_CHAT)} />
        )}

        {activeTab === TABS.SETTINGS && <CopilotSettingsView />}
      </section>
    </div>
  );
}

/* ---------- Home (What can I help with?) ---------- */

function CopilotChatHome() {
  return (
    <div className="copilot-center">
      <h2 className="copilot-title">What can I help with?</h2>

      <div className="copilot-input-box">
        <input
          className="copilot-input"
          placeholder="Ask Instantly AI or type / to see prompts..."
        />
        <div className="copilot-input-actions">
          <button className="copilot-mic-btn" title="Voice">
            🎙
          </button>
          <button className="copilot-send-btn" title="Send">
            ⬆
          </button>
        </div>
      </div>

      {/* Prompt chips */}
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

/* ---------- MEMORY VIEW + 2 MODALS + BUSINESS DETAILS ---------- */

function CopilotMemoryView({ screen, onEditManually, onChangeMethod }) {
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  // agar user Edit manually pe click kar chuka hai
  if (screen === "business-details") {
    return (
      <CopilotMemoryBusinessDetails onChangeMethod={onChangeMethod} />
    );
  }

  // default overview (cards + Edit manually button)
  return (
    <>
      <div className="copilot-memory">
        <h2 className="copilot-memory-title">Memory</h2>
        <p className="copilot-memory-sub">
          Instantly Copilot can use your business details to provide
          context-aware responses.
        </p>

        <div className="copilot-memory-grid">
          <button
            className="copilot-memory-card"
            onClick={() => setShowWebsiteModal(true)}
          >
            <div className="copilot-memory-icon">🌐</div>
            <h3 className="copilot-memory-card-title">Read my website</h3>
            <p className="copilot-memory-card-text">
              We can pre-fill your business details with the content of your
              website.
            </p>
          </button>

          <button
            className="copilot-memory-card"
            onClick={() => setShowFileModal(true)}
          >
            <div className="copilot-memory-icon">🔗</div>
            <h3 className="copilot-memory-card-title">
              Read a PDF or text file
            </h3>
            <p className="copilot-memory-card-text">
              We can pre-fill your business details with the content of your
              text file or PDF.
            </p>
          </button>
        </div>

        {/* yahi button se business-details screen open hogi */}
        <button
          className="copilot-memory-edit"
          type="button"
          onClick={onEditManually}
        >
          Edit manually
        </button>
      </div>

      {/* Website modal */}
      {showWebsiteModal && (
        <ReadWebsiteModal onClose={() => setShowWebsiteModal(false)} />
      )}

      {/* File modal */}
      {showFileModal && (
        <ReadFileModal onClose={() => setShowFileModal(false)} />
      )}
    </>
  );
}

/* ----- NEW: Business Details (manual edit screen) ----- */

function CopilotMemoryBusinessDetails({ onChangeMethod }) {
  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [awards, setAwards] = useState("");
  const [goal, setGoal] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    // yaha aap data ko backend / context me save kar sakte ho
    console.log("Business details saved:", {
      website,
      companyName,
      description,
      awards,
      goal,
    });
    // abhi ke liye sirf console; aage Customer Profiles / Guidance step bana sakte ho
  };

  return (
    <div className="memory-business">
      {/* top tabs row */}
      <div className="memory-tabs">
        <button className="memory-tab memory-tab-active">
          Business Details
        </button>
        <button className="memory-tab">Customer Profiles</button>
        <button className="memory-tab">Guidance</button>
      </div>

      <div className="memory-business-inner">
        <h2 className="memory-business-title">Business Details</h2>
        <p className="memory-business-sub">
          Enter your basic business information.
        </p>

        <form className="memory-business-form" onSubmit={handleNext}>
          {/* Website */}
          <div className="memory-field">
            <label className="memory-label">Website</label>
            <input
              className="memory-input"
              placeholder="Your website (e.g. https://example.com)"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {/* Company name */}
          <div className="memory-field">
            <label className="memory-label">Company Name</label>
            <input
              className="memory-input"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Business description */}
          <div className="memory-field">
            <label className="memory-label">Business Description</label>
            <textarea
              className="memory-textarea"
              placeholder="Your business description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Awards */}
          <div className="memory-field">
            <label className="memory-label">Awards</label>
            <input
              className="memory-input"
              placeholder="Your awards and recognition"
              value={awards}
              onChange={(e) => setAwards(e.target.value)}
            />
          </div>

          {/* Outreach goal */}
          <div className="memory-field">
            <label className="memory-label">Outreach Goal</label>
            <input
              className="memory-input"
              placeholder="Your outreach goal (e.g. get a meeting, get a demo, etc.)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          {/* bottom buttons row */}
          <div className="memory-footer">
            <div className="memory-footer-left">
              <button
                type="button"
                className="memory-change-method-btn"
                onClick={onChangeMethod}
              >
                ← Change Method
              </button>
            </div>

            <div className="memory-footer-right">
              <button
                type="button"
                className="memory-footer-icon-btn"
                title="More options"
              >
                ⋮
              </button>
              <button type="submit" className="memory-next-btn">
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ----- Modal 1: Read my website ----- */

function ReadWebsiteModal({ onClose }) {
  const [url, setUrl] = useState("");

  const handleExtract = () => {
    console.log("Extract from URL:", url);
    onClose();
  };

  return (
    <div className="copilot-modal-backdrop">
      <div className="copilot-modal">
        {/* header */}
        <div className="copilot-modal-header">
          <h3 className="copilot-modal-title">Read my website</h3>
          <button
            className="copilot-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="copilot-modal-body">
          <p className="copilot-modal-text">
            Enter your website URL and we'll extract the business details for
            you.
          </p>

          <div className="copilot-modal-input-wrap">
            <input
              className="copilot-modal-input"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        {/* footer buttons */}
        <div className="copilot-modal-footer">
          <button
            className="copilot-modal-btn copilot-modal-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="copilot-modal-btn copilot-modal-btn-primary"
            onClick={handleExtract}
          >
            Extract
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----- Modal 2: Read a PDF or text file ----- */

function ReadFileModal({ onClose }) {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

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
        {/* header */}
        <div className="copilot-modal-header">
          <h3 className="copilot-modal-title">Read a PDF or text file</h3>
          <button
            className="copilot-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="copilot-modal-body">
          <p className="copilot-modal-text">
            Select a PDF or text file and we'll extract the business details
            for you.
          </p>

          <div className="copilot-modal-filepicker">
            <button
              type="button"
              className="copilot-modal-file-btn"
              onClick={handleChooseFile}
            >
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

          {fileName && (
            <p className="copilot-modal-filename">{fileName}</p>
          )}
        </div>

        {/* footer buttons */}
        <div className="copilot-modal-footer">
          <button
            className="copilot-modal-btn copilot-modal-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="copilot-modal-btn copilot-modal-btn-primary"
            onClick={handleExtract}
          >
            Extract
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- TASKS VIEW ---------- */

function CopilotTasksView({ onCreateTask }) {
  return (
    <div className="copilot-tasks">
      <h2 className="copilot-tasks-title">Tasks</h2>
      <p className="copilot-tasks-sub">
        Manage your tasks and stay on top of your workflow.
      </p>

      <p className="copilot-tasks-body">
        You don't have any tasks yet. A task is a recurring prompt that
        Instantly Copilot will execute on a schedule. Create a new task{" "}
        <button
          className="copilot-tasks-link"
          type="button"
          onClick={onCreateTask}
        >
          here.
        </button>
      </p>
    </div>
  );
}

/* ---------- SETTINGS VIEW (new) ---------- */

function CopilotSettingsView() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [slackConnected, setSlackConnected] = useState(false);

  const handleSave = () => {
    console.log("Settings saved:", {
      analyticsEnabled,
      slackConnected,
    });
    alert("Settings saved!");
  };

  return (
    <div className="copilot-settings">
      <h2 className="copilot-settings-title">Instantly Copilot Settings</h2>
      <p className="copilot-settings-sub">
        Configure your Instantly Copilot settings.
      </p>

      {/* Analytics card */}
      <div className="copilot-settings-card">
        <div className="copilot-settings-card-main">
          <div>
            <h3 className="copilot-settings-card-title">Analytics</h3>
            <p className="copilot-settings-card-text">
              Enable analytics tracking for Instantly Copilot interactions and
              performance metrics.
            </p>
          </div>

          <div className="copilot-settings-toggle-group">
            <button
              type="button"
              className={
                "copilot-settings-toggle" +
                (!analyticsEnabled ? " is-active is-left" : " is-left")
              }
              onClick={() => setAnalyticsEnabled(false)}
            >
              Disable
            </button>
            <button
              type="button"
              className={
                "copilot-settings-toggle" +
                (analyticsEnabled ? " is-active is-right" : " is-right")
              }
              onClick={() => setAnalyticsEnabled(true)}
            >
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Slack card */}
      <div className="copilot-settings-card">
        <div className="copilot-settings-card-main">
          <div>
            <h3 className="copilot-settings-card-title">Slack Notifications</h3>
            <p className="copilot-settings-card-text">
              Send recurring-task notifications to a Slack channel.
            </p>
          </div>

          <button
            type="button"
            className={
              "copilot-settings-slack-btn" +
              (slackConnected ? " is-connected" : "")
            }
            onClick={() => setSlackConnected((v) => !v)}
          >
            {slackConnected ? "Connected" : "Connect to Slack"}
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="copilot-settings-footer">
        <button
          type="button"
          className="copilot-settings-save"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
