// LinkedIntrovert — content script
// Hides feed posts, sidebars, and nav noise using position-based CSS.
// Does NOT touch the nav bar or the "Start a post" box.

const CSS = `
  /* ── Hide the left sidebar (first column) ── */
  body > div > div > div > div > div:first-child:not(main) {
    display: none !important;
  }

  /* ── Hide the right sidebar (last column) ── */
  body > div > div > div > div > div:last-child:not(main) {
    display: none !important;
  }

  /* ── Hide feed posts — everything after the share box ── */
  main > div > div > div > div > *:not(:first-child) {
    display: none !important;
  }

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