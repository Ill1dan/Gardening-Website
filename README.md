# 🌱 Gardening Website - MERN Stack with RBAC

A comprehensive gardening community platform built with the MERN stack, featuring role-based access control (RBAC) for Viewers, Gardeners, and Admins.

## 🔒 Security Notice

**⚠️ IMPORTANT**: This repository contains example configuration files with placeholder credentials. Never commit real database credentials or API keys to version control.

For security best practices and incident response, see [SECURITY.md](SECURITY.md).

## 🚀 Features

### Role-Based Access Control (RBAC)
- **Viewer**: Default role for regular visitors and registered users
  - Browse plant guides and community content
  - Ask questions and participate in discussions
  - Learn from experienced gardeners
  - Access community resources

- **Gardener**: Experienced users who contribute knowledge
  - All Viewer permissions
  - Create and edit plant guides
  - Answer community questions
  - Share gardening experiences and tips
  - Mentor beginners

- **Admin**: Platform-wide management and oversight
  - All Gardener permissions
  - Manage user accounts and roles
  - Moderate content and community guidelines
  - Access platform analytics and statistics
  - Configure platform settings

### Core Features
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 👥 **User Management** - Complete user profile management with role assignment
- 🛡️ **Route Protection** - Role-based route protection and middleware
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI** - Clean, intuitive interface with role-based dashboards
- 🔍 **Advanced Search** - Filter and search functionality for users and content
- 📊 **Admin Dashboard** - Comprehensive user management and analytics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Icon library
- **React Toastify** - Notifications
- **Axios** - HTTP client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd gardening-website
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gardening-website
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_secure
JWT_EXPIRE=30d
```

### 5. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the database and collections.

### 6. Start the application

#### Development mode (runs both backend and frontend):
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

#### Or run both concurrently:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Usage

### Initial Setup
1. Navigate to http://localhost:3000
2. Register a new account (starts as Viewer role)
3. Admin users can be created by manually updating the role in MongoDB or through the admin interface

### Demo Accounts
For testing purposes, you can create these demo accounts:

**Admin Account:**
- Email: admin@garden.com
- Password: Password123!
- Role: admin

**Gardener Account:**
- Email: gardener@garden.com  
- Password: Password123!
- Role: gardener

**Viewer Account:**
- Email: viewer@garden.com
- Password: Password123!
- Role: viewer

### Role-Specific Features

#### As a Viewer:
- Browse the gardener directory
- View community content
- Access your personal dashboard
- Update your profile

#### As a Gardener:
- All Viewer features
- Create and manage content (coming soon)
- Access gardener-specific tools
- Mentor community members

#### As an Admin:
- All Gardener features
- Access admin dashboard at `/admin/users`
- Manage user accounts and roles
- View platform statistics
- Deactivate/reactivate users

## 🏗️ Project Structure

```
gardening-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── common/     # Common components
│   │   │   └── layout/     # Layout components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin-specific pages
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── package.json
├── controllers/            # Express controllers
├── middleware/            # Custom middleware
├── models/               # Mongoose models
├── routes/              # Express routes
├── .env.example         # Environment variables template
├── package.json         # Backend dependencies
├── server.js           # Express server entry point
└── README.md
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper CORS setup for security
- **Helmet Integration**: Security headers for protection
- **Role-Based Access**: Strict role-based route protection

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Users (Admin)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `PUT /api/users/:id/deactivate` - Deactivate user (Admin only)
- `PUT /api/users/:id/reactivate` - Reactivate user (Admin only)
- `GET /api/users/admin/stats` - Get user statistics (Admin only)

### Public
- `GET /api/users/gardeners` - Get gardeners (Public)

## 🧪 Testing

### Manual Testing
1. Register accounts with different roles
2. Test role-based access to different routes
3. Verify admin functions (user management, role updates)
4. Test authentication flows (login, logout, token refresh)

### Role Testing Scenarios
1. **Viewer Access**: Ensure viewers can only access appropriate content
2. **Gardener Privileges**: Verify gardeners have elevated permissions
3. **Admin Functions**: Test all admin-only features
4. **Cross-Role Security**: Ensure users cannot access higher-privilege content

## 🔄 Development Workflow

1. **Backend Development**: Follow MVC architecture strictly
2. **Frontend Development**: Use component-based architecture
3. **Database Design**: Maintain proper relationships and indexes
4. **Security**: Always validate inputs and protect routes
5. **Testing**: Test role-based access thoroughly

## 📈 Future Enhancements

- Plant guide creation and management
- Community forums and discussions  
- Real-time notifications
- Image upload for profiles and guides
- Advanced search and filtering
- Mobile application
- Email verification system
- Password reset functionality
- Social media integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ for the gardening community

## 🆘 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section below
2. Create an issue on GitHub
3. Contact the development team

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check the MONGODB_URI in your .env file
- Verify database permissions

**Port Already in Use:**
- Change the PORT in .env file
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

**JWT Authentication Issues:**
- Ensure JWT_SECRET is set in .env
- Check token expiration settings
- Clear browser localStorage if needed

**Build Errors:**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check for version compatibility issues

---

Happy Gardening! 🌱
