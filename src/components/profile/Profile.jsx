import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/customHooks';
import { updateProfile } from '../../redux/slices/authSlice';
import { Card, Input, Button, Badge, AlertBanner } from '../LoadingComponents';
import { User, Mail, MapPin, Globe, Sparkles, Camera, Check } from 'lucide-react';

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    homeCity: user?.homeCity || 'San Francisco, CA',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white">Profile Settings</h1>
        <p className="text-xs text-slate-400">Manage your travel passport details & account preferences</p>
      </div>

      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <Card className="space-y-6">
        {/* Avatar Header */}
        <div className="flex items-center space-x-5 pb-6 border-b border-slate-800">
          <div className="relative">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-500 shadow-xl"
            />
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-500 text-white">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="brand">{user?.countriesVisited || 8} Countries Visited</Badge>
              <Badge variant="sky">{user?.travelsCount || 14} Trips Planned</Badge>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Home City"
            type="text"
            value={formData.homeCity}
            onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
          />

          <Input
            label="Avatar Image URL"
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          />

          <div className="pt-4">
            <Button type="submit" variant="primary" className="space-x-2">
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default Profile;
