require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database records...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Comment.deleteMany({});

    console.log('👤 Creating demo accounts (Organizers & Attendees)...');
    
    // Organizer 1
    const organizer1 = await User.create({
      username: 'tech_conf_org',
      name: 'Global Tech Summit Org',
      email: 'organizer@techsummit.io',
      password: 'password123',
      role: 'organizer',
      company: 'Global Developer Network',
      bio: 'Organizing world-class AI, Cloud, and Software Engineering summits.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    // Organizer 2
    const organizer2 = await User.create({
      username: 'devops_guild',
      name: 'DevOps & Cloud Guild',
      email: 'events@devopsguild.org',
      password: 'password123',
      role: 'organizer',
      company: 'DevOps Guild Intl',
      bio: 'Empowering infrastructure & Kubernetes engineers worldwide.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    });

    // Attendee 1
    const attendee1 = await User.create({
      username: 'sarah_dev',
      name: 'Sarah Chen',
      email: 'sarah@coder.com',
      password: 'password123',
      role: 'attendee',
      company: 'Stripe',
      bio: 'Senior Full Stack Engineer interested in LLMs & WebAssembly.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    });

    // Attendee 2
    const attendee2 = await User.create({
      username: 'marcus_tech',
      name: 'Marcus Vance',
      email: 'marcus@cloudtech.com',
      password: 'password123',
      role: 'attendee',
      company: 'Google Cloud',
      bio: 'Cloud architect & cybersecurity speaker.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    });

    console.log('⚡ Seeding Tech Conferences & Developer Meetups...');

    const eventsData = [
      {
        title: 'Global AI & LLM Summit 2026',
        tagline: 'Building Autonomous Agents, Gemini Models & Scalable Inference Pipeline',
        description: 'Join over 1,500 AI researchers, machine learning engineers, and software architects for a 2-day immersive summit. Discover cutting-edge developments in multimodal models, fine-tuning techniques, and enterprise AI safety.',
        category: 'AI & Data',
        date: new Date('2026-10-15'),
        time: '09:00 AM - 05:00 PM EST',
        locationType: 'Hybrid',
        venue: {
          name: 'Moscone Convention Center',
          address: '747 Howard St',
          city: 'San Francisco, CA',
          onlineUrl: 'https://eventpulse.live/stream/ai-summit-2026'
        },
        capacity: 1500,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        organizer: organizer1._id,
        featured: true,
        rsvps: [attendee1._id, attendee2._id],
        speakers: [
          {
            name: 'Dr. Elena Rostova',
            title: 'VP of AI Engineering',
            company: 'DeepMind',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            topic: 'Reasoning Breakthroughs in Next-Gen Agent Architectures'
          },
          {
            name: 'Kenji Takahashi',
            title: 'Distinguished ML Architect',
            company: 'Anthropic',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            topic: 'Low-Latency Speculative Decoding for Production LLMs'
          }
        ]
      },
      {
        title: 'Full-Stack Web DevCon 2026',
        tagline: 'Modern React, Next.js 16, Node.js SSR & CSS Glassmorphism Best Practices',
        description: 'The ultimate web developer gathering focused on high-performance server-side rendering, micro-frontends, edge API routes, and web accessibility.',
        category: 'Web Dev',
        date: new Date('2026-11-05'),
        time: '10:00 AM - 04:30 PM EST',
        locationType: 'In-Person',
        venue: {
          name: 'Metropolitan Pavilion',
          address: '125 W 18th St',
          city: 'New York, NY',
          onlineUrl: ''
        },
        capacity: 400,
        ticketPrice: 49.99,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        organizer: organizer1._id,
        featured: true,
        rsvps: [attendee1._id],
        speakers: [
          {
            name: 'Rachel Sterling',
            title: 'Principal Frontend Engineer',
            company: 'Vercel',
            photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
            topic: 'Zero-JS Server Components and Instant Hydration Patterns'
          }
        ]
      },
      {
        title: 'Cloud Native DevOps & Kubernetes Day',
        tagline: 'Scaling Platform Engineering, GitOps & Multi-Cluster Observability',
        description: 'Hands-on conference for cloud engineers, DevOps practitioners, and SREs. Learn container security, ArgoCD pipelines, and eBPF network monitoring at scale.',
        category: 'Cloud & DevOps',
        date: new Date('2026-09-28'),
        time: '09:30 AM - 04:00 PM PST',
        locationType: 'Online',
        venue: {
          name: 'Virtual Cloud Auditorium',
          address: 'Online Livestream',
          city: 'Online Virtual Stream',
          onlineUrl: 'https://eventpulse.live/stream/devops-day'
        },
        capacity: 2000,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        organizer: organizer2._id,
        featured: false,
        rsvps: [attendee2._id],
        speakers: [
          {
            name: 'David O\'Connor',
            title: 'Chief Architect',
            company: 'HashiCorp',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            topic: 'Self-Healing Infrastructure with Declarative Automation'
          }
        ]
      },
      {
        title: 'Zero-Trust Cybersecurity & AppSec Summit',
        tagline: 'Defending Modern Microservices, API Gateways & Identity Auth',
        description: 'An essential gathering for security engineers and dev teams looking to prevent API vulnerability exploits, secure OAuth2 sessions, and enforce Zero-Trust access control.',
        category: 'Cybersecurity',
        date: new Date('2026-12-01'),
        time: '11:00 AM - 05:00 PM EST',
        locationType: 'In-Person',
        venue: {
          name: 'Austin Tech Center',
          address: '500 Congress Ave',
          city: 'Austin, TX',
          onlineUrl: ''
        },
        capacity: 350,
        ticketPrice: 29.00,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        organizer: organizer2._id,
        featured: false,
        rsvps: [],
        speakers: [
          {
            name: 'Sophia Patel',
            title: 'Head of AppSec',
            company: 'CrowdStrike',
            photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
            topic: 'Hardening Node.js & Express API Routes Against Supply Chain Exploits'
          }
        ]
      }
    ];

    const createdEvents = await Event.create(eventsData);

    // Save ticket references to attendees
    attendee1.savedTickets = [createdEvents[0]._id, createdEvents[1]._id];
    attendee2.savedTickets = [createdEvents[0]._id, createdEvents[2]._id];
    await attendee1.save();
    await attendee2.save();

    console.log('💬 Seeding Q&A comments & attendee discussions...');
    await Comment.create([
      {
        event: createdEvents[0]._id,
        author: attendee1._id,
        content: 'Will the keynote session on Gemini reasoning models be recorded and emailed to virtual attendees?'
      },
      {
        event: createdEvents[0]._id,
        author: organizer1._id,
        content: 'Hi Sarah! Yes, all livestreamed sessions will be recorded in 4K and uploaded to your ticket pass dashboard within 24 hours.'
      },
      {
        event: createdEvents[1]._id,
        author: attendee2._id,
        content: 'Super excited for the Next.js server components deep dive in NYC!'
      }
    ]);

    console.log('=================================================');
    console.log('✅ EventPulse database seeded successfully!');
    console.log(`📌 Seeded 4 Tech Conferences, 4 User Accounts, and Q&A Discussions.`);
    console.log('=================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
