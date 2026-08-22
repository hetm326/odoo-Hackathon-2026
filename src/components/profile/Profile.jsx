import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth, useTrip } from '../../hooks/customHooks';
import { updateProfile } from '../../redux/slices/authSlice';
import { calculateUserStats } from '../../utils/helpers';
import { Card, Input, Button, Badge, AlertBanner } from '../LoadingComponents';
import { Camera, Check, X, Upload } from 'lucide-react';

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { trips } = useTrip();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    homeCity: user?.homeCity || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate dynamic user stats based on actual trips
  const stats = calculateUserStats(trips);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return; // Handle cancel gracefully

    // Validation: Image formats only
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
      setErrorMsg('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    // Validation: Max file size 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setErrorMsg('');

    // Read image using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process selected image.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    dispatch(updateProfile(formData));
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      homeCity: user?.homeCity || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setErrorMsg('');
  };

  // Helper initials avatar if no photo
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white">Profile Settings</h1>
        <p className="text-xs text-slate-400">Manage your travel passport details & account preferences</p>
      </div>

      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}
      {errorMsg && <AlertBanner type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      <Card className="space-y-6">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Avatar Header & File Picker Trigger */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-800">
          <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-brand-500 shadow-xl group-hover:opacity-80 transition"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-500 to-ocean-500 flex items-center justify-center text-2xl font-black text-white border-2 border-brand-500/50 shadow-xl group-hover:opacity-80 transition">
                {getInitials(formData.name)}
              </div>
            )}
            <div className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-500 text-white shadow-lg group-hover:scale-110 transition">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-white">{user?.name || 'Traveler'}</h3>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePhotoClick}
                className="space-x-1.5 border-brand-500/30 text-brand-300 hover:bg-brand-500/10"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </Button>
            </div>

            {/* Dynamic Real Stats */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <Badge variant="brand">{stats.countriesVisited} Countries Visited</Badge>
              <Badge variant="sky">{stats.totalTrips} Total Trips</Badge>
              <Badge variant="purple">{stats.completedAdventures} Completed</Badge>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <Input
            label="Home City"
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={formData.homeCity}
            onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">About / Travel Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell other travelers about your favorite destinations and travel goals..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" size="md" onClick={handleCancel} className="space-x-1">
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </Button>
            <Button type="submit" variant="primary" size="md" className="space-x-2">
              <Check className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;

