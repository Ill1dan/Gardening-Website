const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Article = require('./models/Article');

// Sample articles data
const sampleArticles = [
  {
    title: "10 Essential Tips for Beginner Gardeners",
    excerpt: "Starting your gardening journey? Here are the fundamental tips every new gardener should know to ensure success from day one.",
    content: `Starting a garden can be both exciting and overwhelming for beginners. With so much information available, it's easy to feel lost. Here are 10 essential tips that will set you on the right path:

## 1. Start Small
Don't try to plant everything at once. Begin with a small plot or container garden to learn the basics.

## 2. Know Your Zone
Understanding your USDA hardiness zone helps you choose plants that will thrive in your climate.

## 3. Test Your Soil
Get a soil test to understand your soil's pH and nutrient levels. This will guide your plant selection and fertilization needs.

## 4. Choose the Right Location
Most vegetables need 6-8 hours of direct sunlight daily. Observe your space throughout the day to find the best spots.

## 5. Water Consistently
Establish a regular watering schedule. Most plants prefer deep, infrequent watering over shallow, frequent watering.

## 6. Mulch Your Garden
Mulching helps retain moisture, suppress weeds, and regulate soil temperature.

## 7. Learn About Companion Planting
Some plants grow better together. For example, tomatoes and basil are great companions.

## 8. Keep a Garden Journal
Record what you plant, when you plant it, and how it performs. This helps you learn and improve each season.

## 9. Be Patient
Gardening is a learning process. Don't get discouraged by failures - they're valuable lessons.

## 10. Connect with Other Gardeners
Join local gardening groups or online communities to learn from experienced gardeners.

> **Remember**: Every expert gardener was once a beginner. The key is to start, learn from your mistakes, and keep growing!`,
    category: "beginner-guides",
    tags: ["beginner", "tips", "gardening", "new-gardeners", "basics"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "A beginner gardener planting seeds in a small garden bed"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Small garden bed with young plants",
        caption: "Start with a small garden bed to learn the basics"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Garden tools and supplies",
        caption: "Essential tools for beginner gardeners"
      }
    ],
    status: "published",
    featured: true
  },
  {
    title: "The Complete Guide to Composting at Home",
    excerpt: "Transform your kitchen scraps and yard waste into nutrient-rich compost with this comprehensive guide to home composting.",
    content: `Composting is nature's way of recycling organic matter into nutrient-rich soil amendment. It's easier than you might think and incredibly beneficial for your garden. Here's everything you need to know:

## What is Compost?
Compost is decomposed organic matter that provides essential nutrients to plants and improves soil structure. It's often called "black gold" by gardeners.

## Benefits of Composting
- Reduces kitchen and yard waste
- Creates nutrient-rich soil amendment
- Improves soil structure and water retention
- Reduces the need for chemical fertilizers
- Helps suppress plant diseases

## What to Compost
**Green Materials (Nitrogen-rich):**
- Fruit and vegetable scraps
- Coffee grounds and filters
- Tea bags
- Grass clippings
- Plant trimmings

**Brown Materials (Carbon-rich):**
- Dry leaves
- Straw and hay
- Shredded newspaper
- Cardboard
- Wood chips

## What NOT to Compost
- Meat, fish, and dairy products
- Oily foods
- Diseased plants
- Weeds with seeds
- Pet waste
- Coal or charcoal ash

## Composting Methods

### 1. Bin Composting
Use a compost bin or tumbler for contained composting. This method is great for small spaces and keeps pests out.

### 2. Pile Composting
Create a compost pile directly on the ground. This method works well for larger gardens with more space.

### 3. Vermicomposting
Use worms to break down organic matter. This method is excellent for apartment dwellers and produces high-quality compost quickly.

## Getting Started
1. Choose your composting method
2. Find a suitable location (partial shade works best)
3. Start with a 3:1 ratio of brown to green materials
4. Turn your compost regularly to aerate it
5. Keep it moist but not soggy

## Troubleshooting Common Issues
- **Smelly compost**: Add more brown materials and turn more frequently
- **Slow decomposition**: Add more green materials and ensure proper moisture
- **Pests**: Cover food scraps with brown materials and maintain proper ratios

With patience and practice, you'll soon have rich, dark compost to nourish your garden!`,
    category: "soil-fertilizer",
    tags: ["composting", "organic", "soil", "sustainability", "recycling"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=400&fit=crop",
      alt: "A compost bin with organic materials being added"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=400&fit=crop",
        alt: "Compost bin with kitchen scraps",
        caption: "Kitchen scraps are perfect for composting"
      },
      {
        url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=400&fit=crop",
        alt: "Finished compost being used in garden",
        caption: "Rich, finished compost ready for your garden"
      }
    ],
    status: "published",
    featured: true
  },
  {
    title: "Indoor Plant Care: Keeping Your Houseplants Thriving",
    excerpt: "Master the art of indoor gardening with these expert tips for keeping your houseplants healthy and beautiful year-round.",
    content: `Indoor plants bring life, color, and fresh air into our homes. However, many people struggle to keep their houseplants healthy. Here's your complete guide to indoor plant care:

## Understanding Your Plants' Needs

### Light Requirements
Different plants have different light needs:
- **Bright, direct light**: Succulents, cacti, and some flowering plants
- **Bright, indirect light**: Most tropical plants, fiddle leaf figs
- **Medium light**: Snake plants, pothos, philodendrons
- **Low light**: ZZ plants, peace lilies, some ferns

### Watering Guidelines
The most common cause of houseplant death is overwatering. Here's how to water correctly:

1. **Check soil moisture**: Stick your finger 1-2 inches into the soil
2. **Water when dry**: Only water when the top inch of soil is dry
3. **Water thoroughly**: Water until it runs out the drainage holes
4. **Empty saucers**: Don't let plants sit in standing water

### Humidity and Temperature
- Most houseplants prefer 40-60% humidity
- Keep temperatures between 65-75°F (18-24°C)
- Avoid placing plants near heating vents or air conditioners

## Essential Care Tips

### Choosing the Right Pot
- Ensure drainage holes
- Size appropriately (not too big, not too small)
- Use quality potting mix

### Fertilizing
- Feed during growing season (spring/summer)
- Use balanced, water-soluble fertilizer
- Follow package instructions for dilution

### Repotting
- Repot when roots are crowded
- Choose a pot only 1-2 inches larger
- Use fresh potting mix

## Common Problems and Solutions

### Yellow Leaves
- Usually indicates overwatering
- Check soil moisture and adjust watering schedule

### Brown Leaf Tips
- Often caused by low humidity or over-fertilizing
- Increase humidity or reduce fertilizer

### Dropping Leaves
- Can indicate underwatering, overwatering, or stress
- Check all care factors and adjust accordingly

### Pests
- Common pests: spider mites, mealybugs, scale
- Treat with insecticidal soap or neem oil
- Isolate affected plants

## Best Indoor Plants for Beginners
1. **Snake Plant**: Nearly indestructible, low light tolerant
2. **Pothos**: Fast-growing, easy to propagate
3. **ZZ Plant**: Drought-tolerant, low maintenance
4. **Peace Lily**: Beautiful flowers, forgiving nature
5. **Spider Plant**: Easy to care for, produces baby plants

## Seasonal Care
- **Spring**: Increase watering, start fertilizing, repot if needed
- **Summer**: Regular watering, watch for pests, provide adequate humidity
- **Fall**: Reduce watering and fertilizing
- **Winter**: Minimal watering, no fertilizing, protect from cold drafts

Remember, every plant is different. Take time to learn about your specific plants' needs, and don't be afraid to experiment. With patience and attention, your indoor garden will flourish!`,
    category: "indoor-gardening",
    tags: ["indoor-plants", "houseplants", "care", "tips", "beginner"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "Beautiful indoor plants arranged in a modern living room"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Person watering indoor plants",
        caption: "Proper watering is key to healthy houseplants"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Various indoor plants on a windowsill",
        caption: "Group plants with similar care needs together"
      }
    ],
    status: "published",
    featured: false
  },
  {
    title: "Natural Pest Control Methods for Your Garden",
    excerpt: "Protect your garden from pests using eco-friendly methods that won't harm beneficial insects or the environment.",
    content: `Pests can wreak havoc on your garden, but chemical pesticides often do more harm than good. Here are effective natural pest control methods that protect your plants while preserving beneficial insects and the environment:

## Understanding Garden Pests

### Common Garden Pests
- **Aphids**: Small, soft-bodied insects that suck plant sap
- **Caterpillars**: Larval stage of butterflies and moths
- **Slugs and Snails**: Mollusks that eat plant leaves
- **Spider Mites**: Tiny arachnids that cause leaf damage
- **Whiteflies**: Small flying insects that feed on plant sap

## Natural Pest Control Methods

### 1. Beneficial Insects
Encourage natural predators in your garden:
- **Ladybugs**: Eat aphids and other soft-bodied insects
- **Lacewings**: Feed on aphids, mites, and small caterpillars
- **Praying mantises**: General predators of many garden pests
- **Parasitic wasps**: Lay eggs in pest insects

**How to attract beneficial insects:**
- Plant flowers like dill, fennel, and yarrow
- Provide water sources
- Avoid broad-spectrum pesticides

### 2. Companion Planting
Some plants naturally repel pests:
- **Marigolds**: Repel nematodes and some beetles
- **Basil**: Deters aphids and mosquitoes
- **Nasturtiums**: Trap aphids and attract beneficial insects
- **Garlic and onions**: Repel many pests

### 3. Physical Barriers
- **Row covers**: Protect plants from flying insects
- **Copper tape**: Deters slugs and snails
- **Collars**: Prevent cutworms from reaching stems
- **Netting**: Keep birds and larger pests away

### 4. Homemade Sprays

**Neem Oil Spray:**
- Mix 2 tablespoons neem oil with 1 gallon water
- Add a few drops of dish soap as emulsifier
- Spray on affected plants every 7-14 days

**Garlic Spray:**
- Blend 2 garlic bulbs with 1 quart water
- Let steep for 24 hours, then strain
- Dilute with 1 gallon water before spraying

**Soap Spray:**
- Mix 1 tablespoon liquid soap with 1 quart water
- Spray directly on pests (not beneficial insects)

### 5. Cultural Practices
- **Crop rotation**: Prevents pest buildup
- **Proper spacing**: Reduces pest spread
- **Clean garden**: Remove debris where pests hide
- **Healthy soil**: Strong plants resist pests better

## Integrated Pest Management (IPM)

### Step 1: Monitor
Regularly inspect your plants for signs of pests

### Step 2: Identify
Correctly identify the pest to choose appropriate control

### Step 3: Threshold
Determine if pest levels require action

### Step 4: Control
Use the least harmful method first

### Step 5: Evaluate
Assess the effectiveness of your control method

## Prevention Tips
- Choose pest-resistant plant varieties
- Plant at the right time
- Maintain proper plant nutrition
- Keep garden clean and weed-free
- Encourage biodiversity

## When to Use Chemical Controls
Only use chemical pesticides as a last resort:
- When natural methods fail
- When pest damage threatens plant survival
- Choose targeted, low-toxicity options
- Follow all label instructions carefully

Remember, a healthy garden ecosystem with diverse plants and beneficial insects is your best defense against pests. Work with nature, not against it!`,
    category: "pest-control",
    tags: ["pest-control", "organic", "natural", "beneficial-insects", "eco-friendly"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "Ladybug on a plant leaf, representing natural pest control"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Marigolds planted among vegetables",
        caption: "Marigolds naturally repel many garden pests"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Person spraying plants with natural spray",
        caption: "Homemade sprays can be effective pest deterrents"
      }
    ],
    status: "published",
    featured: false
  },
  {
    title: "Seasonal Gardening: What to Plant When",
    excerpt: "Plan your garden year-round with this comprehensive guide to seasonal planting and garden maintenance.",
    content: `Successful gardening requires understanding the seasons and timing your activities accordingly. Here's your complete guide to seasonal gardening:

## Spring Gardening (March-May)

### Early Spring Tasks
- **Clean up**: Remove winter debris and dead plant material
- **Soil preparation**: Test soil, add compost, and prepare beds
- **Tool maintenance**: Clean and sharpen garden tools
- **Planning**: Plan your garden layout and order seeds

### Spring Planting
**Cool-season vegetables:**
- Lettuce, spinach, kale, radishes
- Peas, broccoli, cabbage, cauliflower
- Onions, garlic, potatoes

**Flowers:**
- Pansies, violas, snapdragons
- Sweet peas, calendula, bachelor's buttons

### Spring Care
- Start seeds indoors for warm-season crops
- Begin hardening off seedlings
- Apply mulch to retain moisture
- Start regular watering schedule

## Summer Gardening (June-August)

### Summer Planting
**Warm-season vegetables:**
- Tomatoes, peppers, eggplants
- Cucumbers, squash, melons
- Beans, corn, okra

**Flowers:**
- Marigolds, zinnias, sunflowers
- Petunias, geraniums, impatiens

### Summer Care
- Water deeply and regularly
- Mulch to conserve moisture
- Harvest regularly to encourage production
- Watch for pests and diseases
- Provide shade for heat-sensitive plants

## Fall Gardening (September-November)

### Fall Planting
**Cool-season crops (second planting):**
- Lettuce, spinach, arugula
- Radishes, turnips, carrots
- Broccoli, Brussels sprouts

**Bulbs for spring:**
- Tulips, daffodils, crocuses
- Alliums, hyacinths, irises

### Fall Care
- Harvest remaining warm-season crops
- Plant cover crops to improve soil
- Clean up spent plants
- Prepare beds for winter
- Store tender bulbs and tubers

## Winter Gardening (December-February)

### Winter Tasks
- **Planning**: Order seeds and plan next year's garden
- **Tool maintenance**: Clean and repair tools
- **Indoor gardening**: Grow herbs and microgreens indoors
- **Education**: Read gardening books and attend workshops

### Winter Protection
- Mulch perennial plants
- Protect tender plants from frost
- Maintain indoor plants
- Plan crop rotation for next season

## Climate Considerations

### Cold Climates (Zones 1-5)
- Short growing season
- Focus on cool-season crops
- Use season extenders (cold frames, row covers)
- Start seeds indoors early

### Temperate Climates (Zones 6-8)
- Long growing season
- Can grow both cool and warm-season crops
- Succession planting possible
- Extended harvest periods

### Warm Climates (Zones 9-11)
- Year-round growing possible
- Focus on heat-tolerant varieties
- Provide shade during hottest months
- Plant in fall and winter for best results

## Succession Planting
Maximize your harvest with succession planting:
- Plant crops in intervals (every 2-3 weeks)
- Use different maturity dates
- Replace harvested crops with new ones
- Plan for continuous harvest

## Crop Rotation
Rotate crops to prevent disease and maintain soil health:
- Group plants by family
- Don't plant same family in same spot for 3-4 years
- Include cover crops in rotation
- Plan rotation schedule in advance

## Seasonal Challenges and Solutions

### Spring Challenges
- **Late frosts**: Use row covers and cold frames
- **Wet soil**: Wait for soil to dry before planting
- **Temperature fluctuations**: Choose hardy varieties

### Summer Challenges
- **Heat stress**: Provide shade and extra water
- **Pest pressure**: Use integrated pest management
- **Drought**: Implement water conservation techniques

### Fall Challenges
- **Early frosts**: Harvest tender crops early
- **Shorter days**: Choose quick-maturing varieties
- **Storage**: Properly store harvested crops

### Winter Challenges
- **Limited growing**: Focus on indoor gardening
- **Equipment storage**: Properly store tools and supplies
- **Planning**: Use downtime for garden planning

Remember, gardening is a continuous learning process. Keep records of what works in your specific climate and adjust your timing accordingly. Each season brings new opportunities and challenges - embrace them all!`,
    category: "seasonal-guides",
    tags: ["seasonal", "planning", "timing", "crop-rotation", "succession-planting"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "A garden showing different seasonal plants and vegetables"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Spring garden with young seedlings",
        caption: "Spring is the perfect time to start your garden"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Fall harvest of vegetables",
        caption: "Fall brings abundant harvests and preparation for winter"
      }
    ],
    status: "published",
    featured: false
  }
];

async function seedArticles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gardening-website', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find a gardener user to be the author
    const gardener = await User.findOne({ role: 'gardener' });
    if (!gardener) {
      console.log('No gardener found. Please create a gardener user first.');
      return;
    }

    console.log(`Found gardener: ${gardener.firstName} ${gardener.lastName}`);

    // Create articles
    for (const articleData of sampleArticles) {
      const article = new Article({
        ...articleData,
        author: gardener._id
      });
      
      await article.save();
      console.log(`Created article: ${article.title}`);
    }

    console.log(`Successfully created ${sampleArticles.length} sample articles`);
    
  } catch (error) {
    console.error('Error seeding articles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedArticles();
