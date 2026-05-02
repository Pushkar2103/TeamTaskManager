import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, CheckSquare, Rocket, Users } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signup(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="page-wrap grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <section className="glass-card order-2 p-6 sm:p-8 lg:order-1 lg:p-10">
          <div className="mb-8 text-center">
            
            <h2 className="text-2xl font-black text-slate-900">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">Join your team and start managing tasks.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Full Name</label>
              <input type="text" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address</label>
              <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
              <input type="password" required minLength={6} className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Account Type</label>
              <div className="flex gap-3">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="role" value="Member" checked={role === 'Member'} onChange={() => setRole('Member')} />
                  <span className="text-sm">Member</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="role" value="Admin" checked={role === 'Admin'} onChange={() => setRole('Admin')} />
                  <span className="text-sm">Admin</span>
                </label>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-4">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </section>

        <section className="hero-panel order-1 overflow-hidden lg:order-2">
          <div className="absolute -left-20 top-8 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl animate-float delay-3" />
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="accent-chip w-fit"> Built for team execution</div>
            <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Keep every project visible from day one.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Create a workspace where admins manage tasks, members stay aligned, and every deadline has a clear owner.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Role based', 'Admins manage people and tasks', <Users size={18} />],
                ['Fast setup', 'Start collaborating in minutes', <Rocket size={18} />],
                ['Clean visibility', 'Track progress without noise', <CheckSquare size={18} />],
              ].map(([title, desc, Icon]) => (
                <div key={title} className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">{Icon}</div>
                  <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signup;
