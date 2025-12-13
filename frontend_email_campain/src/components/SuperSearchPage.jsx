import React from "react";
import Sidebar from "./Sidebar";
import SuperSearchScreen from "./SuperSearchScreen";
import "../styles/Layout.css";
import "../styles/SuperSearchPage.css";

export default function SuperSearchPage() {
  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main">
        {/* TOP BAR */}
        <header className="ss-topbar">
          <div className="ss-top-left">
            <h1 className="ss-title">SuperSearch</h1>
          </div>

          <div className="ss-tabs">
            <button className="ss-tab-btn ss-tab-btn-active">
              SuperSearch
            </button>
            <button className="ss-tab-btn">Lead Lists</button>
          </div>

          <div className="ss-top-right">
            <div className="ss-coins">
              <span className="ss-coin-icon">🪙</span>
              <span className="ss-coin-value">286</span>
            </div>
            <button className="ss-get-features-btn">Get All Features</button>
            <button className="ss-org-btn">My Organization ▾</button>
          </div>
        </header>

        {/* BODY */}
        <SuperSearchScreen />
      </main>
    </div>
  );
}
