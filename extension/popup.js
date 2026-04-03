// LinkedIntrovert — popup script
// Single on/off toggle. When disabled, content.js still loads but
// applyAll() checks this flag and does nothing.

const toggle = document.getElementById('enabled');
const label = document.getElementById('status-label');

function updateLabel(enabled) {
  label.textContent = enabled ? 'Journal mode on' : 'Journal mode off';
  label.className = 'toggle-label' + (enabled ? '' : ' off');
}

// Load current state
chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  toggle.checked = enabled;
  updateLabel(enabled);
});

// Save on change + tell the active tab to re-run
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ enabled });
  updateLabel(enabled);

  // Reload the active LinkedIn tab so content.js re-initialises cleanly
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.url?.includes('linkedin.com')) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
});