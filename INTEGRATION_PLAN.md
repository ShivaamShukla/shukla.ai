# Integration Plan: Shukla UI + Emergent Backend

## Architecture Overview

### Frontend (Based on Provided Code)
- Login Screen (User/Admin split)
- User Dashboard (Chat interface with advanced controls)
- Admin Panel (User management, analytics)
- Modals (Workspace, Settings, GitHub)

### Backend (Already Built)
- FastAPI with MongoDB
- JWT Authentication
- Conversation System
- AI Models Management
- MCP Tools
- Credits System
- Admin APIs

## Integration Points

### 1. Authentication
**Current (Firebase):**
```javascript
signInAnonymously(auth)
signInWithCustomToken(auth, token)
```

**New (FastAPI):**
```javascript
POST /api/auth/login { email, password }
POST /api/auth/register { name, email, password }
GET /api/auth/me
```

### 2. Project/Workspace Management
**Current (Firestore):**
```javascript
collection(db, 'artifacts', appId, 'users', userId, 'projects')
```

**New (MongoDB via API):**
```javascript
GET /api/conversations
POST /api/conversations { projectName, settings }
DELETE /api/conversations/:id
```

### 3. Message System
**Current (Gemini Direct):**
```javascript
fetch('https://generativelanguage.googleapis.com/...')
```

**New (Backend Proxy):**
```javascript
POST /api/conversations/messages {
  conversationId,
  content,
  settings: { agentMode, model, ultraThinking }
}
```

### 4. Admin Panel
**Current (Firestore):**
```javascript
collection(db, 'artifacts', appId, 'public', 'data', 'users')
```

**New (Admin API):**
```javascript
GET /api/admin/users
PUT /api/admin/users/:id/role
DELETE /api/admin/users/:id
GET /api/admin/stats
```

## Implementation Steps

1. ✅ Keep backend APIs (already built)
2. ⏳ Create integrated React component
3. ⏳ Replace Firebase calls with axios API calls
4. ⏳ Connect chat interface to conversation API
5. ⏳ Link admin panel to admin APIs
6. ⏳ Add credits display and management
7. ⏳ Test complete flow

## File Changes Required

### New Files:
- `/frontend/src/pages/IntegratedDashboard.jsx` - Main component
- `/frontend/src/components/LoginFlow.jsx` - Auth screens
- `/frontend/src/components/AdminDashboard.jsx` - Admin panel

### Modified Files:
- `/frontend/src/App.js` - Update routing
- `/frontend/src/contexts/AuthContext.jsx` - Already has JWT auth

## Key Differences to Handle

| Feature | Provided Code | Our Backend |
|---------|--------------|-------------|
| Auth | Firebase | JWT Tokens |
| Database | Firestore | MongoDB |
| Real-time | onSnapshot | Polling/WebSocket |
| AI API | Direct Gemini | Backend proxy |
| File Storage | Firebase Storage | Backend upload |

## Notes

- Keep the clean UI from provided code
- Use our robust backend APIs
- Maintain JWT authentication
- Credits system already in backend
- Admin features already in backend
- Just need to connect frontend properly
