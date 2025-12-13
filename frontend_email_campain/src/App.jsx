// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import InstantlyCopilotPage from "./components/InstantlyCopilotPage";
import SuperSearchPage from "./components/SuperSearchPage";
import EmailAccountsPage from "./components/EmailAccountsPage";
import ConnectAccountsPage from "./components/ConnectAccountsPage";
import CampaignsPage from "./components/CampaignsPage";
import CampaignCreatePage from "./components/CampaignCreatePage";
import UniboxPage from "./components/UniboxPage";
import AnalyticsPage from "./components/AnalyticsPage";
import CrmPage from "./components/CrmPage";
import CrmOpportunitiesPage from "./components/CrmOpportunitiesPage";
import CrmLeadsPage from "./components/CrmLeadsPage";
import CrmUnnamedListPage from "./components/CrmUnnamedListPage";
import CopilotCreateWorkspacePage from "./components/CopilotCreateWorkspacePage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/copilot" replace />} />

        <Route path="/copilot" element={<InstantlyCopilotPage />} />
        <Route path="/supersearch" element={<SuperSearchPage />} />
        <Route path="/email-accounts" element={<EmailAccountsPage />} />
        <Route
          path="/email-accounts/connect"
          element={<ConnectAccountsPage />}
        />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/create" element={<CampaignCreatePage />} />
        <Route path="/unibox" element={<UniboxPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />

        {/* CRM main */}
        <Route path="/crm" element={<CrmPage />} />
        <Route path="/crm/emails" element={<CrmPage />} />
        <Route path="/crm/calls" element={<CrmPage />} />
        <Route path="/crm/sms" element={<CrmPage />} />
        <Route path="/crm/tasks" element={<CrmPage />} />
        <Route path="/crm/archive" element={<CrmPage />} />
        <Route path="/crm/upcoming" element={<CrmPage />} />

        <Route path="/crm/opportunities" element={<CrmOpportunitiesPage />} />

        {/* All Leads */}
        <Route path="/crm/leads" element={<CrmLeadsPage />} />

        {/* ⬇️ Unnamed list detail */}
        <Route path="/crm/unnamed-list/:id" element={<CrmUnnamedListPage />} />
        <Route path="/copilot/workspace/create" element={<CopilotCreateWorkspacePage />} />

      </Routes>
    </BrowserRouter>
  );
}
