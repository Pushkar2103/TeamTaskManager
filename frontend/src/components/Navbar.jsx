import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-200 transition group-hover:scale-105">
            <CheckSquare className="text-white" size={22} />
          </div>
          <div className="leading-tight">
            <div>TaskFlow</div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Team Workspace</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/projects" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
            <FolderKanban size={16} /> Projects
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-600 text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-semibold text-slate-800">{user.name}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{user.role || 'Member'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} /> <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
