import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { LayoutDashboard, CheckSquare, Clock, AlertCircle, Folder, Plus, User as UserIcon, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Project creation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes] = await Promise.all([
        API.get('/dashboard'),
        API.get('/projects')
      ]);
      setStats(statsRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await API.post('/projects', newProject);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-70px)] text-slate-500 font-medium">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 font-medium">
            <AlertCircle /> {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Overview of your team tasks.</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600">
            <Users size={14} /> {user.role || 'Member'} account
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Tasks" value={stats?.totalTasks || 0} icon={<CheckSquare size={28} />} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="To Do" value={stats?.tasksByStatus?.toDo || 0} icon={<LayoutDashboard size={28} />} color="text-slate-600" bg="bg-slate-50" />
          <StatCard title="In Progress" value={stats?.tasksByStatus?.inProgress || 0} icon={<Clock size={28} />} color="text-amber-500" bg="bg-amber-50" />
          <StatCard title="Overdue" value={stats?.overdueTasks || 0} icon={<AlertCircle size={28} />} color="text-red-500" bg="bg-red-50" outline="border-red-100 bg-red-50/50" />
          <StatCard title="Done" value={stats?.tasksByStatus?.done || 0} icon={<CheckSquare size={28} />} color="text-green-600" bg="bg-green-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <LayoutDashboard className="text-slate-400" size={20} /> Tasks by Status
            </h2>
            <div className="space-y-4">
              {[
                ['To Do', stats?.tasksByStatus?.toDo || 0, 'bg-slate-500'],
                ['In Progress', stats?.tasksByStatus?.inProgress || 0, 'bg-amber-500'],
                ['Done', stats?.tasksByStatus?.done || 0, 'bg-green-500'],
              ].map(([label, value, barClass]) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-700">{label}</span>
                    <span className="text-sm font-bold text-slate-600">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barClass}`}
                      style={{ width: `${stats?.totalTasks ? (value / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <UserIcon className="text-slate-400" size={20} /> Tasks per User
            </h2>
            <div className="space-y-3 max-h-[280px] overflow-auto pr-1">
              {(stats?.tasksPerUser || []).map((entry) => (
                <div key={entry.userId || entry.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div>
                    <p className="font-semibold text-slate-800">{entry.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">{entry.role}</p>
                  </div>
                  <span className="text-sm font-extrabold text-slate-700">{entry.count}</span>
                </div>
              ))}
              {(!stats?.tasksPerUser || stats.tasksPerUser.length === 0) && (
                <div className="text-sm text-slate-500">No assigned tasks yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Folder className="text-slate-400" /> Your Projects
            </h2>
            <button onClick={() => setShowCreateModal(true)} className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
              <Plus size={16} /> New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Folder className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="font-medium text-lg text-slate-600 mb-1">No projects yet</p>
              <p className="text-sm">Create your first project to start collaborating.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} user={user} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Project Name</label>
                <input type="text" required className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md disabled:opacity-70">
                  {isCreating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg, outline = "border-slate-200 bg-white" }) => (
  <div className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between ${outline}`}>
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">{title}</p>
      <h4 className="text-4xl font-extrabold text-slate-800">{value}</h4>
    </div>
    <div className={`p-4 rounded-xl ${bg} ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;
