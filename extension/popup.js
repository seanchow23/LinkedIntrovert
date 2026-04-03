// LinkedIntrovert — popup script
// Renders current prefs and saves changes back to chrome.storage.sync.

const KEYS = ['hideComments', 'hideLikes', 'hideWhoViewed'];

const DEFAULT_PREFS = {
  hideComments: true,
  hideLikes: true,
  hideWhoViewed: true,
};

chrome.storage.sync.get(DEFAULT_PREFS, (prefs) => {
  KEYS.forEach((key) => {
    const el = document.getElementById(key);
    if (el) el.checked = prefs[key];
  });
});

KEYS.forEach((key) => {
  const el = document.getElementById(key);
  if (!el) return;
  el.addEventListener('change', () => {
    chrome.storage.sync.set({ [key]: el.checked });
  });
});