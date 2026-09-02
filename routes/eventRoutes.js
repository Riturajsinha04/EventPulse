const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { requireAuth, requireOrganizer } = require('../middleware/authMiddleware');

// Directory & Event Creation
router.get('/', eventController.getAllEvents);
router.get('/new', requireOrganizer, eventController.getNewEventForm);
router.post('/', requireOrganizer, eventController.createEvent);

// User Tickets Pass Dashboard
router.get('/my-tickets', requireAuth, eventController.getUserTickets);

// Event Detailed Page
router.get('/:id', eventController.getEventById);

// RSVP / Ticket Booking
router.post('/:id/rsvp', requireAuth, eventController.postRSVP);

// Edit & Update Event (Organizer only)
router.get('/:id/edit', requireAuth, eventController.getEditEventForm);
router.put('/:id', requireAuth, eventController.updateEvent);

// Delete Event (Organizer only)
router.delete('/:id', requireAuth, eventController.deleteEvent);

// Post Comment / Discussion Question
router.post('/:id/comments', requireAuth, eventController.postComment);

module.exports = router;
