# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinkedIntrovert is a Chrome extension + web dashboard that hides distracting LinkedIn elements (comments, likes, who viewed your profile).

## Repository Structure

- `/client` — React + Vite settings dashboard
- `/server` — Node + Express + MongoDB (user preferences, auth)
- `/extension` — Chrome Extension Manifest V3

## Commands

### Client
```bash
cd client
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # Lint
```

### Server
```bash
cd server
npm run dev       # Start with nodemon
npm start         # Production start
npm test          # Run tests
```

### Extension
Load unpacked from `extension/` in `chrome://extensions` with Developer Mode enabled. No build step — content scripts are plain JS.

## Architecture

**Extension → Server flow:** The Chrome extension content script (`extension/content.js`) reads user preferences (which elements to hide) either from `chrome.storage.sync` or by fetching from the server API. It then applies DOM mutations to hide the targeted LinkedIn elements.

**Client dashboard:** The React app lets users toggle which LinkedIn elements to hide. Settings are saved to the server and synced back to the extension via `chrome.storage.sync` or direct API calls.

**Server:** Express REST API backed by MongoDB. Handles user auth and stores per-user preferences. The extension and client both talk to this API.

## Code Style

- ES modules throughout (`import`/`export`, `"type": "module"` in package.json)
- Functional React components with hooks only — no class components
- Extension content script stays vanilla JS with no bundler or imports
