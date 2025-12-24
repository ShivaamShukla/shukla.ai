# EMERGENT.SH DASHBOARD - IMPLEMENTATION GUIDE

## 🎯 Status: Backend Complete, Frontend In Progress

### ✅ Backend Complete (100%)

**New Models Created:**
- Conversation Model (chat sessions with AI)
- Message Model (user/assistant messages)  
- AIModel Model (configurable AI models)
- MCPTool Model (MCP tools management)
- Credits Model (user credits tracking)

**New API Endpoints:**

1. **Conversations API** (`/api/conversations`)
   - GET `/` - List all conversations
   - POST `/` - Create new conversation
   - GET `/{id}` - Get conversation details
   - GET `/{id}/messages` - Get all messages
   - POST `/messages` - Send message (with AI response)
   - DELETE `/{id}` - Delete conversation

2. **Models API** (`/api/models`)
   - GET `/` - List enabled models (user)
   - GET `/all` - List all models (admin)
   - POST `/` - Create model (admin)
   - PUT `/{id}` - Update model (admin)
   - DELETE `/{id}` - Delete model (admin)

3. **MCP Tools API** (`/api/mcp-tools`)
   - GET `/` - List enabled tools (user)
   - GET `/all` - List all tools (admin)
   - POST `/` - Create tool (admin)
   - PUT `/{id}/toggle` - Enable/disable tool (admin)
   - DELETE `/{id}` - Delete tool (admin)
   - GET `/user-config` - Get user's tool configs
   - POST `/user-config` - Save user's tool config

**Default Data Initialized:**
- 6 AI Models (Claude 4.5 Sonnet/Opus, GPT-5.2/5.1, Gemini 3 Pro, etc.)
- 4 MCP Tools (Memory, Supabase, Notion, Custom)

**Features Implemented:**
- ✅ Credits system (users start with 100 credits)
- ✅ Credit deduction on message send
- ✅ Credit transaction logging
- ✅ Agent mode selection (E-1, E-1.1, E-2, Prototype, Mobile)
- ✅ Ultra thinking mode toggle
- ✅ Model selection per conversation
- ✅ MCP tools selection and configuration
- ✅ File attachments support
- ✅ GitHub repo integration (structure ready)

### 🚧 Frontend Required

**Priority 1: Chat-Based Dashboard** ⏳
Create new dashboard with:
- Left sidebar: Conversation list
- Center: Chat interface with input box
- Right sidebar: Settings panel

**Components to Create:**

1. `/pages/ChatDashboard.jsx` - Main chat interface
   - Left sidebar with conversation list
   - Center chat area with messages
   - Input box with file upload, GitHub, settings
   - Right panel for advanced controls

2. `/components/ChatSidebar.jsx`
   - List of conversations
   - New chat button
   - Search conversations
   - Archive/delete options

3. `/components/ChatInterface.jsx`
   - Message bubbles (user/assistant)
   - Typing indicator
   - File attachments display
   - Code highlighting

4. `/components/ChatInput.jsx`
   - Text input with multi-line support
   - File upload button
   - GitHub integration button
   - Send button
   - Attachment chips below input

5. `/components/SettingsPanel.jsx`
   - Agent mode selector (E-1, E-1.1, E-2, Prototype, Mobile)
   - Model selector dropdown
   - Ultra thinking toggle
   - MCP tools selector
   - Credits display
   - Template selector

6. `/components/GitHubModal.jsx`
   - Public/Private repo selection
   - Repo URL input
   - Branch selector
   - OAuth flow for private repos

7. `/components/MCPToolsModal.jsx`
   - List of available MCP tools
   - Enable/disable toggles
   - API key inputs
   - Configuration forms

**Priority 2: Enhanced Admin Panel** ⏳

Update `/pages/AdminPanel.jsx` to add:
- Models management tab
- MCP tools management tab
- Credits management
- Usage analytics

**New Admin Components:**

1. `/components/admin/ModelsManager.jsx`
   - Table of all models
   - Add/edit/delete models
   - Enable/disable toggle
   - Pricing configuration

