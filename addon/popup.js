'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');
  const statusEl = document.getElementById('status');

  exportBtn.addEventListener('click', async () => {
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';
    statusEl.textContent = '';

    try {
      const data = {
        version: "1.0.0",
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
