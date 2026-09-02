const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Home page
router.get('/', productController.getAllProducts);

// Leaderboard page
router.get('/leaderboard', productController.getLeaderboard);

// Viva & Code Explanation Docs page
router.get('/docs', productController.getDocs);

module.exports = router;
