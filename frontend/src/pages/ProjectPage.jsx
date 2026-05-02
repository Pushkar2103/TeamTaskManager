import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { Plus, ArrowLeft, Users, ClipboardList, CheckCircle2, X } from 'lucide-react';

const emptyTaskForm = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
  status: 'To Do',
  assignedTo: '',
};

const ProjectPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('create');
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showDeleteTaskConfirmation, setShowDeleteTaskConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [newTask, setNewTask] = useState(emptyTaskForm);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [notification, setNotification] = useState(null);

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

  useEffect(() => { 
    if (id) {
      fetchProjectData(); 
    }
  }, [id]);

  const fetchAvailableUsers = async () => {
    try {
      const { data } = await API.get('/auth/users');
      setAvailableUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const buildEmailSuggestions = (value, users = availableUsers) => {
    if (!project) return [];

    const currentMemberIds = project.members?.map((member) => member._id) || [];
    const adminId = project.admin?._id || project.admin;
    const searchValue = value.trim().toLowerCase();

    if (!searchValue) return [];

    return users
      .filter((candidate) => {
        if (candidate._id === adminId) return false;
        if (currentMemberIds.includes(candidate._id)) return false;
        return candidate.email.toLowerCase().includes(searchValue) || candidate.name.toLowerCase().includes(searchValue);
      })
      .slice(0, 5);
  };

  useEffect(() => {
    if (showMemberModal) {
      fetchAvailableUsers();
    } else {
      setNewMemberEmail('');
      setEmailSuggestions([]);
    }
  }, [showMemberModal]);

  useEffect(() => {
    if (showMemberModal) {
      if (newMemberEmail.trim()) {
        setEmailSuggestions(buildEmailSuggestions(newMemberEmail));
      } else {
        setEmailSuggestions([]);
      }
    }
  }, [availableUsers, project, newMemberEmail, showMemberModal]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreateTaskModal = () => {
    setTaskModalMode('create');
    setTaskToEdit(null);
    setNewTask(emptyTaskForm);
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    setTaskModalMode('edit');
    setTaskToEdit(task);
    setNewTask({
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      priority: task.priority || 'Medium',
      status: task.status || 'To Do',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
    });
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setTaskToEdit(null);
    setTaskModalMode('create');
    setNewTask(emptyTaskForm);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewMemberEmail(value);

    setEmailSuggestions(buildEmailSuggestions(value));
  };

  const selectSuggestion = (email) => {
    setNewMemberEmail(email);
    setEmailSuggestions([]);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error updating status', 'error');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (taskModalMode === 'edit' && taskToEdit) {
        await API.patch(`/tasks/${taskToEdit._id}`, newTask);
        showNotification('Task updated successfully!', 'success');
      } else {
        await API.post('/tasks', { ...newTask, projectId: id });
        showNotification('Task created successfully!', 'success');
      }

      closeTaskModal();
      fetchProjectData();
    } catch (err) {
      showNotification(err.response?.data?.message || `Error ${taskModalMode === 'edit' ? 'updating' : 'creating'} task`, 'error');
    }
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteTaskConfirmation(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await API.delete(`/tasks/${taskToDelete._id}`);
      showNotification('Task deleted successfully!', 'success');
      setShowDeleteTaskConfirmation(false);
      setTaskToDelete(null);
      fetchProjectData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error deleting task', 'error');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/add-member`, { email: newMemberEmail });
      setShowMemberModal(false);
      setNewMemberEmail('');
      setEmailSuggestions([]);
      showNotification('Member added successfully!', 'success');
      fetchProjectData(); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error adding member';
      showNotification(errorMsg, 'error');
    }
  };

  const handleRemoveMember = (member) => {
    setMemberToRemove(member);
    setShowRemoveConfirmation(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await API.delete(`/projects/${id}/remove-member/${memberToRemove._id}`);
      showNotification('Member removed successfully!', 'success');
      setShowRemoveConfirmation(false);
      setMemberToRemove(null);
      fetchProjectData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error removing member', 'error');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="p-8 text-center text-slate-500 font-medium mt-10">Loading board...</div></div>;
  if (error || !project) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-wrap flex-1">
        <div className="mt-10 rounded-[1.4rem] border-2 border-dashed border-slate-200 bg-slate-50 py-16 px-6 text-center">
          <div className="inline-block rounded-full bg-slate-100 p-4 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-medium text-lg text-slate-600 mb-2">Project Not Found</p>
          <p className="text-slate-500 mb-6">{error || "This project doesn't exist or you don't have access to it."}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );

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
            <TaskCard
              key={task._id}
              task={task}
              user={user}
              isAdmin={isAdmin}
              handleStatusChange={handleStatusChange}
              onEditTask={openEditTaskModal}
              onDeleteTask={handleDeleteTask}
            />
          ))}
          {columnTasks.length === 0 && <div className="border-2 border-dashed border-slate-300 rounded-xl h-24 flex items-center justify-center text-sm font-medium text-slate-400">Empty List</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg font-medium shadow-lg z-40 animate-in fade-in slide-in-from-top ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : notification.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
      
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
                  <Users size={18} /> Manage Members
                </button>
              )}
              {isAdmin && (
                <button onClick={openCreateTaskModal} className="btn-primary gap-2 py-3">
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

      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md p-8">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
              {taskModalMode === 'edit' ? 'Edit Task' : 'Create New Task'}
            </div>
            <h2 className="mb-6 text-xl font-black text-slate-900">Task details</h2>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
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
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Status</label>
                <select className="input-field font-medium" value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
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

      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowMemberModal(false)}>
          <div className="glass-card w-full max-w-md p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-slate-400"> Team Management</div>
            <h2 className="text-xl font-black text-slate-900 mb-6">Manage Members</h2>
            
            {/* Current Members List */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Current Members ({(project.members?.length || 0) + 1})</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {/* Admin */}
                <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
                  <div>
                    <p className="font-semibold text-slate-800">{project.admin?.name || 'Admin'}</p>
                    <p className="text-[11px] text-slate-500">{project.admin?.email}</p>
                  </div>
                  <span className="inline-block rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700">Admin</span>
                </div>
                
                {/* Members */}
                {project.members && project.members.length > 0 ? (
                  project.members.map(member => (
                    <div key={member._id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        <p className="text-[11px] text-slate-500">{member.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Remove member"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No members added yet</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Add Member</h3>
              <form onSubmit={handleAddMember} className="space-y-3">
                <div className="relative">
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">User Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="user@example.com" 
                    className="input-field w-full" 
                    value={newMemberEmail} 
                    onChange={handleEmailChange}
                    onBlur={() => setTimeout(() => setEmailSuggestions([]), 200)}
                    autoFocus
                  />
                  
                  {/* Email Suggestions Dropdown */}
                  {emailSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      {emailSuggestions.map(user => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => selectSuggestion(user.email)}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition"
                        >
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setShowMemberModal(false)} className="btn-secondary py-2.5">Cancel</button>
                  <button type="submit" className="btn-primary py-2.5">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveConfirmation && memberToRemove && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowRemoveConfirmation(false)}>
          <div className="glass-card w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <X className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Remove Member?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove <span className="font-semibold">{memberToRemove.name}</span> from this project? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setShowRemoveConfirmation(false)}
                className="btn-secondary py-2.5"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRemoveMember} 
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteTaskConfirmation && taskToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowDeleteTaskConfirmation(false)}>
          <div className="glass-card w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <X className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Delete Task?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{taskToDelete.title}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteTaskConfirmation(false)}
                className="btn-secondary py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="rounded-xl bg-red-600 px-4 py-2.5 font-bold text-white transition hover:bg-red-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;