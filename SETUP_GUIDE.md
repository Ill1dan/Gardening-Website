# 🚀 Complete Setup Guide - Gardening Website

## ✅ Progress So Far
- [x] Backend dependencies installed
- [x] Frontend dependencies installed  
- [x] Environment template created
- [ ] MongoDB setup
- [ ] Environment configuration
- [ ] Database initialization
- [ ] Application startup

## 🗂️ Next Steps

### Step 1: MongoDB Setup (Choose One Option)

#### Option A: Install MongoDB Locally (Recommended for Development)

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

**Alternative - Using MongoDB with Docker:**
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: Use MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update the MONGODB_URI in your .env file

### Step 2: Configure Environment Variables

Edit your `.env` file with these settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gardening-website
JWT_SECRET=your_super_secret_jwt_key_for_gardening_website_make_it_very_long_and_secure_2024
JWT_EXPIRE=30d
```

**For MongoDB Atlas, your MONGODB_URI will look like:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gardening-website?retryWrites=true&w=majority
```

### Step 3: Initialize Database with Demo Data

```powershell
npm run setup
```

This will create demo accounts:
- **Admin**: admin@garden.com / Password123!
- **Gardener**: gardener@garden.com / Password123!  
- **Viewer**: viewer@garden.com / Password123!

### Step 4: Start the Application

**Option A: Run both servers simultaneously**
```powershell
# Terminal 1 - Backend Server
npm run dev

# Terminal 2 - Frontend Server (in new terminal)
cd client
npm start
```

**Option B: Quick test backend only**
```powershell
npm start
```

Then visit http://localhost:5000/api/health to verify backend is running.

## 🎯 Access Points

Once both servers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🧪 Testing the RBAC System

1. **Register New Account** (becomes Viewer by default)
2. **Login with Demo Accounts**:
   - Admin → Full access including `/admin/users`
   - Gardener → Enhanced dashboard with gardener tools
   - Viewer → Basic dashboard and browsing features

3. **Test Role-Based Navigation**:
   - Notice different menu items for each role
   - Try accessing admin routes as non-admin (should redirect)
   - Verify role-specific dashboard content

## 🔧 Troubleshooting

### MongoDB Connection Issues
```powershell
# Check if MongoDB service is running (Windows)
Get-Service -Name MongoDB

# Start MongoDB service if needed
net start MongoDB
```

### Port Conflicts
```powershell
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process if needed (replace PID)
taskkill /PID <PID> /F
```

### Clear and Restart
```powershell
# Clear database and recreate demo data
npm run setup

# Restart with fresh data
npm run dev
```

## 📱 Quick Commands Reference

```powershell
# Install everything
npm run install-all

# Setup database  
npm run setup

# Start backend only
npm run dev

# Start frontend only
npm run client

# Health check
curl http://localhost:5000/api/health
```

## 🎉 What You'll Have After Setup

✅ **Complete MERN Stack Application**
- Express.js backend with MongoDB
- React frontend with Tailwind CSS
- JWT authentication system
- Role-based access control

✅ **Three User Roles Working**
- Viewer: Browse and learn
- Gardener: Share knowledge  
- Admin: Manage platform

✅ **Security Features**
- Password hashing with bcrypt
- JWT token authentication
- Input validation
- Rate limiting
- CORS protection

✅ **Ready for Development**
- Hot reload for both frontend and backend
- Comprehensive error handling
- Responsive design
- Production-ready architecture

---

**Need Help?** 
- Check console logs for error messages
- Verify MongoDB is running
- Ensure .env file is configured correctly
- Try the troubleshooting steps above
