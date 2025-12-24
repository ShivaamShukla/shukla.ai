# Full-Stack Emergent.sh Clone - Implementation Contracts

## Overview
Building a complete full-stack application with authentication, user dashboard, and admin panel.

## Authentication Flow
### Frontend Changes Needed:
1. Replace mock sign-in buttons with actual OAuth/JWT authentication
2. Implement Google OAuth sign-in
3. Store JWT tokens in localStorage/cookies
4. Protected routes for dashboard and admin panel
5. Auth context for managing user state

### Backend Implementation:
1. **User Authentication Endpoints:**
   - POST `/api/auth/google` - Google OAuth callback
   - POST `/api/auth/login` - Email/password login
   - POST `/api/auth/register` - User registration
   - POST `/api/auth/logout` - User logout
   - GET `/api/auth/me` - Get current user info
   - POST `/api/auth/refresh` - Refresh JWT token

2. **User Management:**
   - GET `/api/users` - List all users (admin only)
   - GET `/api/users/:id` - Get user by ID
   - PUT `/api/users/:id` - Update user profile
   - DELETE `/api/users/:id` - Delete user (admin only)

## Database Models

### User Model
```python
{
  "_id": ObjectId,
  "email": String (unique),
  "name": String,
  "avatar": String (URL),
  "role": String (enum: "user", "admin"),
  "provider": String (enum: "google", "email"),
  "password": String (hashed, for email auth),
  "projects": Array[ObjectId],
  "subscription": {
    "plan": String (enum: "free", "standard", "pro"),
    "status": String (enum: "active", "inactive"),
    "startDate": DateTime,
    "endDate": DateTime
  },
  "createdAt": DateTime,
  "updatedAt": DateTime,
  "lastLogin": DateTime
}
```

### Project Model
```python
{
  "_id": ObjectId,
  "userId": ObjectId (ref: User),
  "name": String,
  "description": String,
  "type": String (enum: "web", "mobile", "agent", "integration"),
  "status": String (enum: "draft", "building", "deployed", "failed"),
  "url": String (deployed URL),
  "settings": Object,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### Activity Model (for admin dashboard)
```python
{
  "_id": ObjectId,
  "userId": ObjectId (ref: User),
  "action": String,
  "resource": String,
  "metadata": Object,
  "timestamp": DateTime
}
```

## Frontend Pages to Create

### 1. User Dashboard (`/dashboard`)
**Components:**
- DashboardNav - Navigation with user profile dropdown
- ProjectsList - Grid/list of user projects
- CreateProjectModal - Modal to create new project
- ProjectCard - Individual project card with actions
- StatsCards - Usage statistics (projects count, builds, etc.)

**Features:**
- View all projects
- Create new project
- Edit/Delete projects
- View project status
- Access project settings
- View usage stats
- Upgrade subscription

### 2. Admin Panel (`/admin`)
**Components:**
- AdminSidebar - Admin navigation
- UsersTable - List all users with actions
- ProjectsTable - List all projects
- AnalyticsDashboard - Charts and stats
- UserModal - View/Edit user details

**Features:**
- View all users
- Manage users (edit, delete, change role)
- View all projects across users
- View system analytics
- Manage subscriptions
- View activity logs

### 3. Auth Pages
- `/login` - Login page with Google OAuth
- `/register` - Registration page
- `/forgot-password` - Password reset

## API Endpoints

### Projects Endpoints
- GET `/api/projects` - Get all projects for logged-in user
- POST `/api/projects` - Create new project
- GET `/api/projects/:id` - Get project by ID
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- POST `/api/projects/:id/deploy` - Deploy project

### Admin Endpoints
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/:id/role` - Update user role
- DELETE `/api/admin/users/:id` - Delete user
- GET `/api/admin/stats` - Get system statistics
- GET `/api/admin/activities` - Get activity logs

### Subscription Endpoints
- GET `/api/subscriptions/plans` - Get pricing plans
- POST `/api/subscriptions/upgrade` - Upgrade subscription
- POST `/api/subscriptions/cancel` - Cancel subscription

## Security Implementation
1. JWT tokens with expiration
2. Password hashing with bcrypt
3. Protected routes middleware
4. Admin role verification
5. CORS configuration
6. Rate limiting on auth endpoints
7. Input validation and sanitization

## Frontend Integration Steps
1. Create AuthContext to manage user state
2. Create ProtectedRoute component
3. Update App.js with new routes
4. Remove mock data from landing page sign-in
5. Connect sign-in buttons to real auth endpoints
6. Add token management (localStorage + axios interceptors)
7. Implement logout functionality
8. Add loading states and error handling

## Mock Data to Replace
- `mockData.js` - All pricing plans, features, FAQs (keep for landing page)
- Sign-in buttons - Connect to real auth
- User projects - Fetch from API
- User profile - Fetch from API

## Environment Variables Needed
Backend `.env`:
- JWT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI

Frontend `.env`:
- REACT_APP_GOOGLE_CLIENT_ID
- REACT_APP_BACKEND_URL (already exists)
