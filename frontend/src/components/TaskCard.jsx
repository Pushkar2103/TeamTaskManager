import { Clock, User as UserIcon, Pencil, Trash2 } from 'lucide-react';

const TaskCard = ({ task, user, isAdmin, handleStatusChange, onEditTask, onDeleteTask }) => {
  const isAssignedToMe = task.assignedTo?._id === user._id || task.assignedTo === user._id;
  const canChangeStatus = isAdmin || isAssignedToMe;
  const statusTone = task.status === 'Done'
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : task.status === 'In Progress'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';
  const priorityTone = task.priority === 'High'
    ? 'from-rose-500 to-orange-500'
    : task.priority === 'Medium'
      ? 'from-amber-500 to-yellow-500'
      : 'from-sky-500 to-cyan-500';

  return (
    <div className="group relative overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.1)]">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${priorityTone}`} />
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className={`task-status-badge border ${statusTone}`}>
          {task.status}
        </span>
        <span className={`task-status-badge bg-gradient-to-r ${priorityTone} text-white shadow-sm`}>
          {task.priority}
        </span>
      </div>
      <h4 className="mb-2 text-base font-black text-slate-900">{task.title}</h4>
      <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
      
      <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(task.dueDate).toLocaleDateString()}</span>
        {task.assignedTo && (
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600" title="Assigned User">
            <UserIcon size={12}/> {task.assignedTo.name?.split(' ')[0] || 'User'}
          </span>
        )}
      </div>
      
      {canChangeStatus ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
          {task.status !== 'To Do' && <button onClick={() => handleStatusChange(task._id, 'To Do')} className="rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 transition hover:bg-slate-200">To Do</button>}
          {task.status !== 'In Progress' && <button onClick={() => handleStatusChange(task._id, 'In Progress')} className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-700 transition hover:bg-amber-100">Start</button>}
          {task.status !== 'Done' && <button onClick={() => handleStatusChange(task._id, 'Done')} className="rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-emerald-100">Done</button>}
          </div>
          {isAdmin && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onEditTask?.(task)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-700 transition hover:bg-blue-100"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteTask?.(task)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-slate-50 py-2 text-center text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">View Only</div>
      )}
    </div>
  );
};

export default TaskCard;
