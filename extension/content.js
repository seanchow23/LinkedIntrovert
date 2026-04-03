// LinkedIntrovert — content script

const CSS = `
  /* ── This worked before: hide feed posts, keep share box ── */
  main > div > div > div > div > div:not(:first-child) { display: none !important; }
  main > div > div > div > div > div:first-child > div:not(:first-child) { display: none !important; }

  /* ── Hide right sidebar ── */
  aside { display: none !important; }

  /* ── Hide left sidebar cards below your name/photo ── */
  main ~ * { display: none !important; }

  /* ── Hide messaging dock ── */
  div[id^="msg"] { display: none !important; }
`;

function injectStyles() {
  const existing = document.getElementById('linkedintrovert-styles');
  if (existing) existing.remove();
  const style = document.createElement('style');
  style.id = 'linkedintrovert-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  if (!enabled) return;
  injectStyles();
});