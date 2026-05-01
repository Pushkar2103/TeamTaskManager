import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { Plus, ArrowLeft, Users, Sparkles, ClipboardList, CheckCircle2 } from 'lucide-react';

const ProjectPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const fetchProjectData = async () => {
    try {
      const { data: projectsData } = await API.get('/projects');
      const currentProject = projectsData.find(p => p._id === id);
      if (!currentProject) throw new Error("Project not found");
      setProject(currentProject);

      const { data: tasksData } = await API.get(`/tasks/project/${id}`);
      setTasks(tasksData);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjectData(); }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/add-member`, { email: newMemberEmail });
      setShowMemberModal(false);
      setNewMemberEmail('');
      fetchProjectData(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="p-8 text-center text-slate-500 font-medium mt-10">Loading board...</div></div>;
  if (error || !project) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="p-8 text-center text-red-500 font-bold mt-10">{error || "Project not found"}</div></div>;

  const isAdmin = (project.admin?._id === user._id) || (project.admin === user._id);

  const renderColumn = (status, title, dotColor) => {
    const columnTasks = tasks.filter(t => t.status === status);
    return (
      <div className="flex-shrink-0 w-[320px] bg-slate-100/70 border border-slate-200 rounded-2xl p-4 flex flex-col max-h-full">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span> {title}
          </h3>
          <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">{columnTasks.length}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          {columnTasks.map(task => (
            <TaskCard key={task._id} task={task} user={user} isAdmin={isAdmin} handleStatusChange={handleStatusChange} />
          ))}
          {columnTasks.length === 0 && <div className="border-2 border-dashed border-slate-300 rounded-xl h-24 flex items-center justify-center text-sm font-medium text-slate-400">Empty List</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <header className="page-wrap shrink-0">
        <div className="hero-panel p-6 sm:p-8 lg:p-10">
          <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl animate-float" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link to="/" className="accent-chip w-fit text-blue-700 hover:text-blue-800">
                <ArrowLeft size={14}/> Back to Dashboard
              </Link>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{project.name}</h1>
                {isAdmin && <span className="accent-chip border-violet-200 bg-violet-50 text-violet-700">Admin View</span>}
              </div>
              <p className="page-subtitle mt-3 max-w-3xl">{project.description || 'A shared workspace for your team to ship work with clarity.'}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="accent-chip"><Users size={14} /> {project.members?.length + 1} collaborators</span>
                <span className="accent-chip"><ClipboardList size={14} /> {tasks.length} tasks</span>
                <span className="accent-chip"><CheckCircle2 size={14} /> {tasks.filter(t => t.status === 'Done').length} completed</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <button onClick={() => setShowMemberModal(true)} className="btn-secondary gap-2 py-3">
                  <Users size={18} /> Add Member
                </button>
              )}
              {isAdmin && (
                <button onClick={() => setShowTaskModal(true)} className="btn-primary gap-2 py-3">
                  <Plus size={18} /> Add Task
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="page-wrap flex-1 overflow-x-auto">
        <div className="flex gap-6">
        {renderColumn('To Do', 'To Do', 'bg-slate-400')}
        {renderColumn('In Progress', 'In Progress', 'bg-amber-400')}
        {renderColumn('Done', 'Done', 'bg-green-500')}
        </div>
      </main>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md p-8">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-slate-400"><Sparkles size={14} /> Create New Task</div>
            <h2 className="mb-6 text-xl font-black text-slate-900">Task details</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Task Title</label>
                <input type="text" required className="input-field" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Description</label>
                <textarea className="input-field" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Due Date</label>
                  <input type="date" required className="input-field" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Priority</label>
                  <select className="input-field font-medium" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Assign To</label>
                <select className="input-field font-medium" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Unassigned (Open)</option>
                  {project.members?.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                  <option value={project.admin._id || project.admin}>Myself (Admin)</option>
                </select>
              </div>
              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary py-2.5">Cancel</button>
                <button type="submit" className="btn-primary py-2.5">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-sm p-8">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-slate-400"><Sparkles size={14} /> Add Team Member</div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Invite a collaborator</h2>
            <p className="mb-6 text-sm font-medium text-slate-500">Enter the email of an existing registered user.</p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">User Email</label>
                <input type="email" required placeholder="user@example.com" className="input-field" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} />
              </div>
              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setShowMemberModal(false)} className="btn-secondary py-2.5">Cancel</button>
                <button type="submit" className="btn-primary py-2.5">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;