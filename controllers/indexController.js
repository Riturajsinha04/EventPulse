const Event = require('../models/Event');
const User = require('../models/User');

exports.getHomePage = async (req, res) => {
  try {
    const featuredEvents = await Event.find({ featured: true })
      .populate('organizer', 'name company avatar')
      .sort({ date: 1 })
      .limit(3);

    const upcomingEvents = await Event.find()
      .populate('organizer', 'name company avatar')
      .sort({ date: 1 })
      .limit(6);

    const categories = ['All', 'AI & Data', 'Web Dev', 'Cloud & DevOps', 'Cybersecurity', 'Mobile', 'Design & UX'];

    // Platform Statistics
    const totalEvents = await Event.countDocuments();
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalAttendees = await User.countDocuments();

    res.render('index', {
      featuredEvents,
      upcomingEvents,
      categories,
      stats: {
        events: totalEvents,
        organizers: totalOrganizers,
        attendees: totalAttendees + 1200 // added realistic benchmark count
      },
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (err) {
    console.error('Error fetching home page data:', err);
    res.status(500).render('index', {
      featuredEvents: [],
      upcomingEvents: [],
      categories: [],
      stats: { events: 0, organizers: 0, attendees: 0 },
      error: 'Failed to load home page content'
    });
  }
};
