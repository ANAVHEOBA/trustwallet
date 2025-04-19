import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  encryptedSeedPhrase: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Wallet 1'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isLoggedOut: {
    type: Boolean,
    default: false
  },
  lastLogout: {
    type: Date,
    default: null
  },
  security: {
    hasPin: {
      type: Boolean,
      default: false
    },
    pin: {
      type: String,
      required: false
    },
    pinSalt: {
      type: String,
      required: false
    },
    hasBiometrics: {
      type: Boolean,
      default: false
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.encryptedSeedPhrase;
      delete ret.iv;
      delete ret.salt;
      delete ret.security.pin;
      delete ret.security.pinSalt;
      return ret;
    }
  }
});

// Indexes for faster queries
walletSchema.index({ userId: 1, walletAddress: 1 }, { unique: true });
walletSchema.index({ userId: 1, isDefault: 1 });

export default walletSchema; 