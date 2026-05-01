import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, CheckSquare, Sparkles, ShieldCheck, KanbanSquare } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="page-wrap grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <section className="hero-panel order-2 overflow-hidden lg:order-1">
          <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl animate-float delay-2" />
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="accent-chip w-fit"><Sparkles size={12} /> Collaborative planning made sharp</div>
            <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              A calmer way to move work forward.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              TaskFlow helps teams create projects, assign work, and keep progress visible without the clutter of a heavyweight tool.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Admin controls', 'Members, tasks, and access from one workspace'],
                ['Status tracking', 'Move tasks from to-do to done with clarity'],
                ['Deadline focus', 'Overdue items stand out immediately'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    {title === 'Admin controls' ? <ShieldCheck size={18} /> : title === 'Status tracking' ? <KanbanSquare size={18} /> : <CheckSquare size={18} />}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-card order-1 p-6 sm:p-8 lg:order-2 lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-200">
              <CheckSquare className="text-white" size={28} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to your team workspace.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address</label>
              <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
              <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-600">
            Don&apos;t have an account? <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">Sign up</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
