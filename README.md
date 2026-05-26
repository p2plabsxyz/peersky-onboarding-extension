# peersky-onboarding-extension

A minimalistic Chromium extension designed to export your current open tabs and installed extensions into a single JSON file. This allows for a smooth migration and onboarding experience into the Peersky Browser.

## Features

- **Export Tabs**: Saves all open windows, tabs, and focus states.
- **Export Extensions**: Saves a list of all currently installed extensions.

## Installation (Developer Mode)

1. Open a Chromium-based browser (Chrome, Brave, Edge, Arc).
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select this directory.
5. Pin the extension to your toolbar and click it to start exporting!

## Output Format

The extension generates a `peersky-export-[timestamp].json` file with a schema compatible with Peersky's import manager.
