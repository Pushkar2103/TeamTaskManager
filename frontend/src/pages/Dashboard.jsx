import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { LayoutDashboard, AlertCircle, Folder, Plus, User as UserIcon, Users, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="app-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="page-wrap flex-1">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 shadow-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <section className="hero-panel mb-8">
          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl animate-float delay-2" />
          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <div className="accent-chip w-fit"><Sparkles size={12} /> Team command center</div>
              <h1 className="page-heading mt-5">Dashboard</h1>
              <p className="page-subtitle">Track work, see team distribution, and keep projects moving without losing sight of deadlines.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="accent-chip"><Users size={12} /> {user.role || 'Member'} account</span>
                <span className="accent-chip">{stats?.projectsCount || 0} active projects</span>
                <span className="accent-chip">{stats?.myTasksCount || 0} assigned to me</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.4rem] bg-slate-950 p-5 text-white shadow-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">Focus today</p>
                <div className="mt-3 text-4xl font-black">{stats?.overdueTasks || 0}</div>
                <p className="mt-2 text-sm text-white/75">Overdue tasks need attention.</p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Quick action</p>
                <button onClick={() => setShowCreateModal(true)} className="mt-3 inline-flex items-center gap-2 font-bold text-blue-700 transition hover:text-blue-800">
                  Create a project <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="section-card p-6 lg:col-span-2">
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

          <div className="section-card p-6">
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

        <div className="section-card p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Folder className="text-slate-400" /> Your Projects
            </h2>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary gap-2 py-2.5 text-sm">
              <Plus size={16} /> New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-[1.4rem] border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
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

export default Dashboard;
