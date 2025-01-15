// models/URL.js
const mongoose = require('mongoose');

const shortid = require('shortid');


const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,

  },
  originalUrl: {
    type: String,
    required: true,
  },
  visits: [{
    timestamp: {
      type: Date,
      default: Date.now
      
    },
    userAgent: String,
    ipAddress: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const URL = mongoose.model('URL', urlSchema);
module.exports = URL;