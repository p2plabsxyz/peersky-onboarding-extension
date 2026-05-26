'use strict';

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
        version: "1.0.0",
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
      return {
        url: tab.url,
        title: tab.title,
        active: tab.active,
        pinned: tab.pinned
      };
    });

    return {
      id: win.id,
      focused: win.focused,
      activeTabIndex,
      tabs: mappedTabs
    };
  });
}

async function getExtensionsData() {
  const extensions = await chrome.management.getAll();
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
