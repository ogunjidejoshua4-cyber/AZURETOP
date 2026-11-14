const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      // Password is only required if user does not sign up via Google
      required: function() {
        return !this.googleId;
      },
      minlength: 6
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows multiple documents to have null/undefined googleId without violating uniqueness
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);