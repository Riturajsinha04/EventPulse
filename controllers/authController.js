const User = require('../models/User');
const Product = require('../models/Product');

exports.getRegister = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { error: req.query.error || null });
};

exports.postRegister = async (req, res) => {
  try {
    const { username, email, password, bio, avatar } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('register', { error: 'Username or Email already registered' });
    }

    const newUser = new User({
      username,
      email,
      password,
      bio: bio || 'Indie Hacker & Creator building products.',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    await newUser.save();

    // Log the user in via session
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar
    };

    res.redirect('/');
  } catch (error) {
    res.render('register', { error: error.message });
  }
};

exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { error: req.query.error || null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    };

    res.redirect('/');
  } catch (error) {
    res.render('login', { error: error.message });
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    
    // Get products created by user
    const userProducts = await Product.find({ maker: userId }).sort({ createdAt: -1 });

    // Get products upvoted by user
    const upvotedProducts = await Product.find({ upvotes: userId }).populate('maker', 'username avatar').sort({ createdAt: -1 });

    res.render('profile', {
      userProfile: user,
      userProducts,
      upvotedProducts
    });
  } catch (error) {
    res.redirect('/');
  }
};
