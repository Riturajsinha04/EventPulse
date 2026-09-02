# 🚀 LaunchForge - Complete Project & Viva Code Explanation Guide

This guide breaks down every line of code, route, model, middleware, and deployment step in **LaunchForge**. Use this to confidently answer any questions during your assignment evaluation!

---

## 📌 1. Project Overview & Mandatory Requirements Check

| Requirement | Implementation in LaunchForge | Status |
| :--- | :--- | :---: |
| **Frontend SSR with EJS** | Built with Express View Engine + EJS templates & partials (`header.ejs`, `navbar.ejs`, `footer.ejs`) | ✅ Pass |
| **Backend: Node.js + Express** | Express 4.x server, modular MVC structure (`controllers/`, `routes/`, `models/`, `middleware/`) | ✅ Pass |
| **Database: MongoDB Atlas** | Mongoose 8.x ODM with MongoDB Atlas URI connection string in `.env` (`MONGODB_URI`) | ✅ Pass |
| **Git Repository** | Fully initialized local git repository with `.gitignore` for `node_modules` & `.env` | ✅ Pass |
| **Deployment Ready** | Production entry script in `package.json` (`"start": "node server.js"`), `render.yaml` deployment config | ✅ Pass |

---

## 🏗️ 2. Architectural Pattern: Model-View-Controller (MVC)

LaunchForge strictly follows the **MVC Pattern**:
- **Model (`models/`)**: Defines the MongoDB collection schema and business logic using Mongoose.
  - `User.js`: Handles user accounts, avatar, and password hashing (`bcryptjs`).
  - `Product.js`: Represents launched products, taglines, category enums, tags array, and upvotes array.
  - `Comment.js`: Represents maker feedback and discussion comments.
- **View (`views/`)**: EJS templates rendered on the server-side before sending HTML to the client.
- **Controller (`controllers/`)**: Contains the request handling functions that interact with models and render views.
- **Routes (`routes/`)**: Maps URL endpoints to specific controller actions.
- **Middleware (`middleware/`)**: Functions that execute before route controllers (authentication checks & session locals).

---

## 🔑 3. Key Technical Concepts & Code Snippets

### A. MongoDB Atlas Connection (`config/db.js`)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
  }
};
```
* **Explanation for Evaluator:** "We use Mongoose to asynchronously open a connection pool to our MongoDB Atlas database using `process.env.MONGODB_URI`. If the connection string is valid, Mongoose logs the connected host."

---

### B. Password Hashing with Bcrypt (`models/User.js`)
```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```
* **Explanation for Evaluator:** "We use Mongoose's `pre('save')` lifecycle middleware. Before saving a user record, we generate a 10-round salt and hash the plain text password so raw passwords are never stored in plaintext in MongoDB Atlas."

---

### C. Upvote Toggle Logic (`controllers/productController.js`)
```javascript
exports.postUpvoteProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.user.id;
  
  const product = await Product.findById(productId);
  const upvoteIndex = product.upvotes.indexOf(userId);

  if (upvoteIndex > -1) {
    product.upvotes.splice(upvoteIndex, 1); // Remove upvote if already voted
  } else {
    product.upvotes.push(userId); // Add upvote if not voted yet
  }
  
  await product.save();
  res.redirect('back');
};
```
* **Explanation for Evaluator:** "The `upvotes` field in the Product schema stores an array of User ObjectIds. When a logged-in user clicks upvote, we check if their ID exists in the array. If found, we `splice()` it out to un-vote; otherwise, we `push()` their ID into the array."

---

### D. Express Session & EJS Locals Middleware (`middleware/authMiddleware.js`)
```javascript
const setUserLocals = (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  next();
};
```
* **Explanation for Evaluator:** "Express `res.locals` is an object available inside all EJS templates rendered during a request cycle. By setting `res.locals.currentUser = req.session.user`, our EJS partials (`navbar.ejs`) can seamlessly check `if (currentUser)` to render the profile avatar or login buttons dynamically without duplicating code."

---

## 🚀 4. How to Run Locally & Deploy to Render

### Local Running Instructions
1. Install dependencies: `npm install`
2. Seed initial data: `npm run seed`
3. Run dev server: `npm run dev` or `npm start`
4. Open browser: `http://localhost:3000`

### Deployment Steps (Render / Vercel)
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit of LaunchForge platform"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to **Render.com** -> Create **New Web Service**.
3. Select your GitHub repository.
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/launchforge?retryWrites=true&w=majority`
   - `SESSION_SECRET`: `your_random_secret_key`
7. Click **Deploy Web Service**!

---

## 💯 viva Cheat Sheet Summary

| Question | Short 1-Sentence Answer |
| :--- | :--- |
| **Why EJS?** | EJS allows us to perform Server-Side Rendering (SSR) by injecting JavaScript variables directly into HTML templates before sending them to the browser. |
| **What is Mongoose?** | Mongoose is an Object Data Modeling (ODM) library for MongoDB that provides schema validation, middleware hooks, and query helpers. |
| **How do route controllers work?** | Express routes match the URL path and HTTP method, then delegate execution to controller functions which query MongoDB and render views. |
| **What is `express-session`?** | It stores session data on the server side and sends a signed HTTP cookie to the browser to track user authentication across HTTP requests. |
