import { Clock, User as UserIcon } from 'lucide-react';

const TaskCard = ({ task, user, isAdmin, handleStatusChange }) => {
  const isAssignedToMe = task.assignedTo?._id === user._id || task.assignedTo === user._id;
  const canEdit = isAdmin || isAssignedToMe;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${
          task.priority === 'High' ? 'bg-red-100 text-red-700' : 
          task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {task.priority}
        </span>
      </div>
      <h4 className="font-bold text-slate-800 mb-1">{task.title}</h4>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center text-xs text-slate-500 font-medium border-t border-slate-100 pt-3 mb-3">
        <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(task.dueDate).toLocaleDateString()}</span>
        {task.assignedTo && (
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md" title="Assigned User">
            <UserIcon size={12}/> {task.assignedTo.name?.split(' ')[0] || 'User'}
          </span>
        )}
      </div>
      
      {canEdit ? (
        <div className="flex gap-2">
          {task.status !== 'To Do' && <button onClick={() => handleStatusChange(task._id, 'To Do')} className="flex-1 text-[11px] font-bold py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition">To Do</button>}
          {task.status !== 'In Progress' && <button onClick={() => handleStatusChange(task._id, 'In Progress')} className="flex-1 text-[11px] font-bold py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition">Start</button>}
          {task.status !== 'Done' && <button onClick={() => handleStatusChange(task._id, 'Done')} className="flex-1 text-[11px] font-bold py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition">Done</button>}
        </div>
      ) : (
        <div className="text-[10px] text-center font-semibold text-slate-400 bg-slate-50 py-1.5 rounded-lg border border-slate-100">View Only</div>
      )}
    </div>
  );
};

export default TaskCard;
