// LinkedIntrovert — content script

const CSS = `
  /* ── Hide feed posts, keep share box ── */
  main > div > div > div > div > div:nth-child(n+3) { display: none !important; }

  /* ── Hide right sidebar (LinkedIn News, ads, widgets) ── */
  aside { display: none !important; }

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
