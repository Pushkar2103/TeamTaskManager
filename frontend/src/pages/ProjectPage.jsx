import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { Plus, ArrowLeft, Users } from 'lucide-react';

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
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <Navbar />
      
      <header className="bg-white border-b border-slate-200 px-6 py-5 shrink-0 shadow-sm z-10">
        <div className="max-w-[1600px] mx-auto">
          <Link to="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-3 font-semibold w-max">
            <ArrowLeft size={16}/> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-slate-800">{project.name}</h1>
                {isAdmin && <span className="px-2.5 py-1 bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full mt-1">Admin View</span>}
              </div>
              <p className="text-slate-500 mt-1 font-medium">{project.description}</p>
            </div>
            
            <div className="flex gap-3">
              {isAdmin && (
                <button onClick={() => setShowMemberModal(true)} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition">
                  <Users size={18} /> Add Member
                </button>
              )}
              {isAdmin && (
                <button onClick={() => setShowTaskModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-bold transition shadow-sm">
                  <Plus size={18} /> Add Task
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6 flex gap-6 bg-slate-50 max-w-[1600px] mx-auto w-full">
        {renderColumn('To Do', 'To Do', 'bg-slate-400')}
        {renderColumn('In Progress', 'In Progress', 'bg-amber-400')}
        {renderColumn('Done', 'Done', 'bg-green-500')}
      </main>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Task Title</label>
                <input type="text" required className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Due Date</label>
                  <input type="date" required className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2 rounded-lg outline-none" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Priority</label>
                  <select className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2 rounded-lg outline-none font-medium" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Assign To</label>
                <select className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2 rounded-lg outline-none font-medium" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Unassigned (Open)</option>
                  {project.members?.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                  <option value={project.admin._id || project.admin}>Myself (Admin)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">Add Team Member</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">Enter the email of an existing registered user.</p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">User Email</label>
                <input type="email" required placeholder="user@example.com" className="w-full border border-slate-300 bg-slate-50 focus:bg-white px-4 py-2.5 rounded-lg outline-none" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowMemberModal(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;