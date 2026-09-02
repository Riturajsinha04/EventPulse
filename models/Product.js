const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [60, 'Title cannot exceed 60 characters']
  },
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    trim: true,
    maxlength: [140, 'Tagline cannot exceed 140 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['AI', 'SaaS', 'Developer Tools', 'Web3', 'Productivity', 'Design'],
    default: 'SaaS'
  },
  tags: [{
    type: String,
    trim: true
  }],
  demoUrl: {
    type: String,
    required: [true, 'Demo or Website URL is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  },
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for upvote count
productSchema.virtual('upvoteCount').get(function () {
  return this.upvotes ? this.upvotes.length : 0;
});

// Configure virtuals in JSON and Object outputs
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
