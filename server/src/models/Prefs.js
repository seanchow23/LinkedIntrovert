import mongoose from 'mongoose';

const prefsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    hideComments: { type: Boolean, default: true },
    hideLikes: { type: Boolean, default: true },
    hideWhoViewed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Prefs', prefsSchema);
