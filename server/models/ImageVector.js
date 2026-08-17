const mongoose = require('mongoose');

const ImageVectorSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  thumbUrl: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 1024
  },
  height: {
    type: Number,
    default: 768
  },
  source: {
    type: String,
    default: 'Dataset'
  },
  // 512-dimensional normalized embedding vector
  embedding: {
    type: [Number],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ImageVector', ImageVectorSchema);
