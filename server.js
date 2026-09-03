require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const { setUserLocals } = require('./middleware/authMiddleware');

// Initialize Express app
const app = express();
app.set('trust proxy', true); // Trust Vercel & Render reverse proxies

// Middleware to ensure DB connection on serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    next();
  }
});

// EJS View Engine Setup (SSR)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser & Static File Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session Management Setup with MongoDB Atlas Store
app.use(session({
  name: 'eventpulse.sid',
  secret: process.env.SESSION_SECRET || 'eventpulse_super_secret_session_key_2026',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventpulse',
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7 // 7 Days
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days session lifespan
    sameSite: 'lax',
    secure: false // Ensures Vercel proxy delivers cookie reliably across form POSTs
  }
}));

// Expose currentUser and route path to all EJS templates
app.use(setUserLocals);

// Mount Application Routes
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/my-tickets', (req, res) => res.redirect('/events/my-tickets'));

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'EventPulse Server is running smoothly' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).redirect('/events?error=' + encodeURIComponent('404 - Page Not Found'));
});

// Start Express Server if run directly
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`⚡ EventPulse Server is running on port ${PORT}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`=================================================`);
  });
}

module.exports = app;
