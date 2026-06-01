'use strict';

const SENSITIVE_URL_PREFIXES = [
  'about:', 'moz-extension://', 'resource://',
  'devtools://', 'view-source:', 'file://', 'data:', 'blob:'
];

const SENSITIVE_QUERY_KEYS = new Set([
  'token', 'access_token', 'id_token', 'refresh_token', 'code', 'state',
  'auth', 'password', 'passwd', 'pwd', 'session', 'sessionid', 'key',
  'api_key', 'apikey', 'signature', 'sig', 'jwt', 'bearer'
]);

function sanitizeUrl(rawUrl) {
  if (!rawUrl) return null;
  if (SENSITIVE_URL_PREFIXES.some(p => rawUrl.startsWith(p))) return null;
  try {
    const u = new URL(rawUrl);
    [...u.searchParams.keys()].forEach(k => {
      if (SENSITIVE_QUERY_KEYS.has(k.toLowerCase())) u.searchParams.delete(k);
    });
    u.hash = '';
    return u.toString();
  } catch {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');
  const statusEl = document.getElementById('status');

  exportBtn.addEventListener('click', async () => {
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';
    statusEl.textContent = '';

    try {
      const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
      const manifest = browserAPI.runtime.getManifest();

      const data = {
        version: manifest.version,
        exportedAt: new Date().toISOString(),
        browser: "firefox",
        windows: await getTabsData()
      };

      downloadData(data);
      statusEl.textContent = 'Export successful!';
      statusEl.style.color = '#10b981';
    } catch (error) {
      console.error('Peersky Export Error:', error);
      statusEl.textContent = 'Error during export. Check console.';
      statusEl.style.color = '#ef4444';
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Export Tabs JSON';
    }
  });
});

async function getTabsData() {
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  const windows = await browserAPI.windows.getAll({ populate: true });
  return windows.map(win => {
    let activeTabIndex = 0;
    const mappedTabs = win.tabs.map((tab, index) => {
      if (tab.active) {
        activeTabIndex = index;
      }
      const url = sanitizeUrl(tab.url);
      if (!url) return null;
      return {
        url,
        title: tab.title,
        favIconUrl: tab.favIconUrl || null,
        active: tab.active,
        pinned: tab.pinned
      };
    }).filter(Boolean);

    return {
      id: win.id,
      focused: win.focused,
      incognito: win.incognito,
      state: win.state,
      type: win.type,
      activeTabIndex,
      tabs: mappedTabs
    };
  });
}

function downloadData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().getTime();

  const a = document.createElement('a');
  a.href = url;
  a.download = `peersky-export-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
