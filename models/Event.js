const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  photo: { type: String, default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  topic: { type: String, required: true }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['AI & Data', 'Web Dev', 'Cloud & DevOps', 'Cybersecurity', 'Mobile', 'Design & UX'],
    default: 'Web Dev'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event start time is required'],
    default: '10:00 AM - 5:00 PM EST'
  },
  locationType: {
    type: String,
    enum: ['In-Person', 'Online', 'Hybrid'],
    default: 'In-Person'
  },
  venue: {
    name: { type: String, default: 'Grand Convention Center' },
    address: { type: String, default: '100 Innovation Way, Tech District' },
    city: { type: String, default: 'San Francisco, CA' },
    onlineUrl: { type: String, default: 'https://eventpulse.live/stream/demo' }
  },
  capacity: {
    type: Number,
    default: 250
  },
  ticketPrice: {
    type: Number,
    default: 0 // 0 means Free Registration
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakers: [speakerSchema],
  rsvps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for RSVP count
eventSchema.virtual('rsvpCount').get(function () {
  return this.rsvps ? this.rsvps.length : 0;
});

// Enable virtuals in JSON / object conversion
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
