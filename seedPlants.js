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
  },
  {
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'indoor',
    type: 'plant',
    shortDescription: 'A stunning tropical plant with large, split leaves that adds dramatic flair to any space.',
    fullDescription: 'The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a popular tropical houseplant prized for its large, glossy leaves with distinctive splits and holes. This climbing plant can grow quite large indoors and makes a stunning statement piece. It\'s relatively easy to care for and adapts well to indoor conditions. The plant produces aerial roots that help it climb, and mature plants may even produce edible fruit in ideal conditions.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519336056116-4c4b4b4b4b4b?w=500&h=400&fit=crop',
        alt: 'Monstera Deliciosa with large split leaves',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'indirect',
      water: 'medium',
      soilType: 'well-draining',
      humidity: 'high'
    },
    growthInfo: {
      difficulty: 'intermediate',
      growthRate: 'medium',
      matureSize: {
        height: { value: 300, unit: 'cm' },
        width: { value: 200, unit: 'cm' }
      }
    },
    benefits: [
      'Air purifying',
      'Dramatic appearance',
      'Tropical aesthetic',
      'Low maintenance'
    ],
    tags: ['tropical', 'climbing', 'large-leaves', 'statement-plant'],
    plantingInstructions: 'Plant in well-draining potting mix with moss pole for support. Provide bright, indirect light.',
    commonProblems: [
      {
        problem: 'Yellowing leaves',
        solution: 'Check watering schedule and ensure proper drainage. Yellow leaves often indicate overwatering.'
      },
      {
        problem: 'No leaf splits',
        solution: 'Provide more bright, indirect light. Leaf splits develop with maturity and adequate light.'
      }
    ],
    price: { amount: 45.99, currency: 'USD' },
    featured: true
  },
  {
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    category: 'herbs',
    type: 'plant',
    shortDescription: 'A fragrant perennial herb with beautiful purple flowers and calming properties.',
    fullDescription: 'Lavender is a beloved perennial herb known for its distinctive purple flowers and soothing fragrance. This Mediterranean native is not only beautiful but also highly useful. The flowers can be dried for potpourri, used in cooking, or steeped to make calming tea. Lavender is also known to attract beneficial pollinators like bees and butterflies to your garden. It\'s drought-tolerant once established and thrives in sunny, well-drained locations.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=500&h=400&fit=crop',
        alt: 'Purple lavender flowers in bloom',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'direct',
      water: 'low',
      soilType: 'well-draining',
      humidity: 'low'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'medium',
      matureSize: {
        height: { value: 60, unit: 'cm' },
        width: { value: 60, unit: 'cm' }
      },
      harvestTime: 'Late spring to early summer'
    },
    benefits: [
      'Aromatic',
      'Pollinator attractant',
      'Drought tolerant',
      'Medicinal properties'
    ],
    tags: ['perennial', 'aromatic', 'purple', 'medicinal'],
    plantingInstructions: 'Plant in well-draining soil with full sun exposure. Space plants 30-45cm apart.',
    commonProblems: [
      {
        problem: 'Root rot',
        solution: 'Ensure excellent drainage and avoid overwatering. Lavender prefers dry conditions.'
      },
      {
        problem: 'Poor flowering',
        solution: 'Prune after flowering and ensure full sun exposure for best bloom production.'
      }
    ],
    price: { amount: 12.99, currency: 'USD' }
  },
  {
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: 'indoor',
    type: 'plant',
    shortDescription: 'An elegant flowering houseplant that thrives in low light and purifies indoor air.',
    fullDescription: 'The Peace Lily is a popular houseplant known for its elegant white flowers and glossy green leaves. This tropical plant is particularly valued for its ability to thrive in low-light conditions, making it perfect for offices and dimly lit rooms. Peace Lilies are excellent air purifiers, removing toxins like formaldehyde, benzene, and ammonia from indoor air. The plant will tell you when it needs water by drooping its leaves, making it very forgiving for forgetful plant parents.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=400&fit=crop',
        alt: 'Peace Lily with white flowers and green leaves',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'low',
      water: 'medium',
      soilType: 'well-draining',
      humidity: 'high'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'medium',
      matureSize: {
        height: { value: 60, unit: 'cm' },
        width: { value: 60, unit: 'cm' }
      }
    },
    benefits: [
      'Air purifying',
      'Low light tolerant',
      'Flowering',
      'Easy care'
    ],
    tags: ['flowering', 'low-light', 'air-purifier', 'tropical'],
    plantingInstructions: 'Plant in well-draining potting mix. Keep soil consistently moist but not soggy.',
    commonProblems: [
      {
        problem: 'Brown leaf tips',
        solution: 'Increase humidity and ensure consistent watering. Brown tips often indicate dry air.'
      },
      {
        problem: 'No flowers',
        solution: 'Provide bright, indirect light and ensure the plant is mature enough to flower.'
      }
    ],
    price: { amount: 18.99, currency: 'USD' }
  },
  {
    name: 'Rosemary',
    scientificName: 'Rosmarinus officinalis',
    category: 'herbs',
    type: 'plant',
    shortDescription: 'A hardy evergreen herb with aromatic needle-like leaves perfect for cooking.',
    fullDescription: 'Rosemary is a woody, evergreen herb native to the Mediterranean region. Its needle-like leaves are highly aromatic and are a staple in Mediterranean cuisine. This hardy perennial can be grown both indoors and outdoors, and it\'s particularly drought-tolerant once established. Rosemary is also known for its ornamental value, producing small blue flowers in spring. The plant has been used for centuries for both culinary and medicinal purposes.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
        alt: 'Rosemary herb with needle-like leaves',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'direct',
      water: 'low',
      soilType: 'well-draining',
      humidity: 'low'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'slow',
      matureSize: {
        height: { value: 120, unit: 'cm' },
        width: { value: 90, unit: 'cm' }
      },
      harvestTime: 'Year-round'
    },
    benefits: [
      'Culinary use',
      'Drought tolerant',
      'Evergreen',
      'Aromatic'
    ],
    tags: ['culinary', 'evergreen', 'drought-tolerant', 'mediterranean'],
    plantingInstructions: 'Plant in well-draining soil with full sun. Space plants 60-90cm apart for outdoor planting.',
    commonProblems: [
      {
        problem: 'Root rot',
        solution: 'Ensure excellent drainage and avoid overwatering. Rosemary prefers dry conditions.'
      },
      {
        problem: 'Leggy growth',
        solution: 'Prune regularly to encourage bushier growth and prevent woody, leggy stems.'
      }
    ],
    price: { amount: 8.99, currency: 'USD' }
  },
  {
    name: 'Pothos Golden',
    scientificName: 'Epipremnum aureum',
    category: 'indoor',
    type: 'plant',
    shortDescription: 'A trailing vine with heart-shaped leaves that\'s perfect for beginners and hanging baskets.',
    fullDescription: 'The Golden Pothos is one of the most popular houseplants due to its incredible ease of care and beautiful trailing habit. This tropical vine features heart-shaped leaves with golden variegation that brightens any space. It\'s extremely forgiving and can tolerate a wide range of conditions, making it perfect for beginners. Pothos can be grown in hanging baskets, trained up moss poles, or allowed to trail from shelves. It\'s also an excellent air purifier.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
        alt: 'Golden Pothos trailing vine with variegated leaves',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'indirect',
      water: 'low',
      soilType: 'well-draining',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'fast',
      matureSize: {
        height: { value: 300, unit: 'cm' },
        width: { value: 30, unit: 'cm' }
      }
    },
    benefits: [
      'Air purifying',
      'Easy propagation',
      'Trailing habit',
      'Low maintenance'
    ],
    tags: ['trailing', 'variegated', 'easy-care', 'air-purifier'],
    plantingInstructions: 'Plant in well-draining potting mix. Can be grown in soil or water. Provide support for climbing.',
    commonProblems: [
      {
        problem: 'Loss of variegation',
        solution: 'Provide more bright, indirect light. Variegation fades in low light conditions.'
      },
      {
        problem: 'Yellow leaves',
        solution: 'Check watering schedule. Yellow leaves often indicate overwatering or underwatering.'
      }
    ],
    price: { amount: 14.99, currency: 'USD' }
  },
  {
    name: 'Mint',
    scientificName: 'Mentha spicata',
    category: 'herbs',
    type: 'plant',
    shortDescription: 'A refreshing herb perfect for teas, cocktails, and cooking with rapid spreading growth.',
    fullDescription: 'Mint is a fast-growing, aromatic herb that\'s incredibly versatile in the kitchen. Its refreshing flavor is perfect for teas, cocktails, desserts, and savory dishes. Mint spreads rapidly through underground runners, so it\'s best grown in containers to prevent it from taking over your garden. This perennial herb is very easy to grow and can be harvested throughout the growing season. Fresh mint leaves are much more flavorful than dried ones.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
        alt: 'Fresh mint leaves on green stems',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'medium',
      water: 'high',
      soilType: 'moist',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'fast',
      matureSize: {
        height: { value: 45, unit: 'cm' },
        width: { value: 60, unit: 'cm' }
      },
      harvestTime: 'Year-round'
    },
    benefits: [
      'Culinary use',
      'Fast growing',
      'Aromatic',
      'Easy propagation'
    ],
    tags: ['culinary', 'fast-growing', 'aromatic', 'spreading'],
    plantingInstructions: 'Plant in containers to control spreading. Keep soil consistently moist and provide partial shade.',
    commonProblems: [
      {
        problem: 'Invasive spreading',
        solution: 'Always grow mint in containers to prevent it from taking over your garden.'
      },
      {
        problem: 'Wilting',
        solution: 'Increase watering frequency. Mint prefers consistently moist soil.'
      }
    ],
    price: { amount: 6.99, currency: 'USD' }
  },
  {
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    category: 'indoor',
    type: 'plant',
    shortDescription: 'A striking houseplant with large, glossy leaves that makes a bold statement.',
    fullDescription: 'The Rubber Plant is a popular houseplant known for its large, glossy, dark green leaves that create a bold architectural statement. This tropical plant can grow quite tall indoors and is relatively low-maintenance once established. The Rubber Plant is excellent for purifying indoor air and adds a touch of tropical elegance to any space. It\'s particularly popular in modern and minimalist interior designs due to its clean, architectural form.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509423350716-97f2360af44e?w=500&h=400&fit=crop',
        alt: 'Rubber Plant with large glossy green leaves',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'indirect',
      water: 'medium',
      soilType: 'well-draining',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'intermediate',
      growthRate: 'medium',
      matureSize: {
        height: { value: 300, unit: 'cm' },
        width: { value: 150, unit: 'cm' }
      }
    },
    benefits: [
      'Air purifying',
      'Architectural form',
      'Low maintenance',
      'Modern aesthetic'
    ],
    tags: ['large-leaves', 'architectural', 'air-purifier', 'modern'],
    plantingInstructions: 'Plant in well-draining potting mix. Provide bright, indirect light and rotate regularly.',
    commonProblems: [
      {
        problem: 'Leaf drop',
        solution: 'Maintain consistent watering and avoid sudden temperature changes or drafts.'
      },
      {
        problem: 'Brown leaf edges',
        solution: 'Increase humidity and ensure the plant isn\'t receiving too much direct sunlight.'
      }
    ],
    price: { amount: 32.99, currency: 'USD' }
  },
  {
    name: 'Cilantro',
    scientificName: 'Coriandrum sativum',
    category: 'herbs',
    type: 'plant',
    shortDescription: 'A fast-growing herb essential for Mexican, Asian, and Middle Eastern cuisines.',
    fullDescription: 'Cilantro, also known as coriander, is a fast-growing annual herb that\'s essential in many world cuisines. The fresh leaves are used in Mexican, Asian, and Middle Eastern dishes, while the seeds (coriander) are used as a spice. Cilantro grows quickly and can be harvested multiple times throughout the season. It\'s best grown in cool weather as it tends to bolt (flower) quickly in hot temperatures. The plant produces small white or pink flowers that attract beneficial insects.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=400&fit=crop',
        alt: 'Fresh cilantro leaves and stems',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'medium',
      water: 'medium',
      soilType: 'well-draining',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'fast',
      matureSize: {
        height: { value: 50, unit: 'cm' },
        width: { value: 30, unit: 'cm' }
      },
      harvestTime: '3-4 weeks from seed'
    },
    benefits: [
      'Culinary use',
      'Fast growing',
      'Cool season crop',
      'Attracts beneficial insects'
    ],
    tags: ['culinary', 'fast-growing', 'cool-season', 'annual'],
    plantingInstructions: 'Sow seeds directly in garden or containers. Plant in cool weather for best results.',
    commonProblems: [
      {
        problem: 'Bolting (flowering too early)',
        solution: 'Plant in cool weather and provide partial shade. Harvest leaves regularly to delay bolting.'
      },
      {
        problem: 'Poor germination',
        solution: 'Soak seeds overnight before planting and keep soil consistently moist during germination.'
      }
    ],
    price: { amount: 3.99, currency: 'USD' }
  },
  {
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    category: 'indoor',
    type: 'plant',
    shortDescription: 'An easy-care houseplant that produces baby plantlets and thrives in various conditions.',
    fullDescription: 'The Spider Plant is one of the most popular and easy-care houseplants, perfect for beginners. It features long, arching leaves with white stripes and produces small white flowers followed by baby plantlets (spiderettes) that hang from the mother plant. These plantlets can be easily propagated to create new plants. Spider Plants are excellent air purifiers and can tolerate a wide range of conditions, making them very forgiving for plant parents.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=400&fit=crop',
        alt: 'Spider Plant with variegated leaves and baby plantlets',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'indirect',
      water: 'medium',
      soilType: 'well-draining',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'fast',
      matureSize: {
        height: { value: 60, unit: 'cm' },
        width: { value: 60, unit: 'cm' }
      }
    },
    benefits: [
      'Air purifying',
      'Easy propagation',
      'Low maintenance',
      'Pet safe'
    ],
    tags: ['easy-care', 'variegated', 'propagation', 'pet-safe'],
    plantingInstructions: 'Plant in well-draining potting mix. Can be grown in hanging baskets or on shelves.',
    commonProblems: [
      {
        problem: 'Brown leaf tips',
        solution: 'Use filtered water or let tap water sit overnight. Fluoride in tap water can cause brown tips.'
      },
      {
        problem: 'No baby plantlets',
        solution: 'Ensure the plant is mature and receiving adequate light. Plantlets develop on mature plants.'
      }
    ],
    price: { amount: 11.99, currency: 'USD' }
  },
  {
    name: 'Lettuce Seeds - Mixed Greens',
    scientificName: 'Lactuca sativa',
    category: 'vegetables',
    type: 'seed',
    shortDescription: 'A mix of lettuce varieties perfect for fresh salads and continuous harvesting.',
    fullDescription: 'This mixed lettuce seed packet contains a variety of lettuce types including romaine, butterhead, and leaf lettuce varieties. Perfect for creating fresh, homegrown salads throughout the growing season. Lettuce is a cool-season crop that grows quickly and can be harvested as baby greens or allowed to mature. The mix provides different textures, colors, and flavors for diverse salad combinations. Succession planting ensures continuous harvest.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&h=400&fit=crop',
        alt: 'Fresh mixed lettuce greens in a garden',
        isPrimary: true
      }
    ],
    careInstructions: {
      sunlight: 'medium',
      water: 'high',
      soilType: 'well-draining',
      humidity: 'medium'
    },
    growthInfo: {
      difficulty: 'beginner',
      growthRate: 'fast',
      matureSize: {
        height: { value: 25, unit: 'cm' },
        width: { value: 20, unit: 'cm' }
      },
      harvestTime: '30-60 days from seed'
    },
    benefits: [
      'Fast growing',
      'Continuous harvest',
      'Nutritious',
      'Cool season crop'
    ],
    tags: ['vegetable', 'fast-growing', 'cool-season', 'salad'],
    plantingInstructions: 'Sow seeds thinly in rows or broadcast. Keep soil consistently moist and provide partial shade.',
    commonProblems: [
      {
        problem: 'Bolting (flowering)',
        solution: 'Plant in cool weather and provide shade. Harvest leaves regularly to delay bolting.'
      },
      {
        problem: 'Bitter taste',
        solution: 'Ensure consistent moisture and avoid letting soil dry out completely.'
      }
    ],
    price: { amount: 2.99, currency: 'USD' }
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
