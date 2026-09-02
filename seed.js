require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Comment.deleteMany({});

    console.log('👤 Creating sample maker accounts...');
    const user1 = await User.create({
      username: 'alex_indie',
      email: 'alex@indie.io',
      password: 'password123',
      bio: 'Fullstack developer & AI enthusiast building SaaS micro-tools.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    const user2 = await User.create({
      username: 'sarah_maker',
      email: 'sarah@maker.com',
      password: 'password123',
      bio: 'Product Designer turned Indie Founder. Crafting elegant UX.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    });

    const user3 = await User.create({
      username: 'david_dev',
      email: 'david@dev.tech',
      password: 'password123',
      bio: 'Open source contributor & DevOps engineer.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    });

    console.log('🚀 Creating sample products...');
    const productsData = [
      {
        title: 'DevPulse AI',
        tagline: 'Automated PR code reviews & security analysis in your GitHub workflow',
        description: 'DevPulse AI acts as your senior staff engineer reviewing pull requests in real time. It analyzes code diffs for security vulnerabilities, logic edge cases, and performance bottlenecks before you merge.',
        category: 'AI',
        tags: ['ai', 'github', 'devtools', 'security'],
        demoUrl: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        maker: user1._id,
        upvotes: [user1._id, user2._id, user3._id]
      },
      {
        title: 'FlowDesk Studio',
        tagline: 'All-in-one workspace for remote teams with async canvas & video notes',
        description: 'FlowDesk combines whiteboarding, docs, and 30-second async video updates so distributed teams can stay aligned without attending endless Zoom meetings.',
        category: 'Productivity',
        tags: ['remote', 'productivity', 'canvas', 'collaboration'],
        demoUrl: 'https://flowdesk.dev',
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
        maker: user2._id,
        upvotes: [user1._id, user2._id]
      },
      {
        title: 'ApiKit Express',
        tagline: 'Generate production-ready REST & GraphQL APIs in Node.js in seconds',
        description: 'ApiKit reads your OpenAPI spec or JSON schema and generates clean, modular Express controllers, Mongoose models, and EJS documentation views automatically.',
        category: 'Developer Tools',
        tags: ['express', 'nodejs', 'api', 'graphql'],
        demoUrl: 'https://expressjs.com',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        maker: user3._id,
        upvotes: [user2._id, user3._id]
      },
      {
        title: 'PixelGlass UI',
        tagline: 'Modern glassmorphic component library for clean SSR applications',
        description: 'A lightweight, zero-dependency CSS framework designed specifically for Server-Side Rendered EJS and React apps. Features dark mode, glowing accents, and fluid layouts out of the box.',
        category: 'Design',
        tags: ['css', 'design', 'glassmorphism', 'ui'],
        demoUrl: 'https://pixelglass.design',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        maker: user2._id,
        upvotes: [user1._id, user3._id]
      },
      {
        title: 'ChainMonitor Web3',
        tagline: 'Real-time smart contract transaction alert webhook engine',
        description: 'Never miss an important smart contract event again. Set up webhooks for specific EVM wallet addresses or token transfers with custom filter parameters.',
        category: 'Web3',
        tags: ['web3', 'ethereum', 'webhooks', 'crypto'],
        demoUrl: 'https://ethereum.org',
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
        maker: user1._id,
        upvotes: [user1._id]
      },
      {
        title: 'MetricsVault',
        tagline: 'Privacy-first analytics for SaaS founders with zero cookie consent required',
        description: 'Track real user metrics, conversion funnels, and referral traffic without compromising user privacy or needing cookie banners.',
        category: 'SaaS',
        tags: ['saas', 'analytics', 'privacy', 'metrics'],
        demoUrl: 'https://metricsvault.io',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        maker: user3._id,
        upvotes: [user1._id, user2._id, user3._id]
      }
    ];

    const createdProducts = await Product.create(productsData);

    console.log('💬 Creating sample feedback comments...');
    await Comment.create([
      {
        product: createdProducts[0]._id,
        author: user2._id,
        content: 'This GitHub PR review tool saved our team hours on code reviews yesterday! Incredible work Alex!'
      },
      {
        product: createdProducts[0]._id,
        author: user3._id,
        content: 'Does this support custom ESLint rule enforcement out of the box?'
      },
      {
        product: createdProducts[1]._id,
        author: user1._id,
        content: 'Love the async video feature! Much better than traditional status update meetings.'
      }
    ]);

    console.log('✅ Database seeded successfully with products, users, and comments!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
