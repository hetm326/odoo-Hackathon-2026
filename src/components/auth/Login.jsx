import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/customHooks';
import { Input, Button, AlertBanner } from '../LoadingComponents';
import { Compass, Lock, Mail, Eye, EyeOff, Sparkles } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setFormData({ email: 'alex@globetrotter.io', password: 'password123' });
    try {
      await login({ email: 'alex@globetrotter.io', password: 'password123' });
      navigate('/dashboard');
    } catch (err) {
      setFormError('Demo login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 mb-2">
            <Compass className="w-8 h-8 animate-pulse-slow" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400">Log in to manage your itineraries & travel budgets</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {(formError || error) && (
            <AlertBanner type="error" message={formError || error} onClose={() => setFormError('')} />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="shrink-0 mx-4 text-[11px] text-slate-500 uppercase tracking-widest font-semibold">OR</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full space-x-2 border-brand-500/30 text-brand-300 hover:bg-brand-500/10"
            onClick={handleDemoLogin}
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>1-Click Demo Account Login</span>
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
