import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, user }) => {
  const isAdmin = (project.admin?._id === user._id) || (project.admin === user._id);
  
  return (
    <Link to={`/projects/${project._id}`} className="group relative block overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${isAdmin ? 'from-violet-500 via-fuchsia-500 to-cyan-500' : 'from-blue-500 via-cyan-500 to-emerald-500'}`} />
      <div className="mb-5 flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 text-lg font-black text-slate-900 transition-colors group-hover:text-blue-700">
          {project.name}
        </h3>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${isAdmin ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
          {isAdmin ? 'Admin' : 'Member'}
        </span>
      </div>
      <p className="mb-6 min-h-[44px] line-clamp-2 text-sm leading-6 text-slate-500">
        {project.description || 'No description provided.'}
      </p>
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5"><Users size={14} /> {project.members?.length + 1} Team Member{(project.members?.length + 1) !== 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1 text-blue-600 transition group-hover:translate-x-0.5">Open <ArrowRight size={13} /></span>
      </div>
    </Link>
  );
};

export default ProjectCard;
