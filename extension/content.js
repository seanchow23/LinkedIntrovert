// LinkedIntrovert — content script
// Strategy: inject a stylesheet that hides everything on linkedin.com/feed/
// except the "Start a post" share box. No class name hunting, no DOM scraping.
// Works regardless of LinkedIn's hashed class names or framework changes.

const CSS = `
  /* Hide the entire right sidebar */
  aside { display: none !important; }

  /* Hide the entire left sidebar */
  header ~ div > div > div:first-child { display: none !important; }

  /* Hide everything in the main feed EXCEPT the share/post box */
  main > div > div > div > div > div:not(:first-child) { display: none !important; }
  main > div > div > div > div > div:first-child > div:not(:first-child) { display: none !important; }

  /* Hide the nav items we don't need */
  nav a[href*="/mynetwork/"],
  nav a[href*="/jobs/"],
  nav a[href*="/notifications/"],
  nav a[href*="/messaging/"],
  nav a[href*="/learning/"] {
    display: none !important;
  }

  /* Hide messaging bottom dock */
  div[class*="msg-overlay"],
  div[class*="messaging"] { display: none !important; }
`;

function injectStyles() {
  // Remove any previously injected style to avoid duplicates
  const existing = document.getElementById('linkedintrovert-styles');
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = 'linkedintrovert-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

// Boot — respect the popup on/off toggle
chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  if (!enabled) return;
  injectStyles();
});