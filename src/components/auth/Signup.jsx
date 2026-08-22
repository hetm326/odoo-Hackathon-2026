import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/customHooks';
import { Input, Button, AlertBanner } from '../LoadingComponents';
import { Compass, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { isValidEmail, isValidPassword } from '../../utils/helpers';

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Please fill out all required fields.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(formData.password)) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      await signup({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (err) {
      setFormError(err || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 mb-2">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-400">Join thousands of travelers building smart itineraries</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {(formError || error) && (
            <AlertBanner type="error" message={formError || error} onClose={() => setFormError('')} />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Alex Rivera"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="alex@globetrotter.io"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="At least 6 characters"
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

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              Create Free Account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Signup;
