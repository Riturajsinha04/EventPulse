const Event = require('../models/Event');
const Comment = require('../models/Comment');
const User = require('../models/User');

// GET /events - All Events directory with filtering and search
exports.getAllEvents = async (req, res) => {
  try {
    const { category, search, locationType, sort } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (locationType && locationType !== 'All') {
      query.locationType = locationType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'venue.city': { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { date: 1 }; // Default: Soonest date first
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { rsvps: -1 };

    const events = await Event.find(query)
      .populate('organizer', 'name company avatar')
      .sort(sortOption);

    const categories = ['All', 'AI & Data', 'Web Dev', 'Cloud & DevOps', 'Cybersecurity', 'Mobile', 'Design & UX'];

    res.render('events/index', {
      events,
      categories,
      selectedCategory: category || 'All',
      selectedLocation: locationType || 'All',
      searchQuery: search || '',
      selectedSort: sort || 'date',
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).redirect('/?error=' + encodeURIComponent('Error loading events directory'));
  }
};

// GET /events/new - Render event creation form
exports.getNewEventForm = (req, res) => {
  const categories = ['AI & Data', 'Web Dev', 'Cloud & DevOps', 'Cybersecurity', 'Mobile', 'Design & UX'];
  res.render('events/new', { categories, error: null });
};

// POST /events - Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title, tagline, description, category, date, time, locationType,
      venueName, venueAddress, venueCity, onlineUrl, capacity, ticketPrice, image,
      speakerNames, speakerTitles, speakerCompanies, speakerTopics, speakerPhotos
    } = req.body;

    // Parse speaker array if provided
    let speakers = [];
    if (speakerNames) {
      const names = Array.isArray(speakerNames) ? speakerNames : [speakerNames];
      const titles = Array.isArray(speakerTitles) ? speakerTitles : [speakerTitles];
      const companies = Array.isArray(speakerCompanies) ? speakerCompanies : [speakerCompanies];
      const topics = Array.isArray(speakerTopics) ? speakerTopics : [speakerTopics];
      const photos = Array.isArray(speakerPhotos) ? speakerPhotos : [speakerPhotos];

      for (let i = 0; i < names.length; i++) {
        if (names[i] && names[i].trim() !== '') {
          speakers.push({
            name: names[i].trim(),
            title: titles[i] || 'Keynote Speaker',
            company: companies[i] || 'Tech Company',
            topic: topics[i] || 'Future of Technology',
            photo: photos[i] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          });
        }
      }
    }

    const newEvent = new Event({
      title,
      tagline,
      description,
      category,
      date: new Date(date),
      time: time || '10:00 AM - 5:00 PM EST',
      locationType,
      venue: {
        name: venueName || 'Convention Center',
        address: venueAddress || '100 Tech Blvd',
        city: venueCity || 'San Francisco, CA',
        onlineUrl: onlineUrl || 'https://eventpulse.live/stream'
      },
      capacity: capacity ? parseInt(capacity) : 250,
      ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      organizer: req.session.user.id,
      speakers
    });

    await newEvent.save();
    req.session.save((err) => {
      if (err) console.error('Session save error:', err);
      res.redirect(`/events/${newEvent._id}?success=` + encodeURIComponent('Event published successfully!'));
    });
  } catch (error) {
    const categories = ['AI & Data', 'Web Dev', 'Cloud & DevOps', 'Cybersecurity', 'Mobile', 'Design & UX'];
    res.render('events/new', { categories, error: error.message });
  }
};

// GET /events/:id - Detailed event page
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name company avatar bio')
      .populate('rsvps', 'name avatar company');

    if (!event) {
      return res.status(404).redirect('/events?error=' + encodeURIComponent('Event not found'));
    }

    const comments = await Comment.find({ event: event._id })
      .populate('author', 'name avatar company role')
      .sort({ createdAt: -1 });

    const isRSVPed = req.session.user
      ? event.rsvps.some(user => user._id.toString() === req.session.user.id)
      : false;

    const isOrganizer = req.session.user
      ? event.organizer._id.toString() === req.session.user.id
      : false;

    res.render('events/show', {
      event,
      comments,
      isRSVPed,
      isOrganizer,
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.redirect('/events?error=' + encodeURIComponent('Error loading event page'));
  }
};

