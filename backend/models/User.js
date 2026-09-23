const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    branch: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: String,
      required: true,
      trim: true
    },

    block: {
      type: String,
      default: ''
    },

    room: {
      type: String,
      default: ''
    },

    parentName: {
      type: String,
      required: true,
      trim: true
    },

    parentPhone: {
      type: String,
      required: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ['student', 'warden', 'admin', 'staff'],
      default: 'student'
    },

    avatar: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);