// src/components/ConnectAccountsPage.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Layout.css";
import "../styles/ConnectAccountsPage.css";

const PRE_WARMED_FEATURES = [
  "Pre-Made Accounts & Domains",
  "Start Sending Right away",
  "No Setup Required",
  "Scale existing campaigns Instantly",
  "High-quality US IP Accounts",
  "Deliverability Optimized",
  "Added to the premium warmup pool",
];

const CONNECT_EXISTING_FEATURES = [
  "Connect any IMAP or SMTP email provider",
  "Sync up replies in the Unibox",
];

export default function ConnectAccountsPage() {
  const [selectedPlan, setSelectedPlan] = useState("prewarmed");

  const handleBack = () => {
    // simple back – you can replace with navigate("/email-accounts") if you prefer
    window.history.back();
  };

  const handlePreWarmedContinue = () => {
    console.log("Pre-warmed accounts → Continue");
    alert("Pre-warmed accounts: Continue clicked");
  };

  const handleProviderClick = (provider) => {
    console.log("Connect provider:", provider);
    alert(`Connect: ${provider}`);
  };

  return (
    <div className="ss-app">
      <Sidebar />

      <main className="ss-main ca-main">
        {/* HEADER ROW */}
        <header className="ca-header">
          <button className="ca-back-btn" onClick={handleBack}>
            <span className="ca-back-icon">←</span>
            <span>Back</span>
          </button>
        </header>

        {/* CONTENT */}
        <section className="ca-page">
          <div className="ca-columns">
            {/* ---- LEFT CARD: PRE-WARMED ACCOUNTS ---- */}
            <article
              className={
                "ca-card" +
                (selectedPlan === "prewarmed" ? " ca-card-active" : "")
              }
              onClick={() => setSelectedPlan("prewarmed")}
            >
              <h2 className="ca-card-title">Pre-warmed accounts</h2>

              <ul className="ca-feature-list">
                {PRE_WARMED_FEATURES.map((text, idx) => (
                  <li key={idx} className="ca-feature-item">
                    <span className="ca-check-icon">✔</span>
                    <span className="ca-feature-text">
                      {text}
                      {idx === PRE_WARMED_FEATURES.length - 1 && (
                        <span className="ca-pro-pill">Pro</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="ca-card-footer">
                <div className="ca-remaining">
                  <span className="ca-remaining-number">239</span>{" "}
                  domains remaining
                </div>

                <button
                  className="ca-primary-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreWarmedContinue();
                  }}
                >
                  Continue <span className="ca-new-pill">New</span>
                </button>
              </div>
            </article>

            {/* ---- RIGHT CARD: CONNECT EXISTING ACCOUNTS ---- */}
            <article
              className={
                "ca-card" +
                (selectedPlan === "existing" ? " ca-card-active" : "")
              }
              onClick={() => setSelectedPlan("existing")}
            >
              <h2 className="ca-card-title">Connect existing accounts</h2>

              <ul className="ca-feature-list ca-feature-list--small">
                {CONNECT_EXISTING_FEATURES.map((text, idx) => (
                  <li key={idx} className="ca-feature-item">
                    <span className="ca-check-icon">✔</span>
                    <span className="ca-feature-text">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="ca-provider-buttons">
                <button
                  type="button"
                  className="ca-provider-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProviderClick("google");
                  }}
                >
                  <span className="ca-provider-logo ca-provider-logo-google">
                    G
                  </span>
                  <div className="ca-provider-text">
                    <span className="ca-provider-title">Google</span>
                    <span className="ca-provider-sub">Gmail / G-Suite</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="ca-provider-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProviderClick("microsoft");
                  }}
                >
                  <span className="ca-provider-logo ca-provider-logo-ms">
                    ■
                  </span>
                  <div className="ca-provider-text">
                    <span className="ca-provider-title">Microsoft</span>
                    <span className="ca-provider-sub">
                      Office 365 / Outlook
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="ca-provider-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProviderClick("imap");
                  }}
                >
                  <span className="ca-provider-logo ca-provider-logo-imap">
                    ✉
                  </span>
                  <div className="ca-provider-text">
                    <span className="ca-provider-title">Any Provider</span>
                    <span className="ca-provider-sub">IMAP / SMTP</span>
                  </div>
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
