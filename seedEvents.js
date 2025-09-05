const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');
require('dotenv').config();

const sampleEvents = [
  {
    title: 'Spring Garden Planning Workshop',
    shortDescription: 'Learn how to plan and prepare your garden for the upcoming spring season with expert tips and hands-on activities.',
    description: `Join us for an comprehensive workshop on spring garden planning! This hands-on session will cover everything you need to know to get your garden ready for the growing season.

We'll start with soil preparation techniques, including how to test your soil pH and improve soil health with organic matter. You'll learn about companion planting strategies that maximize space and improve plant health naturally.

The workshop includes practical activities like seed starting demonstrations, garden layout planning, and creating your own planting calendar. We'll also cover crop rotation principles and how to plan for succession planting to ensure continuous harvests.

Participants will receive a comprehensive spring garden planning guide, seed starting supplies, and access to our online community for ongoing support throughout the growing season.`,
    type: 'workshop',
    category: 'beginner',
    difficulty: 'beginner',
    startDate: new Date('2025-10-15T10:00:00Z'),
    endDate: new Date('2025-10-15T15:00:00Z'),
    registrationDeadline: new Date('2025-10-10T23:59:59Z'),
    location: {
      type: 'physical',
      venue: 'Community Garden Center',
      address: {
        street: '123 Garden Lane',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA'
      }
    },
    capacity: 25,
    price: 45,
    currency: 'USD',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Spring garden with fresh seedlings and planning materials'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?w=800&h=600&fit=crop',
        alt: 'Garden planning materials and notebooks',
        caption: 'Planning materials provided to all participants'
      }
    ],
    tags: ['spring', 'planning', 'beginner', 'hands-on', 'soil-prep'],
    requirements: [
      'Bring a notebook and pen for planning',
      'Wear clothes that can get dirty',
      'Bring water bottle and snacks'
    ],
    whatToExpect: [
      'Learn soil testing and preparation techniques',
      'Create a personalized spring planting plan',
      'Hands-on seed starting demonstration',
      'Take home starter plants and planning materials',
      'Connect with fellow gardening enthusiasts'
    ],
    materials: [
      {
        item: 'Garden planning notebook',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Seed starting supplies',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Soil testing kit',
        required: false,
        providedByOrganizer: true
      }
    ],
    duration: {
      hours: 5,
      minutes: 0
    },
    status: 'published',
    featured: true
  },
  {
    title: 'Urban Herb Garden Masterclass',
    shortDescription: 'Master the art of growing fresh herbs in small urban spaces with this comprehensive online masterclass.',
    description: `Transform your small urban space into a thriving herb garden with this intensive online masterclass! Perfect for apartment dwellers, balcony gardeners, and anyone with limited outdoor space.

This comprehensive session covers container selection, soil mixes, and the best herbs for urban growing. You'll learn about vertical gardening techniques, succession planting, and how to maximize yields in minimal space.

We'll explore both indoor and outdoor herb growing, including windowsill gardens, balcony setups, and small patio designs. The class includes detailed information on harvesting, preserving, and using your fresh herbs in cooking and natural remedies.

Special focus on year-round growing techniques, including bringing herbs indoors for winter and using grow lights effectively. You'll also learn about companion planting herbs with vegetables and flowers.`,
    type: 'webinar',
    category: 'intermediate',
    difficulty: 'intermediate',
    startDate: new Date('2025-10-22T14:00:00Z'),
    endDate: new Date('2025-10-22T16:30:00Z'),
    registrationDeadline: new Date('2025-10-20T12:00:00Z'),
    location: {
      type: 'online',
      onlineLink: 'https://zoom.us/j/1234567890'
    },
    capacity: 100,
    price: 25,
    currency: 'USD',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Urban herb garden on apartment balcony'
    },
    tags: ['herbs', 'urban-gardening', 'containers', 'online', 'small-space'],
    requirements: [
      'Stable internet connection for video streaming',
      'Notebook for taking notes',
      'Optional: containers and potting soil to follow along'
    ],
    whatToExpect: [
      'Learn container gardening techniques',
      'Discover the best herbs for small spaces',
      'Get a comprehensive herb growing guide',
      'Live Q&A session with expert gardener',
      'Access to recorded session for 30 days'
    ],
    materials: [
      {
        item: 'Digital herb growing guide',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Container sizing chart',
        required: false,
        providedByOrganizer: true
      }
    ],
    duration: {
      hours: 2,
      minutes: 30
    },
    status: 'published',
    featured: false
  },
  {
    title: 'Annual Spring Plant Fair',
    shortDescription: 'Browse hundreds of plants, meet local growers, and discover rare varieties at our biggest plant fair of the year.',
    description: `Don't miss the most anticipated gardening event of the spring season! Our Annual Spring Plant Fair brings together the region's best nurseries, specialty growers, and plant enthusiasts for a weekend of plant shopping, learning, and community.

Browse through hundreds of plant varieties including rare perennials, heirloom vegetables, native plants, and exotic houseplants. Meet the growers behind your favorite plants and get expert advice on plant care and garden design.

The fair features educational demonstrations throughout both days, including propagation workshops, plant care clinics, and garden design consultations. Local master gardeners will be available to answer your questions and help you choose the perfect plants for your space.

Special attractions include a rare plant auction, kids' gardening activities, and food vendors featuring garden-to-table cuisine. This is also a perfect opportunity to trade plants with other enthusiasts at our dedicated plant swap area.

Whether you're a seasoned gardener or just starting out, you'll find everything you need to make this growing season your best yet!`,
    type: 'plant-fair',
    category: 'all-levels',
    difficulty: 'beginner',
    startDate: new Date('2025-11-06T09:00:00Z'),
    endDate: new Date('2025-11-07T17:00:00Z'),
    location: {
      type: 'physical',
      venue: 'Central Park Pavilion',
      address: {
        street: '456 Park Avenue',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702',
        country: 'USA'
      }
    },
    capacity: 500,
    price: 0,
    currency: 'USD',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Colorful display of plants and flowers at outdoor fair'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?w=800&h=600&fit=crop',
        alt: 'Vendor booths with various plants',
        caption: 'Over 30 local vendors and growers'
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
        alt: 'Families enjoying plant fair activities',
        caption: 'Fun activities for the whole family'
      }
    ],
    tags: ['plant-fair', 'shopping', 'community', 'vendors', 'free-event'],
    whatToExpect: [
      'Browse plants from 30+ local vendors',
      'Attend free educational demonstrations',
      'Participate in plant swap activities',
      'Enjoy garden-to-table food vendors',
      'Kids activities and family-friendly fun',
      'Meet local master gardeners for advice'
    ],
    duration: {
      hours: 16,
      minutes: 0
    },
    status: 'published',
    featured: true
  },
  {
    title: 'Companion Planting Strategies',
    shortDescription: 'Discover the secrets of companion planting to naturally improve your garden\'s health and productivity.',
    description: `Unlock the power of companion planting with this in-depth workshop that explores how different plants can work together to create a more productive and healthy garden ecosystem.

Learn the science behind companion planting, including how certain plant combinations can improve soil health, deter pests naturally, and increase overall yields. We'll cover classic combinations like the "Three Sisters" (corn, beans, and squash) as well as lesser-known but highly effective partnerships.

The workshop includes hands-on planning exercises where you'll design companion planting layouts for different garden sizes and goals. We'll explore companion planting for pest management, soil improvement, and space maximization.

You'll also learn about plants to avoid pairing together and how to troubleshoot common companion planting challenges. The session includes a comprehensive reference guide with over 100 plant combinations and their benefits.`,
    type: 'workshop',
    category: 'intermediate',
    difficulty: 'intermediate',
    startDate: new Date('2025-11-13T13:00:00Z'),
    endDate: new Date('2025-11-13T16:00:00Z'),
    registrationDeadline: new Date('2025-11-10T23:59:59Z'),
    location: {
      type: 'hybrid',
      venue: 'Garden Education Center',
      address: {
        street: '789 Learning Way',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62703',
        country: 'USA'
      },
      onlineLink: 'https://zoom.us/j/9876543210'
    },
    capacity: 40,
    price: 35,
    currency: 'USD',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Diverse vegetable garden showing companion planting'
    },
    tags: ['companion-planting', 'organic', 'pest-control', 'soil-health', 'productivity'],
    requirements: [
      'Basic gardening knowledge helpful',
      'Bring garden planning materials if attending in person',
      'Stable internet if joining online'
    ],
    whatToExpect: [
      'Learn proven companion planting combinations',
      'Design custom planting plans for your space',
      'Understand the science behind plant partnerships',
      'Get a comprehensive companion planting guide',
      'Practice with real garden scenarios'
    ],
    materials: [
      {
        item: 'Companion planting reference guide',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Garden planning worksheets',
        required: false,
        providedByOrganizer: true
      }
    ],
    duration: {
      hours: 3,
      minutes: 0
    },
    status: 'published',
    featured: false
  },
  {
    title: 'Summer Garden Maintenance Intensive',
    shortDescription: 'Keep your garden thriving through the hot summer months with expert maintenance techniques and troubleshooting tips.',
    description: `Summer can be challenging for gardens, but with the right knowledge and techniques, your plants can thrive even in the heat. This comprehensive workshop covers all aspects of summer garden maintenance.

Learn proper watering techniques that conserve water while keeping plants healthy, including drip irrigation setup and mulching strategies. We'll cover heat stress management, pest identification and organic control methods, and disease prevention in humid conditions.

The session includes hands-on demonstrations of pruning techniques, succession planting for continuous harvests, and container garden maintenance in hot weather. You'll also learn about heat-tolerant plant varieties and how to extend the growing season.

Special focus on troubleshooting common summer problems like blossom end rot, wilting, and pest infestations. Participants will learn to create their own organic pest sprays and soil amendments.`,
    type: 'workshop',
    category: 'intermediate',
    difficulty: 'intermediate',
    startDate: new Date('2025-12-15T09:00:00Z'),
    endDate: new Date('2025-12-15T14:00:00Z'),
    registrationDeadline: new Date('2025-12-12T23:59:59Z'),
    location: {
      type: 'physical',
      venue: 'Botanical Gardens Teaching Center',
      address: {
        street: '321 Botanical Drive',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        country: 'USA'
      }
    },
    capacity: 20,
    price: 55,
    currency: 'USD',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Lush summer garden with healthy plants'
    },
    tags: ['summer', 'maintenance', 'watering', 'pest-control', 'troubleshooting'],
    requirements: [
      'Some gardening experience recommended',
      'Bring sun hat and water bottle',
      'Wear comfortable walking shoes',
      'Bring pruning shears if you have them'
    ],
    whatToExpect: [
      'Master efficient watering techniques',
      'Learn organic pest and disease control',
      'Practice proper summer pruning methods',
      'Get troubleshooting guides for common issues',
      'Hands-on garden maintenance activities'
    ],
    materials: [
      {
        item: 'Summer maintenance checklist',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Organic spray recipes',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Pruning shears',
        required: true,
        providedByOrganizer: false
      }
    ],
    duration: {
      hours: 5,
      minutes: 0
    },
    status: 'published',
    featured: false
  },
  {
    title: 'Fall Harvest Festival & Workshop',
    shortDescription: 'Celebrate the harvest season while learning preservation techniques and fall garden preparation methods.',
    description: `Join us for a festive celebration of the harvest season combined with practical learning about food preservation and fall garden preparation!

This unique event combines the joy of harvest celebration with essential knowledge for extending your garden's productivity into the cooler months. You'll learn various preservation techniques including canning, dehydrating, and fermentation.

The workshop portion covers fall planting strategies, season extension techniques, and preparing your garden for winter. Learn about cold frames, row covers, and selecting varieties that thrive in cooler weather.

The festival atmosphere includes harvest displays, taste testing of preserved foods, and a community potluck featuring garden produce. Local chefs will demonstrate cooking with fresh and preserved garden vegetables.

Families are especially welcome, with activities for children including pumpkin decorating, seed saving demonstrations, and nature crafts using garden materials.`,
    type: 'seasonal-campaign',
    category: 'all-levels',
    difficulty: 'beginner',
    startDate: new Date('2025-12-21T11:00:00Z'),
    endDate: new Date('2025-12-21T17:00:00Z'),
    location: {
      type: 'physical',
      venue: 'Community Farm',
      address: {
        street: '555 Harvest Road',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62705',
        country: 'USA'
      }
    },
    capacity: 150,
    price: 15,
    currency: 'USD',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Abundant fall harvest with pumpkins and vegetables'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?w=800&h=600&fit=crop',
        alt: 'Families enjoying harvest festival activities',
        caption: 'Fun for the whole family'
      }
    ],
    tags: ['harvest', 'preservation', 'fall', 'family', 'seasonal', 'community'],
    whatToExpect: [
      'Learn food preservation techniques',
      'Participate in harvest celebration activities',
      'Get fall planting and garden prep tips',
      'Enjoy community potluck with garden produce',
      'Kids activities and family fun',
      'Take home preserved food samples'
    ],
    materials: [
      {
        item: 'Food preservation guide',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Fall planting calendar',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Canning supplies for demonstration',
        required: false,
        providedByOrganizer: true
      }
    ],
    duration: {
      hours: 6,
      minutes: 0
    },
    status: 'published',
    featured: true
  },
  {
    title: 'Indoor Plant Care Masterclass',
    shortDescription: 'Transform your home into a green oasis with expert tips on selecting, caring for, and troubleshooting indoor plants.',
    description: `Bring the beauty of nature indoors with this comprehensive masterclass on houseplant care! Perfect for plant parents of all experience levels who want to create thriving indoor gardens.

This in-depth session covers plant selection based on light conditions, humidity levels, and space constraints. You'll learn about different plant families, their specific care requirements, and how to create optimal growing conditions in your home.

We'll explore proper watering techniques, fertilization schedules, and repotting methods. The class includes troubleshooting common issues like yellowing leaves, pest problems, and poor growth, with hands-on demonstrations of treatment methods.

Special attention to air-purifying plants, low-light options, and plants that thrive in various room conditions. You'll also learn about propagation techniques to expand your collection and share plants with friends.

The session includes a plant care clinic where you can bring your struggling plants for personalized advice and treatment recommendations.`,
    type: 'expert-talk',
    category: 'all-levels',
    difficulty: 'beginner',
    startDate: new Date('2026-01-05T14:00:00Z'),
    endDate: new Date('2026-01-05T17:00:00Z'),
    registrationDeadline: new Date('2026-01-02T23:59:59Z'),
    location: {
      type: 'online',
      onlineLink: 'https://zoom.us/j/5555555555'
    },
    capacity: 75,
    price: 20,
    currency: 'USD',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      alt: 'Beautiful collection of healthy indoor plants'
    },
    tags: ['houseplants', 'indoor-gardening', 'plant-care', 'troubleshooting', 'air-purifying'],
    requirements: [
      'Good internet connection for video participation',
      'Optional: bring struggling plants to show on camera',
      'Notebook for plant care notes'
    ],
    whatToExpect: [
      'Learn proper watering and fertilization techniques',
      'Identify and treat common plant problems',
      'Discover the best plants for your home conditions',
      'Get personalized advice for your plants',
      'Access to plant care reference materials'
    ],
    materials: [
      {
        item: 'Indoor plant care guide',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Troubleshooting checklist',
        required: false,
        providedByOrganizer: true
      },
      {
        item: 'Plant selection chart by room type',
        required: false,
        providedByOrganizer: true
      }
    ],
    duration: {
      hours: 3,
      minutes: 0
    },
    status: 'published',
    featured: false
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gardening-website');
    console.log('Connected to MongoDB');

    // Find admin users to assign as organizers
    const adminUsers = await User.find({ role: 'admin' }).limit(3);
    
    if (adminUsers.length === 0) {
      console.log('No admin users found. Please create admin users first.');
      process.exit(1);
    }

    console.log(`Found ${adminUsers.length} admin users`);

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Assign organizers to events and ensure unique slugs
    const eventsWithOrganizers = sampleEvents.map((event, index) => {
      // Generate slug from title
      const slug = event.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      return {
        ...event,
        slug: `${slug}-${index + 1}`, // Add index to ensure uniqueness
        organizer: adminUsers[index % adminUsers.length]._id
      };
    });

    // Insert events
    const insertedEvents = await Event.insertMany(eventsWithOrganizers);
    console.log(`Successfully inserted ${insertedEvents.length} events`);

    // Log event details
    insertedEvents.forEach(event => {
      console.log(`- ${event.title} (${event.type}) - ${event.status}`);
    });

    console.log('\nEvent seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedEvents();
}

module.exports = seedEvents;
