// Middleware to protect routes that require authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login?error=' + encodeURIComponent('Please sign in to continue'));
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
  setUserLocals
};