2. `/components/admin/MCPManager.jsx`
   - Table of all MCP tools
   - Add/edit/delete tools
   - Enable/disable toggle
   - Permissions management

3. `/components/admin/CreditsManager.jsx`
   - User credits table
   - Add credits to users
   - Transaction history
   - Usage statistics

### 📋 Implementation Steps

**Step 1: Create Chat Dashboard (Main Priority)**
```
1. Create ChatDashboard.jsx with layout
2. Create ChatSidebar.jsx for conversations list
3. Create ChatInterface.jsx for message display
4. Create ChatInput.jsx with all controls
5. Create SettingsPanel.jsx with agent/model selection
6. Connect to backend APIs
7. Test full flow
```

**Step 2: Add File Upload**
```
1. Implement file upload endpoint
2. Add file preview in ChatInput
3. Display attachments in messages
4. Test with PDF, images, code files
```

**Step 3: Add GitHub Integration**
```
1. Create GitHubModal component
2. Implement public repo connection
3. Add OAuth flow for private repos
4. Test repo connection
```

**Step 4: Add MCP Tools**
```
1. Create MCPToolsModal component
2. Fetch available tools from API
3. Allow users to configure tools
4. Save configurations to backend
```

**Step 5: Update Admin Panel**
```
1. Add Models tab with CRUD
2. Add MCP Tools tab with CRUD
3. Add Credits management
4. Add usage analytics
```

### 🔄 API Integration Examples

**Create Conversation:**
```javascript
const response = await axios.post('/api/conversations', {
  projectName: 'My New App',
  settings: {
    agentMode: 'e1',
    ultraThinking: false,
    model: 'claude-4.5-sonnet',
    mcpTools: ['memory'],
    maxTokens: 4096
  }
});
```

**Send Message:**
```javascript
const response = await axios.post('/api/conversations/messages', {
  conversationId: '123',
  content: 'Build me a todo app',
  attachments: [],
  settings: {
    agentMode: 'e1',
    model: 'claude-4.5-sonnet'
  }
});
```

**Get Models:**
```javascript
const models = await axios.get('/api/models');
// Returns: [{ name: 'claude-4.5-sonnet', displayName: 'Claude 4.5 Sonnet', ... }]
```

**Get MCP Tools:**
```javascript
const tools = await axios.get('/api/mcp-tools');
// Returns: [{ name: 'memory', displayName: 'Memory MCP', ... }]
```

### 🎨 Design Requirements

**Layout:**
- 3-column layout (sidebar, chat, settings)
- Sidebar: 280px width, dark background
- Chat: Flex-grow, white background
- Settings: 320px width, light gray background

**Colors:**
- Primary: Black (#000000)
- Secondary: Gray-800 (#1F2937)
- Accent: Blue-500 (#3B82F6)
- Background: White (#FFFFFF)
- Chat background: Gray-50 (#F9FAFB)

**Typography:**
- Font: Inter or system-ui
- Headings: 600 weight
- Body: 400 weight
- Code: Monospace

### 🔐 Security Notes

- All APIs protected with JWT
- File uploads validated for size and type
- MCP API keys encrypted in database
- Credits checked before message send
- Rate limiting on API endpoints

### 📊 Credits System

**Default Credits:**
- New users: 100 credits
- Free plan: 100 credits/month
- Standard plan: 1000 credits/month
- Pro plan: Unlimited credits

**Credit Usage:**
- Simple message: 0.5 credits
- With ultra thinking: 2.0 credits
- With file attachments: +0.5 credits
- Admin can add credits to users

### ✅ Next Steps

1. **Create chat-based dashboard UI** (highest priority)
2. **Connect dashboard to conversation API**
3. **Implement settings panel with all controls**
4. **Add file upload functionality**
5. **Implement GitHub integration**
6. **Add MCP tools configuration**
7. **Update admin panel with new features**
8. **Test complete flow end-to-end**

### 📝 Notes

- Backend is fully functional and tested
- All models and tools are initialized
- Test users have credits
- Ready for frontend implementation
- Follow emergent.sh design from provided images