// POST /events/:id/rsvp - Toggle RSVP / Claim Ticket
exports.postRSVP = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.user.id;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event) {
      return res.redirect('/events?error=' + encodeURIComponent('Event not found'));
    }

    const rsvpIndex = event.rsvps.indexOf(userId);

    if (rsvpIndex > -1) {
      // Cancel RSVP
      event.rsvps.splice(rsvpIndex, 1);
      user.savedTickets = user.savedTickets.filter(id => id.toString() !== eventId);
      await event.save();
      await user.save();
      return res.redirect(`/events/${eventId}?success=` + encodeURIComponent('RSVP cancelled. Ticket released.'));
    } else {
      // Check capacity
      if (event.rsvps.length >= event.capacity) {
        return res.redirect(`/events/${eventId}?error=` + encodeURIComponent('Sorry, this event is fully booked!'));
      }
      // Add RSVP
      event.rsvps.push(userId);
      user.savedTickets.push(eventId);
      await event.save();
      await user.save();
      return res.redirect(`/events/${eventId}?success=` + encodeURIComponent('Ticket reserved! You are registered for this event.'));
    }
  } catch (error) {
    console.error('Error handling RSVP:', error);
    res.redirect(`/events/${req.params.id}?error=` + encodeURIComponent('Could not update RSVP status'));
  }
};

// GET /events/:id/edit - Render edit event form
exports.getEditEventForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.redirect('/events?error=' + encodeURIComponent('Event not found'));
    }

    if (event.organizer.toString() !== req.session.user.id) {
      return res.redirect(`/events/${event._id}?error=` + encodeURIComponent('Unauthorized to edit this event'));
    }

    const categories = ['AI & Data', 'Web Dev', 'Cloud & DevOps', 'Cybersecurity', 'Mobile', 'Design & UX'];
    res.render('events/edit', { event, categories, error: null });
  } catch (error) {
    res.redirect('/events?error=' + encodeURIComponent('Error loading edit form'));
  }
};

// PUT /events/:id - Update event details
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.redirect('/events?error=' + encodeURIComponent('Event not found'));
    }

    if (event.organizer.toString() !== req.session.user.id) {
      return res.redirect(`/events/${event._id}?error=` + encodeURIComponent('Unauthorized action'));
    }

    const {
      title, tagline, description, category, date, time, locationType,
      venueName, venueAddress, venueCity, onlineUrl, capacity, ticketPrice, image
    } = req.body;

    event.title = title || event.title;
    event.tagline = tagline || event.tagline;
    event.description = description || event.description;
    event.category = category || event.category;
    if (date) event.date = new Date(date);
    event.time = time || event.time;
    event.locationType = locationType || event.locationType;
    event.venue.name = venueName || event.venue.name;
    event.venue.address = venueAddress || event.venue.address;
    event.venue.city = venueCity || event.venue.city;
    event.venue.onlineUrl = onlineUrl || event.venue.onlineUrl;
    event.capacity = capacity ? parseInt(capacity) : event.capacity;
    event.ticketPrice = ticketPrice ? parseFloat(ticketPrice) : event.ticketPrice;
    event.image = image || event.image;

    await event.save();
    res.redirect(`/events/${event._id}?success=` + encodeURIComponent('Event details updated!'));
  } catch (error) {
    const categories = ['AI & Data', 'Web Dev', 'Cloud & DevOps', 'Cybersecurity', 'Mobile', 'Design & UX'];
    res.render('events/edit', { event: req.body, categories, error: error.message });
  }
};

// DELETE /events/:id - Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.redirect('/events?error=' + encodeURIComponent('Event not found'));
    }

    if (event.organizer.toString() !== req.session.user.id) {
      return res.redirect(`/events/${event._id}?error=` + encodeURIComponent('Unauthorized action'));
    }

    await Comment.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(event._id);

    res.redirect('/events?success=' + encodeURIComponent('Event removed successfully'));
  } catch (error) {
    res.redirect('/events?error=' + encodeURIComponent('Could not delete event'));
  }
};

// POST /events/:id/comments - Post a Q&A question/comment
exports.postComment = async (req, res) => {
  try {
    const { content } = req.body;
    const eventId = req.params.id;

    if (!content || content.trim() === '') {
      return res.redirect(`/events/${eventId}?error=` + encodeURIComponent('Comment cannot be empty'));
    }

    const newComment = new Comment({
      event: eventId,
      author: req.session.user.id,
      content: content.trim()
    });

    await newComment.save();
    res.redirect(`/events/${eventId}#discussion`);
  } catch (error) {
    res.redirect(`/events/${req.params.id}?error=` + encodeURIComponent('Could not post comment'));
  }
};

// GET /my-tickets - Attendee tickets wallet dashboard
exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId).populate({
      path: 'savedTickets',
      populate: { path: 'organizer', select: 'name company avatar' }
    });

    res.render('user/tickets', {
      tickets: user.savedTickets || [],
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.redirect('/events?error=' + encodeURIComponent('Error loading tickets wallet'));
  }
};
