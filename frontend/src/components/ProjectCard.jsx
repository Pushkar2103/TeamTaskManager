import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const ProjectCard = ({ project, user }) => {
  const isAdmin = (project.admin?._id === user._id) || (project.admin === user._id);
  
  return (
    <Link to={`/projects/${project._id}`} className="block p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group bg-white">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
          {isAdmin ? 'Admin' : 'Member'}
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-5 line-clamp-2 min-h-[40px]">
        {project.description || "No description provided."}
      </p>
      <div className="flex items-center text-xs font-semibold text-slate-400 gap-1 pt-4 border-t border-slate-100">
        <Users size={14} /> {project.members?.length + 1} Team Member{(project.members?.length + 1) !== 1 ? 's' : ''}
      </div>
    </Link>
  );
};

export default ProjectCard;
