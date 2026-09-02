const Product = require('../models/Product');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Homepage: Products listing with category filter, search query & sorting
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let productsQuery = Product.find(query).populate('maker', 'username avatar bio');

    if (sort === 'newest') {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    } else {
      // Default: sort by upvote count descending
      productsQuery = productsQuery.sort({ upvotes: -1, createdAt: -1 });
    }

    const products = await productsQuery.exec();

    // Available categories for filter tabs
    const categories = ['All', 'AI', 'SaaS', 'Developer Tools', 'Web3', 'Productivity', 'Design'];

    res.render('index', {
      products,
      categories,
      selectedCategory: category || 'All',
      searchQuery: search || '',
      selectedSort: sort || 'trending'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('index', {
      products: [],
      categories: ['All', 'AI', 'SaaS', 'Developer Tools', 'Web3', 'Productivity', 'Design'],
      selectedCategory: 'All',
      searchQuery: '',
      selectedSort: 'trending',
      error: 'Failed to load products'
    });
  }
};

// Single product details page
exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('maker', 'username avatar bio createdAt');
    
    if (!product) {
      return res.status(404).render('index', { error: 'Product not found' });
    }

    const comments = await Comment.find({ product: product._id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.render('product-detail', {
      product,
      comments
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.redirect('/');
  }
};

// Submit product form view
exports.getSubmitForm = (req, res) => {
  res.render('submit-product', { error: null });
};

// Post new product
exports.postSubmitProduct = async (req, res) => {
  try {
    const { title, tagline, description, category, tags, demoUrl, imageUrl } = req.body;

    const formattedTags = tags
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const newProduct = new Product({
      title,
      tagline,
      description,
      category,
      tags: formattedTags,
      demoUrl,
      imageUrl: imageUrl || undefined,
      maker: req.session.user.id
    });

    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (error) {
    res.render('submit-product', { error: error.message });
  }
};

// Toggle upvote on product
exports.postUpvoteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.session.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.redirect('back');

    const upvoteIndex = product.upvotes.indexOf(userId);

    if (upvoteIndex > -1) {
      // Remove upvote
      product.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      product.upvotes.push(userId);
    }

    await product.save();
    res.redirect('back');
  } catch (error) {
    console.error('Error toggling upvote:', error);
    res.redirect('back');
  }
};

// Post comment on product
exports.postComment = async (req, res) => {
  try {
    const { content } = req.body;
    const productId = req.params.id;

    if (!content || content.trim().length === 0) {
      return res.redirect(`/products/${productId}`);
    }

    const comment = new Comment({
      product: productId,
      author: req.session.user.id,
      content: content.trim()
    });

    await comment.save();
    res.redirect(`/products/${productId}`);
  } catch (error) {
    console.error('Error posting comment:', error);
    res.redirect('back');
  }
};

// Leaderboard view
exports.getLeaderboard = async (req, res) => {
  try {
    const topProducts = await Product.find()
      .populate('maker', 'username avatar')
      .sort({ upvotes: -1 })
      .limit(10);

    const topMakers = await User.find().limit(5);

    res.render('leaderboard', {
      topProducts,
      topMakers
    });
  } catch (error) {
    res.redirect('/');
  }
};

// Code Walkthrough & Viva Guide for Student Evaluation
exports.getDocs = (req, res) => {
  res.render('docs');
};
