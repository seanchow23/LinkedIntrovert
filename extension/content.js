// LinkedIntrovert — content script
// Reads prefs from chrome.storage.sync and hides the targeted LinkedIn elements.

const SELECTORS = {
  comments: [
    '.comments-comments-list',
    '.social-details-social-counts__comments',
  ],
  likes: [
    '.social-details-social-counts__reactions',
    '.social-details-social-activity',
  ],
  whoViewed: [
    '.identity-premium-upsell-nudge',
    '[data-control-name="view_who_viewed_your_profile"]',
  ],
};

const DEFAULT_PREFS = {
  hideComments: true,
  hideLikes: true,
  hideWhoViewed: true,
};

function applyPrefs(prefs) {
  const hide = (selectors) =>
    selectors.forEach((sel) =>
      document.querySelectorAll(sel).forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
      })
    );

  if (prefs.hideComments) hide(SELECTORS.comments);
  if (prefs.hideLikes) hide(SELECTORS.likes);
  if (prefs.hideWhoViewed) hide(SELECTORS.whoViewed);
}

function observeDOM(prefs) {
  const observer = new MutationObserver(() => applyPrefs(prefs));
  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.storage.sync.get(DEFAULT_PREFS, (prefs) => {
  applyPrefs(prefs);
  observeDOM(prefs);
});

// Re-apply when storage changes (e.g. user toggles a setting in the dashboard)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  chrome.storage.sync.get(DEFAULT_PREFS, (prefs) => applyPrefs(prefs));
});