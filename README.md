# Peersky Onboarding Extension

A minimalistic extension designed to export your data into a single JSON file, allowing for a smooth migration and onboarding experience into the Peersky Browser.

This repository is split into two packages to accommodate browser-specific capabilities:
- **`chrome/`**: For Chromium-based browsers (Chrome, Brave, Edge, Opera, etc.). Exports both open tabs and list of installed extensions.
- **`addon/`**: For Firefox. Exports open tabs only and provides guidance for manual extension migration.

---

## Features

| Browser | Export Tabs | Export Extensions |
|---|---|---|
| **Chromium** (Chrome, Brave, Edge, etc.) | Yes | Yes |
| **Firefox** | Yes | No (Manual migration instructions provided) |

---

## Installation & Usage

### 1. Chromium-based Browsers (Chrome, Brave, Edge)
1. Open your browser and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (typically a toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `chrome/` directory from this repository.
5. Click the extension icon in your toolbar, select what to export, and click **Export JSON**.

### 2. Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select any file within the `addon/` directory (e.g., `addon/manifest.json`).
4. Click the extension icon in your toolbar and click **Export Tabs JSON**.

---

## Output Format

The extension generates a `peersky-export-[timestamp].json` file containing window and tab states compatible with Peersky's import manager.
