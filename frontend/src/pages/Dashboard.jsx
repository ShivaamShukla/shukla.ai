import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Settings, ExternalLink, Trash2, Rocket, LayoutGrid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import DashboardNav from '../components/DashboardNav';
import CreateProjectModal from '../components/CreateProjectModal';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await axios.post(`${API}/projects`, projectData);
      setProjects([...projects, response.data]);
      setCreateModalOpen(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create project');
      throw error;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`${API}/projects/${projectId}`);
      setProjects(projects.filter(p => p._id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleDeployProject = async (projectId) => {
    try {
      const response = await axios.post(`${API}/projects/${projectId}/deploy`);
      setProjects(projects.map(p => 
        p._id === projectId ? { ...p, status: 'deployed', url: response.data.url } : p
      ));
      toast.success('Project deployed successfully!');
    } catch (error) {
      toast.error('Failed to deploy project');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      building: 'bg-blue-100 text-blue-700',
      deployed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.draft;
  };

  const getTypeIcon = (type) => {
    const icons = {
      web: '🌐',
      mobile: '📱',
      agent: '🤖',
      integration: '🔗'
    };
    return icons[type] || '🌐';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your projects and track their progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Total Projects</div>
            <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Deployed</div>
            <div className="text-3xl font-bold text-green-600">
              {projects.filter(p => p.status === 'deployed').length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">In Progress</div>
            <div className="text-3xl font-bold text-blue-600">
              {projects.filter(p => p.status === 'building').length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Plan</div>
            <div className="text-xl font-bold text-gray-900 capitalize">
              {user?.subscription?.plan || 'free'}
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
          <div className="flex items-center space-x-4">
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
            >
              Create Project
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getTypeIcon(project.type)}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                        getStatusColor(project.status)
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    {project.status === 'deployed' && project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {project.status !== 'deployed' && (
                      <button
                        onClick={() => handleDeployProject(project._id)}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Deploy"
                      >
                        <Rocket className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-gray-600 hover:text-gray-700 transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default Dashboard;