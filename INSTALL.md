# 🚀 Quick Installation Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git

## One-Command Setup

```bash
# Clone, install dependencies, and setup database
git clone <your-repo-url> gardening-website
cd gardening-website
npm run install-all
cp env.example .env
npm run setup
```

## Manual Setup

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies  
cd client && npm install && cd ..
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your settings
nano .env
```

Required environment variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gardening-website
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_secure
JWT_EXPIRE=30d
```

### 3. Database Setup
```bash
# Make sure MongoDB is running, then:
npm run setup
```

This will:
- Connect to MongoDB
- Create the database and collections
- Create demo user accounts
- Display login credentials

### 4. Start the Application

#### Option 1: Separate terminals
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
npm run client
```

#### Option 2: Single command (if using concurrently)
```bash
npm run dev
```

## 🎯 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔑 Demo Accounts

After running `npm run setup`, you'll have these accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@garden.com | Password123! | Full platform access |
| Gardener | gardener@garden.com | Password123! | Content creation + viewing |
| Viewer | viewer@garden.com | Password123! | Browse and learn |

## 🧪 Test the RBAC System

1. **Login as Viewer** → Access dashboard, profile, gardener directory
2. **Login as Gardener** → All viewer features + gardener tools
3. **Login as Admin** → All features + user management at `/admin/users`

## 🔧 Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Start MongoDB if needed
sudo systemctl start mongod  # Linux
brew services start mongodb/brew/mongodb-community  # macOS
```

**Port Conflicts:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
```

**Clear Setup:**
```bash
# Reset database and start fresh
npm run setup
```

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000  
- [ ] Can register new account
- [ ] Can login with demo accounts
- [ ] Role-based navigation works
- [ ] Admin can access user management
- [ ] API endpoints respond correctly

## 🆘 Need Help?

1. Check the main README.md for detailed documentation
2. Verify all prerequisites are installed
3. Ensure MongoDB is running and accessible
4. Check console for error messages
5. Verify .env file configuration

---

Happy Gardening! 🌱
