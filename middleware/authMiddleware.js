// Middleware to protect routes that require authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login?error=' + encodeURIComponent('Please sign in to continue'));
  }
  next();
};

// Middleware to protect routes that require organizer access
const requireOrganizer = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login?error=' + encodeURIComponent('Please sign in as an Event Organizer to create events'));
  }
  if (req.session.user.role !== 'organizer') {
    return res.redirect('/events?error=' + encodeURIComponent('Organizer account required to host events'));
  }
  next();
};

// Middleware to expose logged-in user details to all EJS templates
const setUserLocals = (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  next();
};

module.exports = {
  requireAuth,
  requireOrganizer,
  setUserLocals
};
