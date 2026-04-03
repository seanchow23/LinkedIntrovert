// LinkedIntrovert — content script
// Vision: LinkedIn as a private writing journal.
// You see: "Start a post" + your own past posts only.
// You don't see: everyone else's posts, all social signals,
//               nav clutter, analytics, notifications, jobs.

// ---------------------------------------------------------------------------
// SELECTORS — always hidden, no exceptions
// ---------------------------------------------------------------------------
const HIDE_ALWAYS = [

  // ── Nav bar noise ──────────────────────────────────────────────────────
  'li[data-alias="mynetwork"]',
  'li[data-alias="notifications"]',
  'li[data-alias="jobs"]',
  'li[data-alias="business"]',
  'li[data-alias="learning"]',
  'a[href*="/mynetwork/"]',
  'a[href*="/notifications/"]',
  'a[href*="/jobs/"]',
  '.premium-nav-item',
  '.nav-item__badge-count',

  // ── Likes, reactions, social counts ───────────────────────────────────
  '.social-details-social-counts',
  '.social-details-social-counts__reactions',
  '.social-details-social-counts__reaction-count',
  '.social-details-social-counts__comments',
  '.social-details-social-activity',

  // ── Comments ──────────────────────────────────────────────────────────
  '.comments-comments-list',
  '.comments-comment-list',
  '.comment-button',
  'button[aria-label*="comment"]',
  'button[aria-label*="Comment"]',

  // ── Reaction / share / send buttons row on posts ──────────────────────
  '.feed-shared-social-action-bar',
  '.social-actions-bar',

  // ── Who viewed your profile ────────────────────────────────────────────
  '.identity-premium-upsell-nudge',
  '[data-control-name="view_who_viewed_your_profile"]',
  '.who-viewed-my-profile',

  // ── Profile analytics / impressions ───────────────────────────────────
  '.pv-dashboard-section',
  '.identity-dashboard',
  '[data-test-id="profile-analytics"]',

  // ── "People you may know" / connection suggestions ─────────────────────
  '.pymk-iso',
  '.discovery-templates-vertical-list',
  '.discovery-templates-entity-item',

  // ── Notifications content ──────────────────────────────────────────────
  '.notifications-container',

  // ── Jobs in feed / right rail ──────────────────────────────────────────
  '.jobs-home-upsell',
  '.job-card-container',
  '.open-to-work-status-indicator',
  '.hiring-indicator',

  // ── Right-side rail ────────────────────────────────────────────────────
  '.trending-topics-module',
  '.news-module',
  '.browsemap-module',
  '.aside-companypage-module',
  '.premium-upsell-link',
  '.premium-paywall-profile-upsell',
  '.learning-module',

  // ── Messaging dock ─────────────────────────────────────────────────────
  '.msg-overlay-list-bubble',
  '.msg-overlay-bubble-header',
  '.messaging-widget-container',

  // ── Ads / sponsored ────────────────────────────────────────────────────
  '[data-test-id="ad-banner"]',
  '.feed-shared-update-v2__sponsored',
];

// ---------------------------------------------------------------------------
// FEED FILTERING
//
// The home feed mixes your posts with everyone else's. We want:
//   ✓  The "Start a post" share box at the top
//   ✓  Your own posts (like a journal scroll)
//   ✗  Everyone else's posts
//
// LinkedIn wraps each update in .occludable-update containing
// .feed-shared-update-v2. The author link inside the actor block
// tells us who wrote it — we compare that to your own profile path.
// ---------------------------------------------------------------------------

function getMyProfilePath() {
  // The logged-in user's profile link appears in the top-nav "Me" menu.
  // Its href is the most reliable signal of who you are.
  const candidates = [
    document.querySelector('a[data-control-name="identity_profile_photo"]'),
    document.querySelector('.global-nav__me-photo')?.closest('a'),
    document.querySelector('a[href*="/in/me"]'),
  ];
  for (const link of candidates) {
    if (!link) continue;
    try {
      return new URL(link.href).pathname.replace(/\/$/, '').toLowerCase();
    } catch {
      // skip malformed
    }
  }
  return null;
}

function isOwnPost(card, myPath) {
  if (!myPath) return false;
  const actorLinks = card.querySelectorAll(
    '.feed-shared-actor__container a, .update-components-actor__container a'
  );
  for (const link of actorLinks) {
    try {
      const href = new URL(link.href).pathname.replace(/\/$/, '').toLowerCase();
      if (href === myPath || href === '/in/me') return true;
    } catch {
      // skip
    }
  }
  return false;
}

// Strip all social noise (likes, comments, reaction buttons) inside a card
// we're keeping — so your own posts show as plain text, no counters.
function stripSocialNoise(card) {
  [
    '.social-details-social-counts',
    '.social-details-social-activity',
    '.feed-shared-social-action-bar',
    '.social-actions-bar',
    '.comments-comments-list',
    '.comment-button',
    'button[aria-label*="comment"]',
    'button[aria-label*="Comment"]',
    'button[aria-label*="React"]',
    '.react-button__trigger',
  ].forEach((sel) =>
    card.querySelectorAll(sel).forEach((el) =>
      el.style.setProperty('display', 'none', 'important')
    )
  );
}

function filterFeed() {
  const myPath = getMyProfilePath();

  document
    .querySelectorAll('.occludable-update, .feed-shared-update-v2')
    .forEach((card) => {
      if (card.dataset.liFiltered) return; // already processed
      card.dataset.liFiltered = '1';

      if (isOwnPost(card, myPath)) {
        card.style.removeProperty('display');
        stripSocialNoise(card);
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
    });
}

// ---------------------------------------------------------------------------
// MAIN APPLY PASS
// ---------------------------------------------------------------------------

function hideStaticElements() {
  HIDE_ALWAYS.forEach((sel) =>
    document.querySelectorAll(sel).forEach((el) =>
      el.style.setProperty('display', 'none', 'important')
    )
  );
}

function applyAll() {
  hideStaticElements();
  filterFeed();
}

// ---------------------------------------------------------------------------
// DOM OBSERVER
// LinkedIn is a SPA — content re-renders as you scroll and navigate.
// Debounce the observer so we batch rapid DOM changes (e.g. infinite scroll).
// ---------------------------------------------------------------------------

let debounceTimer = null;

function observeDOM() {
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyAll, 150);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Boot — respect the popup's on/off toggle
chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  if (!enabled) return;
  applyAll();
  observeDOM();
});