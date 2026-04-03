// LinkedIntrovert — content script
// Strategy: paint the whole page white, then cut out only the top nav
// and the center "Start a post" column. No selector hunting needed.

const CSS = `
  /* Paint everything white */
  body > * { opacity: 0 !important; pointer-events: none !important; }

  /* Reveal the top nav bar */
  header,
  nav,
  div[role="banner"] {
    opacity: 1 !important;
    pointer-events: all !important;
  }

  /* Reveal only the center feed column (the post box lives here) */
  main {
    opacity: 1 !important;
    pointer-events: all !important;
  }

  /* Inside main, hide everything except the first child (the share box) */
  main * { opacity: 0 !important; pointer-events: none !important; }

  main > div,
  main > div > div,
  main > div > div > div,
  main > div > div > div > div,
  main > div > div > div > div > div:first-child,
  main > div > div > div > div > div:first-child > div:first-child,
  main > div > div > div > div > div:first-child > div:first-child > *,
  main > div > div > div > div > div:first-child > div:first-child > * > *,
  main > div > div > div > div > div:first-child > div:first-child > * > * > * {
    opacity: 1 !important;
    pointer-events: all !important;
  }
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