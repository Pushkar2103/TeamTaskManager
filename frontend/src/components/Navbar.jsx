import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <CheckSquare className="text-white" size={20} />
        </div>
        TaskFlow
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-slate-700 block">{user.name}</span>
            <span className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">{user.role || 'Member'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut size={16} /> <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
