const User = require('../models/User');

exports.getRegister = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/register', { error: req.query.error || null });
};

exports.postRegister = async (req, res) => {
  try {
    const { username, name, email, password, role, company, bio, avatar } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('auth/register', { error: 'Username or Email already registered' });
    }

    const newUser = new User({
      username,
      name: name || username,
      email,
      password,
      role: role === 'organizer' ? 'organizer' : 'attendee',
      company: company || 'Tech Community',
      bio: bio || 'Passionate about technology, networking, and innovation.',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    await newUser.save();

    // Log the user in via session
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
      avatar: newUser.avatar
    };

    req.session.save((err) => {
      if (err) console.error('Session save error:', err);
      if (newUser.role === 'organizer') {
        return res.redirect('/events/new?success=' + encodeURIComponent(`Welcome ${newUser.name}! Host your event below.`));
      }
      res.redirect('/?success=' + encodeURIComponent(`Welcome to EventPulse, ${newUser.name}!`));
    });
  } catch (error) {
    res.render('auth/register', { error: error.message });
  }
};

exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { error: req.query.error || null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      avatar: user.avatar
    };

    req.session.save((err) => {
      if (err) console.error('Session save error:', err);
      if (user.role === 'organizer') {
        return res.redirect('/events/new?success=' + encodeURIComponent(`Welcome back ${user.name}!`));
      }
      res.redirect('/?success=' + encodeURIComponent(`Welcome back, ${user.name}!`));
    });
  } catch (error) {
    res.render('auth/login', { error: error.message });
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
