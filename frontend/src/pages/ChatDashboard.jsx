import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Send, Paperclip, Mic, Settings, Github, Plus, MessageSquare, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatDashboard = () => {
  const { user, logout } = useAuth();
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [models, setModels] = useState([]);
  const [mcpTools, setMcpTools] = useState([]);
  const [loading, setLoading] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    agentMode: 'e1',
    ultraThinking: false,
    model: 'claude-4.5-sonnet',
    mcpTools: []
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchConversations();
    fetchModels();
    fetchMCPTools();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API}/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${API}/models`);
      setModels(response.data);
      if (response.data.length > 0) {
        setSettings(prev => ({ ...prev, model: response.data[0].name }));
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const fetchMCPTools = async () => {
    try {
      const response = await axios.get(`${API}/mcp-tools`);
      setMcpTools(response.data);
    } catch (error) {
      console.error('Failed to fetch MCP tools:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${API}/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await axios.post(`${API}/conversations`, {
        projectName: 'New Project',
        settings
      });
      setCurrentConversation(response.data);
      setConversations([response.data, ...conversations]);
      setMessages([]);
    } catch (error) {
      toast.error('Failed to create conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Create conversation if none exists
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    setLoading(true);
    const userMessage = input;
    setInput('');

    // Add user message to UI immediately
    const tempUserMsg = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, tempUserMsg]);

    try {
      const response = await axios.post(`${API}/conversations/messages`, {
        conversationId: currentConversation._id,
        content: userMessage,
        settings
      });

      // Fetch updated messages
      await fetchMessages(currentConversation._id);
      toast.success('Message sent!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send message');
      // Remove the temp message on error
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const agentModes = [
    { value: 'e1', label: 'E-1', description: 'Stable & thorough' },
    { value: 'e1.1', label: 'E-1.1', description: 'Fast & flexible' },
    { value: 'e2', label: 'E-2', description: 'Deep & relentless (Beta)' },
    { value: 'prototype', label: 'Prototype', description: 'Frontend only' },
    { value: 'mobile', label: 'Mobile', description: 'Mobile apps' }
  ];

  const templates = [
    { icon: '📺', name: 'Clone Youtube' },
    { icon: '💰', name: 'Budget Planner' },
    { icon: '📚', name: 'Smart Course' },
    { icon: '✨', name: 'Surprise Me' }
  ];

  const isNewUser = messages.length === 0 && !currentConversation;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-gray-900 font-bold">
              E
            </div>
            <span className="text-lg font-semibold">{user?.name}'s Space</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {user?.credits?.toFixed(1) || '0'} credits
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        {isNewUser ? (
          <div className="max-w-3xl w-full text-center space-y-12">
            <h1 className="text-5xl font-light text-white mb-8 animate-fade-in">
              What will you build today?
            </h1>
          </div>
        ) : (
          <div className="max-w-4xl w-full space-y-6 mb-8 overflow-y-auto max-h-[60vh] px-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-2xl px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent pt-8 pb-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Input Box */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Build me a beautiful website for..."
              className="w-full bg-transparent text-white placeholder-gray-500 px-6 py-4 focus:outline-none resize-none"
              rows="3"
            />

            {/* Controls Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                {/* File Upload */}
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Attach files">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </button>

                {/* GitHub */}
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Connect GitHub">
                  <Github className="w-5 h-5 text-gray-400" />
                </button>

                {/* Agent Mode */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-white">
                      {agentModes.find(m => m.value === settings.agentMode)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                    {agentModes.map(mode => (
                      <button
                        key={mode.value}
                        onClick={() => setSettings({ ...settings, agentMode: mode.value })}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-white">{mode.label}</div>
                        <div className="text-xs text-gray-400">{mode.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ultra Thinking */}
                <button
                  onClick={() => setSettings({ ...settings, ultraThinking: !settings.ultraThinking })}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    settings.ultraThinking
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Ultra thinking mode"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Ultra</span>
                </button>

                {/* Model Selector */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <span className="text-sm text-white">
                      {models.find(m => m.name === settings.model)?.displayName || 'Select Model'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 min-w-[250px] max-h-[300px] overflow-y-auto z-50">
                    {models.map(model => (
                      <button
                        key={model.name}
                        onClick={() => setSettings({ ...settings, model: model.name })}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-white">{model.displayName}</div>
                        <div className="text-xs text-gray-400">{model.provider}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Voice Input */}
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Mic className="w-5 h-5 text-gray-400" />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Templates (only show for new users) */}
          {isNewUser && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              {templates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(`Build me ${template.name.toLowerCase()}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full transition-colors"
                >
                  <span>{template.icon}</span>
                  <span className="text-sm text-gray-300">{template.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Conversations) */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          ></div>
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Conversations</h2>
              <button
                onClick={createNewConversation}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {conversations.map(conv => (
                <button
                  key={conv._id}
                  onClick={() => {
                    setCurrentConversation(conv);
                    fetchMessages(conv._id);
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentConversation?._id === conv._id
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium text-white">{conv.projectName}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;