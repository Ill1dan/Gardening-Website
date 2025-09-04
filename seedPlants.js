const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const User = require('./models/User');
require('dotenv').config();

const samplePlants = [
  {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    category: 'indoor',
    type: 'plant',
    shortDescription: 'A succulent plant species known for its healing properties and easy care requirements.',
    fullDescription: 'Aloe Vera is a popular succulent plant that is widely known for its medicinal properties. The gel inside its thick, fleshy leaves has been used for centuries to treat burns, wounds, and various skin conditions. This plant is incredibly easy to care for, making it perfect for beginners. It requires minimal water and can thrive in bright, indirect sunlight. Aloe Vera also helps purify indoor air by removing harmful toxins.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509937528316-21c0a6569b8e?w=500&h=400&fit=crop',
        alt: 'Aloe Vera plant in a white pot',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'indirect',
      water: 'low',
      soilType: 'well-draining',
      humidity: 'low'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'slow',
      matureSize: {
        height: { value: 60, unit: 'cm' },
        width: { value: 40, unit: 'cm' }
      }
    },
    benefits: [
      'Air purifying',
      'Medicinal properties',
      'Low maintenance',
      'Drought tolerant'
    ],
    tags: ['succulent', 'medicinal', 'air-purifier', 'low-water'],
    plantingInstructions: 'Plant in well-draining cactus soil mix. Choose a pot with drainage holes. Water only when soil is completely dry.',
    commonProblems: [
      {
        problem: 'Brown/mushy leaves',
        solution: 'Reduce watering frequency. Ensure proper drainage and remove affected leaves.'
      },
      {
        problem: 'Pale/stretched appearance',
        solution: 'Move to a brighter location with more indirect sunlight.'
      }
    ],
    price: { amount: 15.99, currency: 'USD' },
    featured: true
  },
  {
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    category: 'indoor',
    type: 'plant',
    shortDescription: 'An extremely hardy houseplant with striking upright leaves that tolerates neglect.',
    fullDescription: 'The Snake Plant, also known as Mother-in-Law\'s Tongue, is one of the most resilient houseplants available. Its tall, sword-like leaves with yellow edges make a bold architectural statement in any room. This plant is perfect for beginners or busy plant parents because it thrives on neglect. It can survive in low light conditions and requires very little water. Snake plants are also excellent air purifiers, removing toxins like formaldehyde and benzene from indoor air.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500&h=400&fit=crop',
        alt: 'Snake plant with tall green leaves',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'low',
      water: 'low',
      soilType: 'well-draining',
      humidity: 'low'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'slow',
      matureSize: {
        height: { value: 120, unit: 'cm' },
        width: { value: 30, unit: 'cm' }
      }
    },
    benefits: [
      'Air purifying',
      'Low light tolerant',
      'Extremely low maintenance',
      'Modern aesthetic'
    ],
    tags: ['low-light', 'air-purifier', 'low-water', 'modern'],
    plantingInstructions: 'Use well-draining potting mix. Plant in a heavy pot to prevent tipping due to tall growth.',
    commonProblems: [
      {
        problem: 'Root rot',
        solution: 'Reduce watering and ensure proper drainage. Repot in fresh, dry soil if necessary.'
      }
    ],
    price: { amount: 22.99, currency: 'USD' },
    featured: true
  },
  {
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    category: 'herbs',
    type: 'plant',
    shortDescription: 'A fragrant culinary herb that\'s easy to grow and perfect for cooking.',
    fullDescription: 'Basil is one of the most beloved culinary herbs, known for its sweet, aromatic leaves that are essential in Mediterranean and Asian cuisines. This annual herb is surprisingly easy to grow and can be cultivated both indoors and outdoors. Fresh basil leaves are perfect for making pesto, adding to salads, or garnishing pizza and pasta dishes. The plant produces small white or purple flowers, but pinching these off encourages more leaf growth.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=500&h=400&fit=crop',
        alt: 'Fresh basil plant with green leaves',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'direct',
      water: 'medium',
      soilType: 'well-draining',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'fast',
      matureSize: {
        height: { value: 45, unit: 'cm' },
        width: { value: 30, unit: 'cm' }
      },
      harvestTime: '60-90 days from seed'
    },
    benefits: [
      'Culinary use',
      'Aromatic',
      'Fast growing',
      'Attracts beneficial insects'
    ],
    tags: ['culinary', 'herb', 'aromatic', 'edible'],
    plantingInstructions: 'Sow seeds 1/4 inch deep in warm, well-draining soil. Keep soil consistently moist until germination.',
    commonProblems: [
      {
        problem: 'Wilting leaves',
        solution: 'Increase watering frequency and ensure adequate drainage.'
      },
      {
        problem: 'Aphids',
        solution: 'Spray with insecticidal soap or introduce beneficial insects like ladybugs.'
      }
    ],
    price: { amount: 4.99, currency: 'USD' }
  },
  {
    name: 'Tomato Seeds - Cherry',
    scientificName: 'Solanum lycopersicum var. cerasiforme',
    category: 'vegetables',
    type: 'seed',
    shortDescription: 'Sweet cherry tomato seeds that produce abundant small, flavorful fruits.',
    fullDescription: 'These cherry tomato seeds produce vigorous plants that yield hundreds of sweet, bite-sized tomatoes throughout the growing season. Cherry tomatoes are perfect for beginners because they\'re more forgiving than larger varieties and produce fruit more quickly. The small, red fruits are perfect for snacking, salads, or garnishing dishes. These indeterminate plants will continue producing until the first frost.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592841200221-4e2f8d09a4c6?w=500&h=400&fit=crop',
        alt: 'Cherry tomatoes on the vine',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'direct',
      water: 'medium',
      soilType: 'well-draining',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'intermediate',
      growthRate: 'fast',
      matureSize: {
        height: { value: 180, unit: 'cm' },
        width: { value: 60, unit: 'cm' }
      },
      harvestTime: '65-75 days from transplant'
    },
    benefits: [
      'High yield',
      'Sweet flavor',
      'Continuous harvest',
      'Nutritious'
    ],
    tags: ['vegetable', 'edible', 'seeds', 'summer'],
    plantingInstructions: 'Start seeds indoors 6-8 weeks before last frost. Transplant outdoors when soil temperature reaches 60°F.',
    commonProblems: [
      {
        problem: 'Blossom end rot',
        solution: 'Ensure consistent watering and adequate calcium in soil.'
      },
      {
        problem: 'Hornworms',
        solution: 'Hand-pick worms or use Bt (Bacillus thuringiensis) spray.'
      }
    ],
    price: { amount: 3.49, currency: 'USD' }
  }
];

async function seedPlants() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gardening-website', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find a gardener user to assign as the creator
    const gardener = await User.findOne({ role: { $in: ['gardener', 'admin'] } });
    
    if (!gardener) {
      console.log('No gardener or admin user found. Please create a user with gardener or admin role first.');
      process.exit(1);
    }

    console.log(`Using user ${gardener.username} as plant creator`);

    // Clear existing plants (optional - comment out if you want to keep existing plants)
    // await Plant.deleteMany({});
    // console.log('Cleared existing plants');

    // Add the addedBy field to each plant
    const plantsWithCreator = samplePlants.map(plant => ({
      ...plant,
      addedBy: gardener._id
    }));

    // Insert sample plants
    const insertedPlants = await Plant.insertMany(plantsWithCreator);
    console.log(`Successfully inserted ${insertedPlants.length} sample plants`);

    // Display the inserted plants
    insertedPlants.forEach(plant => {
      console.log(`- ${plant.name} (${plant.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding plants:', error);
    process.exit(1);
  }
}

// Run the seed function
seedPlants();
