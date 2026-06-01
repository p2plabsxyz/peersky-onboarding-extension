'use strict';

const SENSITIVE_URL_PREFIXES = [
  'chrome://', 'chrome-extension://', 'edge://', 'about:',
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
  const exportTabsCb = document.getElementById('exportTabs');
  const exportExtensionsCb = document.getElementById('exportExtensions');
  const statusEl = document.getElementById('status');

  exportBtn.addEventListener('click', async () => {
    const exportTabs = exportTabsCb.checked;
    const exportExtensions = exportExtensionsCb.checked;

    if (!exportTabs && !exportExtensions) {
      statusEl.textContent = 'Please select at least one option.';
      statusEl.style.color = '#ef4444';
      return;
    }

    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';
    statusEl.textContent = '';

    try {
      const data = {
        version: chrome.runtime.getManifest().version,
        exportedAt: new Date().toISOString(),
        browser: "chromium"
      };

      if (exportTabs) {
        data.windows = await getTabsData();
      }

      if (exportExtensions) {
        data.extensions = await getExtensionsData();
      }

      downloadData(data);
      statusEl.textContent = 'Export successful!';
      statusEl.style.color = '#10b981';
    } catch (error) {
      console.error('Peersky Export Error:', error);
      statusEl.textContent = 'Error during export. Check console.';
      statusEl.style.color = '#ef4444';
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Export JSON';
    }
  });
});

async function getTabsData() {
  const windows = await chrome.windows.getAll({ populate: true });
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
        groupId: tab.groupId,
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

async function getExtensionsData() {
  const allItems = await chrome.management.getAll();
  const extensions = allItems.filter(ext => ext.type === 'extension' && ext.id !== chrome.runtime.id);
  return extensions.map(ext => ({
    id: ext.id,
    name: ext.name,
    version: ext.version,
    description: ext.description,
    enabled: ext.enabled,
    type: ext.type
  }));
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
