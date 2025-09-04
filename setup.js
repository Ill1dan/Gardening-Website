const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Demo users data
const demoUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    email: 'admin@garden.com',
    password: 'Password123!',
    role: 'admin',
    bio: 'Platform administrator with full access to manage the gardening community.',
    location: 'New York, NY',
    experienceLevel: 'expert',
    specializations: ['organic-gardening', 'landscaping', 'composting'],
    isEmailVerified: true
  },
  {
    firstName: 'Expert',
    lastName: 'Gardener',
    username: 'expertgardener',
    email: 'gardener@garden.com',
    password: 'Password123!',
    role: 'gardener',
    bio: 'Experienced gardener with 15+ years of growing vegetables and flowers. Love helping beginners discover the joy of gardening.',
    location: 'California, CA',
    experienceLevel: 'expert',
    specializations: ['vegetables', 'flowers', 'organic-gardening', 'herbs'],
    isEmailVerified: true
  },
  {
    firstName: 'Green',
    lastName: 'Thumb',
    username: 'greenthumb',
    email: 'viewer@garden.com',
    password: 'Password123!',
    role: 'viewer',
    bio: 'New to gardening and excited to learn from the community!',
    location: 'Texas, TX',
    experienceLevel: 'beginner',
    specializations: ['indoor-plants'],
    isEmailVerified: true
  },
  {
    firstName: 'Rose',
    lastName: 'Garden',
    username: 'rosegarden',
    email: 'rose@garden.com',
    password: 'Password123!',
    role: 'gardener',
    bio: 'Specializing in roses and flower gardens. Creating beautiful landscapes for over 10 years.',
    location: 'Oregon, OR',
    experienceLevel: 'advanced',
    specializations: ['flowers', 'landscaping', 'trees'],
    isEmailVerified: true
  },
  {
    firstName: 'Herb',
    lastName: 'Master',
    username: 'herbmaster',
    email: 'herbs@garden.com',
    password: 'Password123!',
    role: 'gardener',
    bio: 'Herb enthusiast and culinary gardener. Growing fresh herbs and spices for cooking.',
    location: 'Colorado, CO',
    experienceLevel: 'intermediate',
    specializations: ['herbs', 'vegetables', 'organic-gardening'],
    isEmailVerified: true
  }
];

async function setupDatabase() {
  try {
    console.log('🌱 Setting up Gardening Website database...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gardening-website', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully\n');

    // Clear existing users (optional - for development setup)
    console.log('🧹 Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users cleared\n');

    // Create demo users
    console.log('👥 Creating demo users...');
    
    for (const userData of demoUsers) {
      try {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log('\n🎉 Database setup completed successfully!\n');

    // Display login information
    console.log('🔑 Demo Login Credentials:');
    console.log('==========================');
    console.log('Admin Account:');
    console.log('  Email: admin@garden.com');
    console.log('  Password: Password123!');
    console.log('  Role: admin\n');

    console.log('Gardener Account:');
    console.log('  Email: gardener@garden.com');
    console.log('  Password: Password123!');
    console.log('  Role: gardener\n');

    console.log('Viewer Account:');
    console.log('  Email: viewer@garden.com');
    console.log('  Password: Password123!');
    console.log('  Role: viewer\n');

    console.log('Additional Gardener Accounts:');
    console.log('  Email: rose@garden.com | Password: Password123!');
    console.log('  Email: herbs@garden.com | Password: Password123!\n');

    console.log('🚀 You can now start the application:');
    console.log('   Backend: npm run dev');
    console.log('   Frontend: npm run client');
    console.log('   Or both: npm run dev (if you have concurrently setup)\n');

    // Get user statistics
    const stats = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('📊 User Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} users`);
    });

    console.log('\n✨ Happy Gardening! 🌱');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n📡 Database connection closed');
    process.exit(0);
  }
}

// Run setup
setupDatabase();
