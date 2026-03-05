const mongoose = require("mongoose");

/**
 * USER MODEL
 * Stores user info from any OAuth provider.
 * The `provider` field tracks which service was used.
 * `providerId` is the unique ID from that provider.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      // Not required — some providers (e.g. GitHub) may not share email
    },
    avatar: {
      type: String, // Profile picture URL from the provider
    },
    provider: {
      type: String,
      required: true,
      enum: ["google", "facebook", "github", "linkedin", "instagram"],
    },
    providerId: {
      type: String,
      required: true,
      // The unique user ID given by the OAuth provider
    },
  },
  { timestamps: true }
);

// Compound index: one account per provider per user
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
