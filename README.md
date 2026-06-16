# Peersky Onboarding Extension

<div align="center">
  
| <img src="https://unpkg.com/@browser-logos/firefox/firefox_16x16.png" width="16" height="16"> [Firefox](https://www.mozilla.org/firefox/new/) \| [Firefox for Android](https://play.google.com/store/apps/details?id=org.mozilla.firefox) | <img src="https://unpkg.com/@browser-logos/chrome/chrome_16x16.png" width="16" height="16"> [Chrome](https://www.google.com/chrome/) \| <img src="https://unpkg.com/@browser-logos/brave/brave_16x16.png" width="16" height="16"> [Brave](https://brave.com/) \| <img src="https://unpkg.com/@browser-logos/opera/opera_16x16.png" width="16" height="16"> [Opera](https://www.opera.com/) \| <img src="https://unpkg.com/@browser-logos/edge/edge_16x16.png" width="16" height="16"> [Edge](https://www.microsoft.com/en-us/edge/download) |
|---|---|
| [![Install From AMO](https://img.shields.io/amo/v/peersky-onboarding?label=Firefox%20Add-on&style=social)](https://addons.mozilla.org/en-US/firefox/addon/peersky-onboarding/) | [![Install from Chrome Store](https://img.shields.io/chrome-web-store/v/knegonpkagnjmkndlfhppgnpdmecklji?label=Chrome%20Web%20Store&style=social)](https://chromewebstore.google.com/detail/peersky-onboarding-extension/knegonpkagnjmkndlfhppgnpdmecklji) |

</div>

A minimalistic extension designed to export your data into a single JSON file, allowing for a smooth migration and onboarding experience into the Peersky Browser.

This repository is split into two packages to accommodate browser-specific capabilities:
- **`chrome/`**: For Chromium-based browsers (Chrome, Brave, Edge, Opera, etc.). Exports both open tabs and list of installed extensions.
- **`addon/`**: For Firefox. Exports open tabs only and provides guidance for manual extension migration.

<div align="center">
    <img src="/demo.png" alt="PeerSky Browser onboarding extension firefox and chrome demo screenshots">
</div>

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
