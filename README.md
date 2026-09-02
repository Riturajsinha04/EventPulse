# ⚡ EventPulse - Tech Meetup & Conference Platform

> A full-stack Server-Side Rendered (SSR) web application for discovering tech conferences, reserving developer meetup tickets, exploring keynote speaker lineups, and managing community events.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![Express](https://img.shields.io/badge/Express-4.x-black.svg)
![EJS](https://img.shields.io/badge/SSR-EJS_3.x-blue.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-emerald.svg)
![License](https://img.shields.io/badge/License-MIT-purple.svg)

---

## 🌟 Features

- 🗓️ **Tech Event Directory**: Filter conferences & meetups by domain (*AI & Data, Web Dev, Cloud & DevOps, Cybersecurity, Mobile, Design & UX*), location format (*In-Person, Online, Hybrid*), and instant search.
- 🎟️ **Digital Pass & RSVP Manager**: Real-time ticket booking, seat availability tracking, capacity limits, and attendee ticket wallets.
- 🎤 **Keynote Speaker Lineup**: Embedded speaker schedules featuring talk topics, photos, and company affiliations (*DeepMind, Anthropic, Vercel, HashiCorp*).
- 🏢 **Venue & Stream Integration**: Venue address maps for in-person summits and live stream link embeds for virtual events.
- 💼 **Organizer Dashboard**: Published event management (Create, Read, Update, Delete) reserved for verified Event Organizers.
- 💬 **Community Discussion & Q&A**: Event pages feature an interactive Q&A forum for attendees and speakers.
- 🔒 **Role-Based Authentication**: Secure account registration with `bcryptjs` password hashing, `express-session` tracking, and `Attendee` vs `Organizer` roles.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend / SSR**: EJS (Embedded JavaScript Templates), HTML5, Vanilla CSS
- **Database**: MongoDB Atlas, Mongoose ODM
- **Authentication**: `bcryptjs` (Password Hashing), `express-session` (Session Management)
- **Styling**: Modern Glassmorphic Design System, CSS Variables, Flexbox/Grid, FontAwesome 6 Icons

---

## 📁 Project Architecture (MVC Pattern)

```text
EventPulse/
├── config/
│   └── db.js                 # MongoDB Atlas connection handler
├── models/
│   ├── User.js               # User schema (Role, SavedTickets, Password Hash)
│   ├── Event.js              # Event schema (Category, Venue, Speakers, RSVPs)
│   └── Comment.js            # Q&A Discussion comment schema
├── middleware/
│   └── authMiddleware.js     # Session guard & template locals middleware
├── controllers/
│   ├── indexController.js    # Home page & platform statistics controller
│   ├── authController.js     # Registration, login & session destruction
│   └── eventController.js    # Event CRUD, RSVP logic & ticket wallet
├── routes/
│   ├── indexRoutes.js        # Home page routes
│   ├── authRoutes.js         # Authentication endpoints
│   └── eventRoutes.js        # Event directory, RSVP & organizer endpoints
├── views/
│   ├── partials/             # Reusable EJS header, navbar & footer
│   ├── events/               # Directory, event details, new/edit event forms
│   ├── auth/                 # Login & register views
│   └── user/                 # Attendee ticket wallet view
├── public/
│   ├── css/style.css         # Clean, modern CSS styling & micro-animations
│   └── js/main.js            # Client-side dynamic interaction helpers
├── .env.example              # Environment variables template
├── seed.js                   # Database seeder with sample tech conferences
├── server.js                 # Express application entry point
└── CODE_EXPLANATION.md       # Comprehensive evaluation & viva project explanation guide
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16.x or higher)
- MongoDB Atlas cluster URI (or local MongoDB database)

### 2. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Riturajsinha04/EventPulse.git
   cd EventPulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or copy `.env.example`):
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.vvyflsx.mongodb.net/eventpulse?retryWrites=true&w=majority
   SESSION_SECRET=eventpulse_super_secret_session_key_2026
   ```

4. **Seed Sample Data into MongoDB Atlas:**
   ```bash
   npm run seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Or start the production server:
   ```bash
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
