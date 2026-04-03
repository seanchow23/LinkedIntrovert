// LinkedIntrovert — content script
// Hides everything except "Start a post" on linkedin.com/feed/
// Uses structural HTML selectors — immune to LinkedIn's hashed class names.

const CSS = `
  /* ── Feed: hide all posts, keep only the share box ── */
  main > div > div > div > div > div:not(:first-child) { display: none !important; }
  main > div > div > div > div > div:first-child > div:not(:first-child) { display: none !important; }

  /* ── Right sidebar: LinkedIn News, ads, widgets ── */
  aside { display: none !important; }

  /* ── Left sidebar: profile viewers, analytics, premium, saved items ── */
  main ~ div,
  header ~ div > div > div:first-child { display: none !important; }

  /* ── Nav: hide My Network, Jobs, For Business ── */
  nav a[href*="/mynetwork/"],
  nav a[href*="/jobs/"],
  nav a[href*="/learning/"] { display: none !important; }

  /* Hide the nav item wrappers too so no blank space left behind */
  nav li:has(a[href*="/mynetwork/"]),
  nav li:has(a[href*="/jobs/"]),
  nav li:has(a[href*="/learning/"]) { display: none !important; }

  /* ── Messaging dock ── */
  div[class*="msg-overlay"],
  div[class*="messaging-widget"],
  .msg-overlay-list-bubble { display: none !important; }

  /* ── Bottom-right messaging bubble ── */
  div[id*="msg-overlay"] { display: none !important; }
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