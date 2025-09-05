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
  },
  {
    title: "Hydroponic Gardening: Growing Without Soil",
    excerpt: "Discover the fascinating world of hydroponic gardening and learn how to grow fresh vegetables and herbs without traditional soil.",
    content: `Hydroponic gardening is revolutionizing how we grow plants by eliminating the need for soil. This innovative method allows plants to grow in nutrient-rich water solutions, often resulting in faster growth and higher yields.

## What is Hydroponics?

Hydroponics is a method of growing plants using mineral nutrient solutions in water, without soil. The word "hydroponic" comes from the Greek words "hydro" (water) and "ponos" (labor), meaning "water working."

## Benefits of Hydroponic Gardening

### Faster Growth
Plants grow 30-50% faster than in soil because nutrients are directly available to roots.

### Higher Yields
Controlled environment and optimal nutrition lead to significantly higher crop yields.

### Water Efficiency
Uses 90% less water than traditional soil gardening.

### Space Efficiency
Can grow more plants in less space, perfect for urban environments.

### Year-Round Growing
Indoor hydroponic systems allow growing regardless of weather conditions.

## Types of Hydroponic Systems

### 1. Deep Water Culture (DWC)
- Plants float on nutrient solution
- Roots submerged in water
- Simple and cost-effective
- Great for beginners

### 2. Nutrient Film Technique (NFT)
- Thin film of nutrient solution flows over roots
- Continuous flow system
- Efficient water and nutrient use
- Popular for leafy greens

### 3. Ebb and Flow (Flood and Drain)
- Periodically floods growing medium
- Drains back to reservoir
- Versatile system
- Good for various plant types

### 4. Drip System
- Nutrient solution drips onto growing medium
- Precise control over feeding
- Scalable system
- Commercial applications

### 5. Aeroponics
- Roots suspended in air
- Nutrient solution sprayed as mist
- Maximum oxygen exposure
- Advanced system

## Getting Started with Hydroponics

### Essential Equipment
- Growing container or system
- Nutrient solution
- Growing medium (rockwool, clay pellets, perlite)
- pH testing kit
- EC meter (electrical conductivity)
- Grow lights (for indoor systems)
- Air pump and air stones

### Choosing Plants
**Best plants for beginners:**
- Lettuce and leafy greens
- Herbs (basil, mint, cilantro)
- Tomatoes
- Peppers
- Strawberries

### Nutrient Solutions
- Complete hydroponic nutrient mix
- Maintain proper pH (5.5-6.5)
- Monitor EC levels regularly
- Change solution every 1-2 weeks

## Common Challenges and Solutions

### pH Imbalance
- Test pH regularly
- Use pH up/down solutions
- Maintain stable pH levels

### Nutrient Deficiencies
- Monitor plant appearance
- Adjust nutrient concentrations
- Ensure proper mixing

### Root Rot
- Maintain proper oxygen levels
- Use air stones
- Keep water temperature cool

### Algae Growth
- Block light from nutrient solution
- Use opaque containers
- Maintain clean system

## Indoor vs Outdoor Hydroponics

### Indoor Systems
- Complete environmental control
- Year-round growing
- Requires grow lights
- Higher initial investment

### Outdoor Systems
- Natural sunlight
- Lower energy costs
- Weather dependent
- Seasonal limitations

## Maintenance Tips

### Daily Tasks
- Check water levels
- Monitor plant health
- Adjust pH if needed

### Weekly Tasks
- Change nutrient solution
- Clean system components
- Prune plants as needed

### Monthly Tasks
- Deep clean entire system
- Replace growing medium
- Check equipment functionality

## Cost Considerations

### Initial Investment
- System setup: $50-500+
- Grow lights: $100-1000+
- Nutrients: $20-50/month
- Testing equipment: $50-100

### Ongoing Costs
- Electricity (lights and pumps)
- Nutrient solutions
- Replacement parts
- Water (minimal)

## Environmental Benefits

- Reduces water usage
- Eliminates soil erosion
- Reduces pesticide needs
- Enables urban farming
- Reduces transportation costs

Hydroponic gardening offers an exciting alternative to traditional soil-based growing. While it requires initial investment and learning, the benefits of faster growth, higher yields, and year-round production make it an attractive option for serious gardeners and urban farmers alike.`,
    category: "advanced-techniques",
    tags: ["hydroponics", "soil-less", "indoor-gardening", "urban-farming", "advanced"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "Hydroponic system with growing plants in nutrient solution"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Close-up of plant roots in hydroponic system",
        caption: "Healthy roots thriving in nutrient-rich water"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Indoor hydroponic garden with LED lights",
        caption: "Modern indoor hydroponic setup with LED grow lights"
      }
    ],
    status: "published",
    featured: true
  },
  {
    title: "Essential Garden Tools Every Gardener Needs",
    excerpt: "Build your gardening toolkit with these essential tools that will make your gardening tasks easier and more efficient.",
    content: `Having the right tools makes all the difference in gardening success. Whether you're a beginner or experienced gardener, these essential tools will help you maintain a beautiful and productive garden.

## Hand Tools

### 1. Hand Trowel
**Essential for:**
- Planting small plants and bulbs
- Transplanting seedlings
- Digging small holes
- Mixing soil amendments

**What to look for:**
- Comfortable grip
- Sturdy construction
- Sharp, pointed blade
- Rust-resistant material

### 2. Hand Fork (Cultivator)
**Essential for:**
- Breaking up compacted soil
- Removing weeds
- Mixing compost into soil
- Aerating around plants

**Features:**
- Three or four sturdy tines
- Comfortable handle
- Durable construction

### 3. Pruning Shears (Secateurs)
**Essential for:**
- Deadheading flowers
- Pruning small branches
- Harvesting vegetables
- Shaping plants

**Types:**
- **Bypass pruners**: Clean cuts, best for live plants
- **Anvil pruners**: Crushing action, good for dead wood
- **Ratchet pruners**: Easier cutting for thicker branches

### 4. Garden Knife (Hori-Hori)
**Essential for:**
- Cutting roots
- Dividing perennials
- Harvesting root vegetables
- Weeding

**Features:**
- Sharp blade on one side
- Serrated edge on the other
- Measurement markings
- Comfortable handle

## Digging Tools

### 5. Spade
**Essential for:**
- Digging holes
- Edging beds
- Moving soil
- Planting trees and shrubs

**Types:**
- **Square spade**: Best for digging holes
- **Round spade**: Better for moving soil
- **Border spade**: Smaller, lighter version

### 6. Garden Fork
**Essential for:**
- Turning compost
- Breaking up heavy soil
- Harvesting root crops
- Aerating soil

**Features:**
- Four sturdy tines
- Comfortable handle
- Durable construction

### 7. Hoe
**Essential for:**
- Weeding between rows
- Creating furrows for planting
- Cultivating soil surface
- Hilling up plants

**Types:**
- **Draw hoe**: Pulling action, good for weeding
- **Push hoe**: Pushing action, good for cultivation
- **Warren hoe**: Triangular blade, versatile

## Watering Tools

### 8. Watering Can
**Essential for:**
- Watering seedlings
- Applying liquid fertilizers
- Watering container plants
- Precise watering control

**Features:**
- Removable rose (sprinkler head)
- Comfortable handle
- Appropriate size for your needs
- Rust-resistant material

### 9. Garden Hose
**Essential for:**
- Watering large areas
- Connecting to sprinklers
- Cleaning tools and equipment
- General garden maintenance

**Features:**
- Flexible material
- Appropriate length
- Quality connectors
- Kink-resistant design

### 10. Hose Nozzle
**Essential for:**
- Controlling water flow
- Different spray patterns
- Watering different plant types
- Efficient water use

**Types:**
- **Adjustable nozzle**: Multiple spray patterns
- **Shut-off nozzle**: On/off control
- **Fan nozzle**: Wide, gentle spray

## Specialized Tools

### 11. Wheelbarrow or Garden Cart
**Essential for:**
- Moving soil and compost
- Transporting plants
- Carrying tools
- Harvesting crops

**Features:**
- Sturdy construction
- Appropriate size
- Easy to maneuver
- Weather-resistant

### 12. Garden Gloves
**Essential for:**
- Protecting hands
- Improving grip
- Preventing blisters
- Keeping hands clean

**Types:**
- **Leather gloves**: Durable, good protection
- **Rubber gloves**: Waterproof, good for wet work
- **Cotton gloves**: Lightweight, breathable

### 13. Pruning Saw
**Essential for:**
- Cutting larger branches
- Removing dead wood
- Shaping trees and shrubs
- Emergency pruning

**Features:**
- Sharp, curved blade
- Comfortable handle
- Rust-resistant
- Appropriate size

## Tool Care and Maintenance

### Cleaning
- Clean tools after each use
- Remove soil and debris
- Dry thoroughly
- Apply light oil to prevent rust

### Sharpening
- Keep cutting tools sharp
- Use appropriate sharpening tools
- Follow proper angles
- Test sharpness regularly

### Storage
- Store in dry location
- Hang tools when possible
- Protect from weather
- Organize for easy access

## Tool Selection Tips

### Quality Over Quantity
- Invest in quality tools
- Better performance and durability
- More comfortable to use
- Last longer with proper care

### Right Tool for the Job
- Match tool to task
- Consider your garden size
- Think about your physical needs
- Plan for future expansion

### Comfort Matters
- Choose tools that fit your hands
- Consider handle length
- Test grip comfort
- Look for ergonomic designs

## Budget-Friendly Options

### Start with Basics
- Begin with essential hand tools
- Add tools as needed
- Look for quality used tools
- Consider tool sharing with neighbors

### DIY Alternatives
- Make simple tools from household items
- Repurpose materials
- Create custom solutions
- Learn tool maintenance

## Seasonal Tool Needs

### Spring
- Spades and forks for soil preparation
- Trowels for planting
- Pruners for cleanup
- Cultivators for weeding

### Summer
- Watering tools
- Pruners for maintenance
- Harvesting tools
- Pest control equipment

### Fall
- Rakes for cleanup
- Pruners for trimming
- Spades for planting bulbs
- Storage preparation

### Winter
- Tool maintenance
- Planning and organization
- Indoor gardening tools
- Equipment storage

Remember, the best tools are the ones you'll actually use. Start with the basics and build your collection over time. Proper care and maintenance will ensure your tools serve you well for many gardening seasons to come!`,
    category: "tools-equipment",
    tags: ["tools", "equipment", "gardening-tools", "maintenance", "beginners"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "Collection of essential gardening tools laid out on a table"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Hand tools including trowel, fork, and pruners",
        caption: "Essential hand tools for everyday gardening tasks"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Garden shed with organized tools",
        caption: "Proper tool storage keeps your equipment in good condition"
      }
    ],
    status: "published",
    featured: false
  },
  {
    title: "Container Gardening: Growing Plants in Pots",
    excerpt: "Master the art of container gardening and transform any space into a thriving garden with these expert tips and techniques.",
    content: `Container gardening opens up endless possibilities for growing plants in any space, from small apartments to large patios. Whether you're limited by space or want to add flexibility to your garden, containers offer a versatile solution.

## Benefits of Container Gardening

### Space Efficiency
- Grow plants in any available space
- Perfect for small patios and balconies
- No need for large garden beds
- Maximize vertical space

### Flexibility
- Move plants as needed
- Change arrangements seasonally
- Protect plants from weather
- Easy to relocate

### Control
- Precise soil and drainage control
- Manage watering more easily
- Control plant size and growth
- Isolate plants from pests

### Accessibility
- Brings gardening to any height
- Easier for people with mobility issues
- Convenient for maintenance
- Perfect for children's gardens

## Choosing the Right Containers

### Material Options

**Clay/Terracotta:**
- Natural, porous material
- Good drainage
- Can dry out quickly
- May crack in freezing weather

**Plastic:**
- Lightweight and affordable
- Retains moisture well
- Many colors and styles
- Durable and weather-resistant

**Wood:**
- Natural appearance
- Good insulation
- Can rot over time
- Requires treatment for longevity

**Metal:**
- Modern, sleek appearance
- Durable and long-lasting
- Can heat up in sun
- May need drainage holes

**Fiber/Resin:**
- Lightweight yet durable
- Good insulation properties
- Many decorative options
- Weather-resistant

### Size Considerations

**Small Containers (6-12 inches):**
- Herbs and small flowers
- Succulents and cacti
- Lettuce and radishes
- Perfect for windowsills

**Medium Containers (12-18 inches):**
- Most vegetables
- Small shrubs
- Perennial flowers
- Good for patios

**Large Containers (18+ inches):**
- Trees and large shrubs
- Multiple plant combinations
- Deep-rooted vegetables
- Statement pieces

## Essential Container Features

### Drainage Holes
- Essential for plant health
- Prevent root rot
- Allow excess water to escape
- May need to be added to some containers

### Saucers
- Catch excess water
- Protect surfaces
- Maintain humidity
- Easy to clean

### Handles
- Easier to move containers
- Better for larger pots
- Consider weight when filled
- Look for sturdy construction

## Soil and Drainage

### Potting Mix vs Garden Soil
**Use potting mix because:**
- Better drainage
- Lighter weight
- Sterile (no pests/diseases)
- Proper pH balance

**Avoid garden soil because:**
- Poor drainage in containers
- Too heavy
- May contain pests
- Compacts easily

### Drainage Materials
- Gravel or stones at bottom
- Broken pottery pieces
- Commercial drainage materials
- Landscape fabric

### Soil Amendments
- Perlite for drainage
- Vermiculite for moisture retention
- Compost for nutrients
- Sand for heavy soils

## Plant Selection for Containers

### Best Container Plants

**Vegetables:**
- Tomatoes (determinate varieties)
- Peppers
- Lettuce and leafy greens
- Herbs (basil, parsley, cilantro)
- Radishes and carrots

**Flowers:**
- Petunias and geraniums
- Marigolds and zinnias
- Pansies and violas
- Begonias and impatiens

**Shrubs and Trees:**
- Dwarf varieties
- Japanese maples
- Boxwood
- Roses
- Citrus trees

### Plant Combinations
- Thriller (tall center plant)
- Filler (medium height plants)
- Spiller (trailing plants)
- Consider color and texture
- Match growing requirements

## Watering Container Plants

### Watering Frequency
- Check daily during growing season
- Water when top inch of soil is dry
- More frequent in hot weather
- Less frequent in cool weather

### Watering Techniques
- Water thoroughly until water runs out
- Avoid frequent light watering
- Water in morning when possible
- Use room temperature water

### Signs of Overwatering
- Yellowing leaves
- Wilting despite moist soil
- Mold or fungus growth
- Root rot

### Signs of Underwatering
- Wilting and drooping
- Dry, crispy leaves
- Slow growth
- Soil pulling away from container edges

## Fertilizing Container Plants

### Why Container Plants Need More Fertilizer
- Limited soil volume
- Nutrients wash out with watering
- Plants can't access deeper soil
- Faster nutrient depletion

### Fertilizer Types
- Slow-release granules
- Liquid fertilizers
- Organic options
- Balanced NPK ratios

### Fertilizing Schedule
- Start 4-6 weeks after planting
- Follow package instructions
- Reduce in winter months
- Watch for signs of over-fertilization

## Container Garden Design

### Color Schemes
- Monochromatic (one color family)
- Complementary (opposite colors)
- Analogous (adjacent colors)
- Consider foliage colors too

### Height Variation
- Use plant stands
- Group containers of different heights
- Create visual interest
- Consider plant growth patterns

### Grouping Containers
- Odd numbers work best
- Vary sizes and shapes
- Create focal points
- Consider maintenance access

## Seasonal Container Gardening

### Spring
- Cool-season vegetables
- Spring-blooming flowers
- Start seeds indoors
- Prepare containers

### Summer
- Warm-season vegetables
- Heat-tolerant flowers
- Regular watering schedule
- Provide shade if needed

### Fall
- Fall-blooming flowers
- Cool-season vegetables
- Prepare for winter
- Harvest remaining crops

### Winter
- Evergreen arrangements
- Winter-blooming plants
- Protect from freezing
- Plan for next season

## Common Container Gardening Challenges

### Root Bound Plants
- Repot when roots circle container
- Choose larger container
- Loosen root ball
- Trim excess roots if necessary

### Drainage Problems
- Add more drainage holes
- Improve soil mix
- Use drainage materials
- Check saucer drainage

### Pest Issues
- Isolate affected plants
- Use appropriate treatments
- Maintain plant health
- Regular inspection

### Weather Protection
- Move containers indoors
- Use protective covers
- Group containers together
- Consider plant hardiness

## Maintenance Tips

### Regular Tasks
- Check soil moisture daily
- Remove dead flowers and leaves
- Monitor for pests
- Rotate containers for even growth

### Weekly Tasks
- Fertilize as needed
- Prune and shape plants
- Clean container exteriors
- Check drainage

### Monthly Tasks
- Deep clean containers
- Refresh soil if needed
- Evaluate plant health
- Plan seasonal changes

Container gardening offers endless possibilities for creative expression while providing the flexibility to garden in any space. With proper planning, care, and attention to detail, your container garden can be just as productive and beautiful as any traditional garden!`,
    category: "indoor-gardening",
    tags: ["container-gardening", "pots", "small-spaces", "balcony", "patio"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "Beautiful container garden with various plants in different sized pots"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Herb garden in small containers on windowsill",
        caption: "Small containers perfect for growing herbs indoors"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Colorful flower arrangement in large decorative pot",
        caption: "Create stunning displays with mixed plantings"
      }
    ],
    status: "published",
    featured: false
  },
  {
    title: "Understanding Soil pH and Plant Nutrition",
    excerpt: "Learn how soil pH affects plant growth and discover the essential nutrients your plants need to thrive in your garden.",
    content: `Soil pH and plant nutrition are fundamental aspects of successful gardening that many gardeners overlook. Understanding these concepts can dramatically improve your garden's health and productivity.

## What is Soil pH?

Soil pH measures the acidity or alkalinity of your soil on a scale from 0 to 14, with 7 being neutral. Most garden plants prefer slightly acidic to neutral soil (pH 6.0-7.0).

### pH Scale Breakdown
- **0-6.9**: Acidic (sour soil)
- **7.0**: Neutral
- **7.1-14**: Alkaline (sweet soil)

## Why pH Matters

### Nutrient Availability
Soil pH directly affects nutrient availability to plants:
- **Acidic soils (pH < 6.0)**: Iron, manganese, and aluminum become more available
- **Alkaline soils (pH > 7.5)**: Phosphorus, iron, and zinc become less available
- **Neutral soils (pH 6.0-7.0)**: Optimal nutrient availability for most plants

### Plant Health
- Affects root development
- Influences disease resistance
- Impacts beneficial soil organisms
- Affects water uptake efficiency

## Testing Your Soil pH

### Professional Testing
- Most accurate method
- Provides comprehensive soil analysis
- Includes nutrient recommendations
- Available through extension services

### Home Testing Kits
- Quick and convenient
- Good for regular monitoring
- Multiple test methods available
- Follow instructions carefully

### Digital pH Meters
- Instant readings
- Require calibration
- Good for frequent testing
- May need regular maintenance

## Adjusting Soil pH

### Raising pH (Making Soil Less Acidic)

**Limestone (Calcium Carbonate):**
- Most common method
- Apply in fall or early spring
- Takes 3-6 months to take effect
- Follow soil test recommendations

**Wood Ash:**
- Quick-acting alternative
- Contains potassium and other nutrients
- Use sparingly to avoid over-liming
- Best for slightly acidic soils

**Dolomitic Limestone:**
- Contains both calcium and magnesium
- Good for magnesium-deficient soils
- Slower acting than regular limestone
- Provides additional nutrients

### Lowering pH (Making Soil More Acidic)

**Elemental Sulfur:**
- Most effective long-term solution
- Apply in fall for spring effect
- Requires soil bacteria to convert
- Follow application rates carefully

**Aluminum Sulfate:**
- Quick-acting but temporary
- Can be harmful if overused
- Use sparingly and monitor pH
- Not recommended for regular use

**Organic Matter:**
- Peat moss, pine needles, oak leaves
- Gradual pH reduction
- Improves soil structure
- Sustainable long-term solution

## Essential Plant Nutrients

### Macronutrients (Needed in Large Quantities)

**Nitrogen (N):**
- Promotes leafy growth
- Essential for chlorophyll production
- Deficiency: Yellowing leaves, stunted growth
- Sources: Compost, manure, blood meal

**Phosphorus (P):**
- Root development and flowering
- Energy transfer in plants
- Deficiency: Purple leaves, poor flowering
- Sources: Bone meal, rock phosphate

**Potassium (K):**
- Overall plant health and disease resistance
- Fruit and flower quality
- Deficiency: Brown leaf edges, weak stems
- Sources: Wood ash, kelp meal, greensand

### Secondary Nutrients

**Calcium (Ca):**
- Cell wall development
- Prevents blossom end rot
- Deficiency: Stunted growth, deformed leaves
- Sources: Limestone, gypsum, eggshells

**Magnesium (Mg):**
- Chlorophyll production
- Enzyme activation
- Deficiency: Yellowing between leaf veins
- Sources: Epsom salts, dolomitic limestone

**Sulfur (S):**
- Protein synthesis
- Disease resistance
- Deficiency: Yellowing new growth
- Sources: Gypsum, elemental sulfur

### Micronutrients (Needed in Small Quantities)

**Iron (Fe):**
- Chlorophyll production
- Deficiency: Yellow leaves with green veins
- Sources: Iron chelates, compost

**Zinc (Zn):**
- Enzyme function
- Deficiency: Small leaves, poor growth
- Sources: Zinc sulfate, compost

**Manganese (Mn):**
- Photosynthesis
- Deficiency: Yellow spots on leaves
- Sources: Manganese sulfate, compost

**Boron (B):**
- Cell division and development
- Deficiency: Brittle leaves, poor fruit set
- Sources: Borax, compost

## Reading Fertilizer Labels

### NPK Numbers
Fertilizer labels show three numbers (e.g., 10-10-10):
- **First number**: Nitrogen percentage
- **Second number**: Phosphorus percentage
- **Third number**: Potassium percentage

### Complete vs Incomplete Fertilizers
- **Complete**: Contains all three macronutrients
- **Incomplete**: Missing one or more macronutrients
- Choose based on soil test results

### Organic vs Synthetic Fertilizers
**Organic:**
- Slow-release nutrients
- Improves soil structure
- Environmentally friendly
- May have lower nutrient concentrations

**Synthetic:**
- Quick-release nutrients
- Precise nutrient ratios
- Immediate plant response
- May require more frequent application

## Soil Testing and Analysis

### When to Test
- Before starting a new garden
- Every 3-4 years for established gardens
- When plants show nutrient deficiency symptoms
- After major soil amendments

### What Tests Include
- pH level
- Macronutrient levels
- Micronutrient levels
- Organic matter content
- Cation exchange capacity

### Interpreting Results
- Compare to optimal ranges for your plants
- Consider seasonal variations
- Account for recent amendments
- Follow specific recommendations

## Common Nutrient Deficiencies

### Nitrogen Deficiency
**Symptoms:**
- Yellowing older leaves
- Stunted growth
- Poor fruit development

**Solutions:**
- Add compost or manure
- Use nitrogen-rich fertilizers
- Plant nitrogen-fixing cover crops

### Phosphorus Deficiency
**Symptoms:**
- Purple or reddish leaves
- Poor root development
- Delayed flowering

**Solutions:**
- Add bone meal or rock phosphate
- Improve soil pH if too acidic
- Use phosphorus-rich fertilizers

### Potassium Deficiency
**Symptoms:**
- Brown leaf edges
- Weak stems
- Poor fruit quality

**Solutions:**
- Add wood ash or kelp meal
- Use potassium-rich fertilizers
- Improve soil drainage

## Fertilizer Application Methods

### Broadcasting
- Spread evenly over soil surface
- Good for large areas
- Incorporate into soil
- May require more fertilizer

### Banding
- Apply in strips near plants
- More efficient use of fertilizer
- Reduces fertilizer waste
- Good for row crops

### Side Dressing
- Apply fertilizer beside growing plants
- Provides nutrients during growing season
- Avoid direct contact with stems
- Water after application

### Foliar Feeding
- Spray nutrients on leaves
- Quick absorption
- Good for micronutrient deficiencies
- Use diluted solutions

## Organic Soil Amendments

### Compost
- Improves soil structure
- Provides slow-release nutrients
- Increases water retention
- Supports beneficial organisms

### Manure
- High in nitrogen
- Improves soil fertility
- Must be well-composted
- Avoid fresh manure

### Cover Crops
- Add organic matter
- Fix nitrogen (legumes)
- Prevent erosion
- Improve soil structure

### Mulching
- Conserves moisture
- Regulates soil temperature
- Adds organic matter as it decomposes
- Suppresses weeds

## Monitoring Plant Health

### Visual Symptoms
- Leaf color changes
- Growth patterns
- Flower and fruit development
- Overall plant vigor

### Soil Monitoring
- Regular pH testing
- Nutrient level checks
- Organic matter content
- Soil structure assessment

### Plant Tissue Testing
- Most accurate for nutrient status
- Shows actual plant nutrient levels
- Helps diagnose hidden deficiencies
- Available through testing services

Understanding soil pH and plant nutrition is essential for successful gardening. By testing your soil regularly, adjusting pH as needed, and providing appropriate nutrients, you'll create the foundation for healthy, productive plants that will thrive in your garden for years to come.`,
    category: "soil-fertilizer",
    tags: ["soil-ph", "nutrients", "fertilizer", "soil-testing", "plant-nutrition"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "Soil testing kit and pH meter with various soil samples"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Person testing soil pH with digital meter",
        caption: "Regular soil testing helps maintain optimal growing conditions"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Various organic fertilizers and soil amendments",
        caption: "Organic amendments provide slow-release nutrients for healthy plants"
      }
    ],
    status: "published",
    featured: false
  },
  {
    title: "Creating a Pollinator-Friendly Garden",
    excerpt: "Transform your garden into a haven for bees, butterflies, and other beneficial pollinators with these essential tips and plant recommendations.",
    content: `Pollinators are essential to our ecosystem and food production, but their populations are declining worldwide. By creating a pollinator-friendly garden, you can help support these vital creatures while enjoying a more vibrant and productive garden.

## Why Pollinators Matter

### Ecosystem Services
- **Pollination**: Essential for 75% of flowering plants
- **Food Production**: Responsible for 1 in 3 bites of food we eat
- **Biodiversity**: Support diverse plant and animal communities
- **Economic Value**: Contribute billions to global agriculture

### Types of Pollinators
- **Bees**: Most important pollinators (honeybees, native bees)
- **Butterflies**: Beautiful and effective pollinators
- **Moths**: Night-time pollinators for specific plants
- **Hummingbirds**: Important for tubular flowers
- **Beetles**: Pollinate many native plants
- **Flies**: Often overlooked but important pollinators

## Planning Your Pollinator Garden

### Location Considerations
- **Sun Exposure**: Most pollinator plants need full sun (6+ hours)
- **Shelter**: Provide protection from wind
- **Water Source**: Include shallow water features
- **Pesticide-Free**: Avoid chemical pesticides and herbicides

### Garden Design Principles
- **Plant Diversity**: Include various flower shapes, sizes, and colors
- **Blooming Seasons**: Ensure flowers throughout growing season
- **Native Plants**: Prioritize native species when possible
- **Grouping**: Plant in clusters for better pollinator attraction

## Essential Pollinator Plants

### Spring Bloomers
**Trees and Shrubs:**
- Redbud (Cercis canadensis)
- Serviceberry (Amelanchier spp.)
- Wild plum (Prunus americana)
- Pussy willow (Salix discolor)

**Perennials:**
- Wild columbine (Aquilegia canadensis)
- Wild geranium (Geranium maculatum)
- Virginia bluebells (Mertensia virginica)
- Wild phlox (Phlox divaricata)

### Summer Bloomers
**Annuals:**
- Zinnias (Zinnia elegans)
- Sunflowers (Helianthus annuus)
- Cosmos (Cosmos bipinnatus)
- Marigolds (Tagetes spp.)

**Perennials:**
- Purple coneflower (Echinacea purpurea)
- Black-eyed Susan (Rudbeckia hirta)
- Bee balm (Monarda didyma)
- Butterfly weed (Asclepias tuberosa)

### Fall Bloomers
**Perennials:**
- Goldenrod (Solidago spp.)
- Asters (Symphyotrichum spp.)
- Joe Pye weed (Eutrochium purpureum)
- Ironweed (Vernonia noveboracensis)

## Creating Habitat for Different Pollinators

### Bee-Friendly Features
**Nesting Sites:**
- Leave some bare ground for ground-nesting bees
- Provide bee houses for cavity-nesting species
- Include hollow stems and dead wood
- Avoid disturbing nesting areas

**Food Sources:**
- Plant flowers with different bloom times
- Include both nectar and pollen sources
- Choose single-flowered varieties over doubles
- Provide native plants for specialist bees

### Butterfly Habitat
**Host Plants:**
- Milkweed for monarch butterflies
- Parsley family for swallowtails
- Nettle for red admirals
- Willow for mourning cloaks

**Nectar Sources:**
- Flat-topped flowers for easy landing
- Bright colors (red, orange, yellow, pink)
- Fragrant flowers
- Continuous bloom throughout season

### Hummingbird Features
**Flower Characteristics:**
- Tubular-shaped flowers
- Red, orange, or pink colors
- High nectar content
- No landing platform needed

**Plant Examples:**
- Cardinal flower (Lobelia cardinalis)
- Trumpet vine (Campsis radicans)
- Coral honeysuckle (Lonicera sempervirens)
- Bee balm (Monarda didyma)

## Garden Maintenance for Pollinators

### Chemical-Free Approach
- **Avoid pesticides**: Use integrated pest management
- **Organic fertilizers**: Compost and organic amendments
- **Natural pest control**: Beneficial insects and birds
- **Tolerance**: Accept some plant damage

### Seasonal Care
**Spring:**
- Clean up garden debris carefully
- Leave some leaf litter for overwintering insects
- Plant new pollinator-friendly species
- Provide early nectar sources

**Summer:**
- Deadhead spent flowers to encourage reblooming
- Water during dry periods
- Monitor for pests and diseases
- Enjoy the pollinator activity

**Fall:**
- Leave seed heads for birds
- Don't cut back all perennials
- Plant spring-blooming bulbs
- Provide late-season nectar sources

**Winter:**
- Leave some plant debris for overwintering
- Provide shelter from harsh weather
- Plan for next year's improvements
- Maintain water sources if possible

## Water Features for Pollinators

### Shallow Water Sources
- **Bird baths**: Keep water fresh and shallow
- **Puddling areas**: Wet sand or mud for butterflies
- **Dripping water**: Attracts hummingbirds
- **Fountain features**: Moving water prevents mosquitoes

### Safety Considerations
- Shallow edges for easy access
- Rocks or sticks for landing
- Regular cleaning to prevent disease
- Avoid deep water that could drown insects

## Supporting Native Pollinators

### Native Bee Species
**Bumblebees:**
- Large, fuzzy bees
- Excellent pollinators
- Nest in ground or cavities
- Active in cooler weather

**Mason Bees:**
- Solitary nesting bees
- Very efficient pollinators
- Use mud to build nests
- Active in early spring

**Leafcutter Bees:**
- Cut circular pieces from leaves
- Nest in hollow stems
- Important crop pollinators
- Active in summer

### Creating Nesting Habitat
- **Ground nesting**: Leave some bare, undisturbed soil
- **Cavity nesting**: Provide bee houses or hollow stems
- **Wood nesting**: Include dead wood and logs
- **Stem nesting**: Leave some plant stems uncut

## Common Pollinator Garden Mistakes

### Avoid These Practices
- **Double flowers**: Less accessible nectar and pollen
- **Exotic plants only**: Native plants support more species
- **Pesticide use**: Harmful to all pollinators
- **Perfectly manicured**: Some messiness benefits wildlife

### Better Alternatives
- **Single flowers**: Easier access to nectar and pollen
- **Native plant focus**: Better adapted to local conditions
- **Integrated pest management**: Natural pest control methods
- **Naturalistic design**: Mimics natural ecosystems

## Measuring Success

### Pollinator Activity Indicators
- **Increased bee visits**: More bees in your garden
- **Butterfly presence**: Regular butterfly sightings
- **Bird activity**: Hummingbirds and other birds
- **Plant productivity**: Better fruit and seed set

### Garden Health Signs
- **Reduced pest problems**: Natural pest control
- **Improved soil health**: More organic matter
- **Increased biodiversity**: More plant and animal species
- **Better plant growth**: Healthier, more vigorous plants

## Educational Opportunities

### Learning About Pollinators
- **Field guides**: Identify local pollinator species
- **Citizen science**: Participate in pollinator monitoring
- **Local experts**: Connect with beekeepers and naturalists
- **Online resources**: Access identification guides and information

### Sharing Your Garden
- **Community education**: Teach others about pollinator gardening
- **School programs**: Involve children in pollinator conservation
- **Garden tours**: Showcase your pollinator-friendly garden
- **Social media**: Share your pollinator garden successes

## Regional Considerations

### Climate Adaptations
- **Cold climates**: Choose hardy perennials and provide winter shelter
- **Hot climates**: Select heat-tolerant species and provide shade
- **Dry climates**: Use drought-tolerant plants and water efficiently
- **Wet climates**: Choose plants that tolerate moist conditions

### Local Native Species
- Research your region's native pollinators
- Choose plants adapted to your local conditions
- Support local native plant nurseries
- Learn about regional pollinator conservation efforts

Creating a pollinator-friendly garden is one of the most rewarding ways to contribute to environmental conservation while enhancing your own garden's beauty and productivity. By providing food, water, and shelter for these essential creatures, you'll create a thriving ecosystem that benefits both wildlife and your garden's success.`,
    category: "gardening-tips",
    tags: ["pollinators", "bees", "butterflies", "native-plants", "ecosystem"],
    featuredImage: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      alt: "Colorful pollinator garden with bees and butterflies on flowers"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Monarch butterfly on purple coneflower",
        caption: "Native plants like coneflowers attract important pollinators"
      },
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        alt: "Bee house and native wildflowers in garden",
        caption: "Provide nesting sites and diverse flower types for pollinators"
      }
    ],
    status: "published",
    featured: true
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

    // Clear existing articles
    await Article.deleteMany({});
    console.log('Cleared existing articles');

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
