// LinkedIntrovert — content script

const CSS = `
  /* ── Hide feed posts, keep share box ── */
  main > div > div > div > div > div:nth-child(n+3) { display: none !important; }

  /* ── Hide right sidebar ── */
  aside { display: none !important; }

  /* ── Hide profile viewers + analytics card ── */
  [role="menu"]:has(a[href*="/me/profile-views/"]) { display: none !important; }

  /* ── Hide messaging dock ── */
  div[id^="msg"] { display: none !important; }

  /* ── Introvert mode indicator — purple gradient top bar ── */
  body::before { content: ''; position: fixed; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #0a66c2, #a855f7); z-index: 99999; }
`;

function injectStyles() {
  const existing = document.getElementById('linkedintrovert-styles');
  if (existing) existing.remove();
  const style = document.createElement('style');
  style.id = 'linkedintrovert-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

function hide(el) {
  if (el) el.style.setProperty('display', 'none', 'important');
}

function hideDynamicSections() {
  // LinkedIn News + Puzzles share a parent — hide it via the daily-rundown link
  document.querySelectorAll('a[href*="daily-rundown"]').forEach(link => {
    const wrapper = link.closest('[data-display-contents]');
    if (wrapper?.parentElement) hide(wrapper.parentElement);
  });

  // Fallback: hide puzzles section via any game link
  document.querySelectorAll('a[href*="/games/"]').forEach(link => {
    const wrapper = link.closest('[data-display-contents]');
    if (wrapper?.parentElement?.parentElement) hide(wrapper.parentElement.parentElement);
  });
}

chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  if (!enabled) return;
  injectStyles();
  hideDynamicSections();

  const observer = new MutationObserver(hideDynamicSections);
  observer.observe(document.body, { childList: true, subtree: true });
});
