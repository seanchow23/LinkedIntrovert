import { Router } from 'express';
import Prefs from '../models/Prefs.js';

const router = Router();

// Placeholder: replace with real auth middleware that sets req.userId
function getUserId(req) {
  return req.headers['x-user-id'] || 'anonymous';
}

// GET /api/prefs
router.get('/', async (req, res) => {
  const userId = getUserId(req);
  const prefs = await Prefs.findOne({ userId }).lean();
  if (!prefs) return res.json({ hideComments: true, hideLikes: true, hideWhoViewed: true });
  const { hideComments, hideLikes, hideWhoViewed } = prefs;
  res.json({ hideComments, hideLikes, hideWhoViewed });
});

// PUT /api/prefs
router.put('/', async (req, res) => {
  const userId = getUserId(req);
  const { hideComments, hideLikes, hideWhoViewed } = req.body;
  const prefs = await Prefs.findOneAndUpdate(
    { userId },
    { hideComments, hideLikes, hideWhoViewed },
    { upsert: true, new: true, runValidators: true }
  );
  res.json({ ok: true, prefs });
});

export default router;
