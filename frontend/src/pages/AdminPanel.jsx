import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import DashboardNav from '../components/DashboardNav';
import { Users, FolderKanban, Activity, TrendingUp, Trash2, UserCheck, Shield } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, projectsRes, activitiesRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/users`),
        axios.get(`${API}/admin/projects`),
        axios.get(`${API}/admin/activities`)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their projects.')) {
      return;
    }

    try {
      await axios.delete(`${API}/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      await axios.put(`${API}/admin/users/${userId}/role?role=${newRole}`);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
    }
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
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Manage users, projects, and system statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.users?.total || 0}</div>
            <div className="text-gray-500 text-sm">Total Users</div>
            <div className="text-green-600 text-sm mt-2">{stats?.users?.active || 0} active</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <FolderKanban className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.projects?.total || 0}</div>
            <div className="text-gray-500 text-sm">Total Projects</div>
            <div className="text-green-600 text-sm mt-2">{stats?.projects?.deployed || 0} deployed</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.users?.bySubscription?.pro || 0}
            </div>
            <div className="text-gray-500 text-sm">Pro Users</div>
            <div className="text-blue-600 text-sm mt-2">
              {stats?.users?.bySubscription?.standard || 0} standard
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{activities.length}</div>
            <div className="text-gray-500 text-sm">Recent Activities</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'activities'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Activities
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Free Users</span>
                          <span className="font-semibold">{stats?.users?.bySubscription?.free || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{
                              width: `${((stats?.users?.bySubscription?.free || 0) / (stats?.users?.total || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Standard Users</span>
                          <span className="font-semibold">{stats?.users?.bySubscription?.standard || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${((stats?.users?.bySubscription?.standard || 0) / (stats?.users?.total || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Pro Users</span>
                          <span className="font-semibold">{stats?.users?.bySubscription?.pro || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${((stats?.users?.bySubscription?.pro || 0) / (stats?.users?.total || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Deployed Projects</span>
                          <span className="font-semibold">{stats?.projects?.deployed || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${((stats?.projects?.deployed || 0) / (stats?.projects?.total || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Building Projects</span>
                          <span className="font-semibold">{stats?.projects?.building || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${((stats?.projects?.building || 0) / (stats?.projects?.total || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Draft Projects</span>
                          <span className="font-semibold">{stats?.projects?.draft || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-400 h-2 rounded-full"
                            style={{
                              width: `${((stats?.projects?.draft || 0) / (stats?.projects?.total || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Projects</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 capitalize text-gray-600">
                          {user.subscription?.plan || 'free'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.projects?.length || 0}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleRole(user._id, user.role)}
                              className="text-blue-600 hover:text-blue-700 p-2"
                              title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                            >
                              <UserCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="Delete user"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const owner = users.find(u => u._id === project.userId);
                      return (
                        <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{project.name}</td>
                          <td className="py-3 px-4 capitalize text-gray-600">{project.type}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                project.status === 'deployed'
                                  ? 'bg-green-100 text-green-700'
                                  : project.status === 'building'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{owner?.name || 'Unknown'}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-4">
                {activities.slice(0, 20).map((activity) => {
                  const user = users.find(u => u._id === activity.userId);
                  return (
                    <div
                      key={activity._id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">{user?.name || 'Unknown'}</span>
                          <span className="text-gray-500">{activity.action}</span>
                          <span className="text-gray-700">{activity.resource}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
