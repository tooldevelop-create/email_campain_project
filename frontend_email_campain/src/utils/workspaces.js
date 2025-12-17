// src/utils/workspaces.js

export const WORKSPACES_KEY = "ea_workspaces";
export const SELECTED_WORKSPACE_KEY = "ea_selected_workspace_id";

export function readWorkspaces() {
  try {
    const raw = localStorage.getItem(WORKSPACES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) {
    console.warn("readWorkspaces failed", e);
  }

  const defaults = [{ id: "ws-1", name: "My Organization" }];
  try {
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(defaults));
  } catch (e) {
    console.warn("write defaults failed", e);
  }
  return defaults;
}

export function writeWorkspaces(list) {
  try {
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("writeWorkspaces failed", e);
  }
}

export function getSelectedWorkspaceId(workspaces) {
  try {
    const stored = localStorage.getItem(SELECTED_WORKSPACE_KEY);
    if (stored && workspaces.some((w) => w.id === stored)) return stored;
  } catch (e) {
    console.warn("getSelectedWorkspaceId failed", e);
  }
  return workspaces?.[0]?.id || "";
}

export function setSelectedWorkspaceId(id) {
  try {
    localStorage.setItem(SELECTED_WORKSPACE_KEY, id);
  } catch (e) {
    console.warn("setSelectedWorkspaceId failed", e);
  }
}

export function createWorkspace(name) {
  const list = readWorkspaces();
  const id = `ws-${Date.now()}`;
  const item = { id, name: name.trim() };

  const next = [item, ...list]; // newest on top
  writeWorkspaces(next);
  setSelectedWorkspaceId(id);

  // notify same-tab listeners
  try {
    window.dispatchEvent(new Event("workspaces:changed"));
  } catch {}

  return { id, list: next };
}
