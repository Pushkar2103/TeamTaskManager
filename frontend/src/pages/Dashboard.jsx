import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { LayoutDashboard, CheckSquare, Clock, AlertCircle, Folder } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          API.get('/dashboard'),
          API.get('/projects')
        ]);
        setStats(statsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="p-8 flex justify-center text-slate-500">Loading your workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user.name}</h1>
          <p className="text-slate-500 mt-1">Here is the latest overview of your team tasks.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Tasks" 
            value={stats?.totalTasks || 0} 
            icon={<CheckSquare className="text-blue-600" />} 
          />
          <StatCard 
            title="In Progress" 
            value={stats?.tasksByStatus?.inProgress || 0} 
            icon={<Clock className="text-amber-500" />} 
          />
          <StatCard 
            title="Overdue Tasks" 
            value={stats?.overdueTasks || 0} 
            icon={<AlertCircle className="text-red-500" />} 
            className="bg-red-50 border-red-200"
          />
          <StatCard 
            title="Assigned to Me" 
            value={stats?.myTasksCount || 0} 
            icon={<LayoutDashboard className="text-purple-600" />} 
          />
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Your Projects</h2>
            <Link to="/projects/new" className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              + New Project
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <Folder className="mx-auto text-slate-400 mb-2" size={32} />
              <p>You don't belong to any projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link 
                  key={project._id} 
                  to={`/projects/${project._id}`}
                  className="block p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      project.admin._id === user._id || project.admin === user._id 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-slate-100 text-slate-700'
                    }`}>
                      {project.admin._id === user._id || project.admin === user._id ? 'Admin' : 'Member'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {project.description || "No description provided."}
                  </p>
                  <div className="text-xs font-medium text-slate-400">
                    {project.members.length + 1} Team Member(s)
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, className = "bg-white border-slate-200" }) => (
  <div className={`p-6 rounded-xl shadow-sm border flex items-center justify-between ${className}`}>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h4 className="text-3xl font-bold text-slate-800">{value}</h4>
    </div>
    <div className="p-3 bg-white/50 rounded-lg">
      {icon}
    </div>
  </div>
);

export default Dashboard;