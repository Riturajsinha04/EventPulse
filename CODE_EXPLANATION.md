# ⚡ EventPulse - Project & Viva Code Explanation Guide

This guide breaks down every line of code, route, model, middleware, and deployment step in **EventPulse**. Use this to confidently answer any questions during your assignment evaluation or viva defense!

---

## 📌 1. Project Overview & Requirements Checklist

| Requirement | Implementation in EventPulse | Status |
| :--- | :--- | :---: |
| **Frontend SSR with EJS** | Express View Engine with modular EJS templates & partials (`header.ejs`, `navbar.ejs`, `footer.ejs`) | ✅ Pass |
| **Backend: Node.js + Express** | Express 4.x server with full Model-View-Controller (MVC) architectural pattern | ✅ Pass |
| **Database: MongoDB Atlas** | Mongoose 8.x ODM connected asynchronously via environment URI (`MONGODB_URI`) | ✅ Pass |
| **User Roles & Auth** | Password hashing via `bcryptjs`, session management via `express-session`, attendee/organizer roles | ✅ Pass |
| **Transactional RSVP System** | Ticket pass reservation system tracking capacity, seat count, and user ticket wallets | ✅ Pass |
| **Deployment Ready** | Standard NPM scripts (`npm start`, `npm run dev`, `npm run seed`) and container setup | ✅ Pass |

---

## 🏗️ 2. Architectural Pattern: Model-View-Controller (MVC)

EventPulse strictly adheres to the **MVC Design Pattern**:

- **Model (`models/`)**: Encapsulates database structure and business logic using Mongoose schemas.
  - `User.js`: User accounts with role differentiation (`attendee` vs `organizer`), avatar, profile details, and `savedTickets` wallet array.
  - `Event.js`: Represents tech conferences & meetups, including title, tagline, description, category enum, date/time, venue details, speaker array schema, RSVP user array, and capacity limit.
  - `Comment.js`: Q&A discussion forum posts linked to an event and an author.

- **View (`views/`)**: EJS templates rendered on the server-side before sending HTML to the client browser.
  - `index.ejs`: Landing hero, platform metrics, featured flagship summits, category pills.
  - `events/index.ejs`: Complete directory with search, category filtering, venue format filter, and sorting options.
  - `events/show.ejs`: Detailed event page with hero banner, ticket claim widget, speaker lineup grid, and Q&A comments.
  - `user/tickets.ejs`: Attendee's ticket wallet pass dashboard with QR badges.

- **Controller (`controllers/`)**: Manages HTTP request execution, calls model methods, and renders EJS views.
  - `indexController.js`: Handles home landing page and platform statistics.
  - `eventController.js`: Manages event CRUD operations, RSVP toggle transactional logic, and Q&A comment posts.
  - `authController.js`: Manages user registration, role selection, login, and session destruction.

- **Middleware (`middleware/authMiddleware.js`)**: Guard functions verifying session authentication (`requireAuth`), organizer privileges (`requireOrganizer`), and injecting `res.locals.currentUser` into all EJS templates.

---

## 🔑 3. Key Code Snippets & Technical Highlights

### A. RSVP Ticket Reservation & Capacity Check (`controllers/eventController.js`)
```javascript
exports.postRSVP = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.session.user.id;

  const event = await Event.findById(eventId);
  const user = await User.findById(userId);

  const rsvpIndex = event.rsvps.indexOf(userId);

  if (rsvpIndex > -1) {
    // Cancel RSVP
    event.rsvps.splice(rsvpIndex, 1);
    user.savedTickets = user.savedTickets.filter(id => id.toString() !== eventId);
  } else {
    // Capacity Check
    if (event.rsvps.length >= event.capacity) {
      return res.redirect(`/events/${eventId}?error=Event fully booked`);
    }
    event.rsvps.push(userId);
    user.savedTickets.push(eventId);
  }
  
  await event.save();
  await user.save();
  res.redirect(`/events/${eventId}`);
};
```
* **Explanation for Evaluator:** "We use MongoDB ObjectIds to maintain bidirectionally synced references: the Event model's `rsvps` array tracks registered users, while the User model's `savedTickets` array stores booked event IDs. Before adding an RSVP, we verify that `event.rsvps.length < event.capacity` to prevent overbooking."

---

### B. Nested Sub-Schema for Speaker Lineups (`models/Event.js`)
```javascript
const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  photo: { type: String },
  topic: { type: String, required: true }
});

const eventSchema = new mongoose.Schema({
  title: String,
  speakers: [speakerSchema]
});
```
* **Explanation for Evaluator:** "Mongoose sub-schemas allow us to embed an array of speaker objects directly within each Event document. This ensures fast, single-query retrieval of event pages along with full speaker names, titles, and keynote topics without needing costly `$lookup` joins."

---

## 🚀 4. Running Locally & Seeding

1. Install dependencies:
   ```bash
   npm install
   ```
2. Seed initial data:
   ```bash
   npm run seed
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Access app: `http://localhost:3000`

---

## 💯 Viva QA Quick Reference

| Question | Answer |
| :--- | :--- |
| **Why Server-Side Rendering (SSR)?** | SSR compiles dynamic HTML templates on the server before sending them to the client, ensuring fast initial page loads and excellent SEO indexability. |
| **How are passwords stored securely?** | We use `bcryptjs` with a pre-save hook in Mongoose (`userSchema.pre('save')`) to salt and hash passwords before writing to MongoDB. |
| **What is `res.locals` in Express?** | `res.locals` is an object that persists request-scoped variables across middleware so EJS partials like `navbar.ejs` can access `currentUser` seamlessly. |
