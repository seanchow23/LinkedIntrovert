// LinkedIntrovert — content script

const CSS = `
  /* ── Hide feed posts, keep share box ── */
  main > div > div > div > div > div:not(:nth-child(-n+3)) { display: none !important; }
  main > div > div > div > div > div:first-child > div:nth-child(n+4) { display: none !important; }

  /* ── Hide right sidebar (LinkedIn News, ads, widgets) ── */
  aside { display: none !important; }

  /* ── Hide left sidebar cards below your name/photo ──
     These are the 2nd and 3rd cards: profile viewers, analytics, premium, saved items etc ── */
  main > div > div > div > div > div:first-child > div:first-child > div:not(:first-child) { display: none !important; }

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