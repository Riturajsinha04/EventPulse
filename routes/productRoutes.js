const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/authMiddleware');

// Form to submit a new product
router.get('/new', requireAuth, productController.getSubmitForm);
router.post('/new', requireAuth, productController.postSubmitProduct);

// Upvote product action
router.post('/:id/upvote', requireAuth, productController.postUpvoteProduct);

// Post comment on product
router.post('/:id/comment', requireAuth, productController.postComment);

// Product detail view (keep parameterized route at bottom)
router.get('/:id', productController.getProductDetails);

module.exports = router;
