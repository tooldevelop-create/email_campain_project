// src/components/CampaignCreatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import "../styles/CampaignCreatePage.css";

export default function CampaignCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("My Campaign");

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Please enter a campaign name.");
      return;
    }
    // campaigns list ko new name pass kar rahe hai
    navigate("/campaigns", { state: { newCampaignName: trimmed } });
  };

  const handleCancel = () => {
    navigate("/campaigns");
  };

  const handleBack = () => {
    navigate("/campaigns");
  };

  return (
    <div className="ss-app">
      <Sidebar />
      <main className="ss-main camp-create-main">
        {/* Top back bar */}
        <header className="camp-create-header">
          <button className="camp-create-back" onClick={handleBack}>
            <span className="camp-create-back-arrow">←</span>
            <span>Back</span>
          </button>
        </header>

        <section className="camp-create-body">
          <h1 className="camp-create-title">Let&apos;s create a new campaign</h1>
          <p className="camp-create-subtitle">
            What would you like to name it?
          </p>

          <div className="camp-create-form">
            <label className="camp-create-label">Campaign Name</label>
            <input
              className="camp-create-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="camp-create-actions">
            <button className="camp-create-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="camp-create-continue"
              onClick={handleContinue}
            >
              Continue &gt;
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
