const mongoose = require('mongoose');
const { encryptToken, decryptToken } = require('../utils/tokenCrypto');

const integrationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    connected: { type: Boolean, default: false },
    accessToken: {
      type: String,
      set: encryptToken,
      get: decryptToken
    },
    refreshToken: {
      type: String,
      set: encryptToken,
      get: decryptToken
    },
    lastSyncTime: { type: Date, default: null }
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true }
  }
);

integrationSchema.methods.getDecryptedAccessToken = function() {
  return decryptToken(this.accessToken);
};

integrationSchema.methods.getDecryptedRefreshToken = function() {
  return decryptToken(this.refreshToken);
};

integrationSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('Integration', integrationSchema);
