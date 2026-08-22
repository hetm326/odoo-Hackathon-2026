import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth, useTrip } from '../../hooks/customHooks';
import { updateProfile } from '../../redux/slices/authSlice';
import { Card, Input, Button, Badge, AlertBanner } from '../LoadingComponents';
import {
  User,
  Camera,
  Check,
  X,
  Upload,
} from 'lucide-react';

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

  // Keep form data synchronized with the logged-in user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        homeCity: user.homeCity || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Calculate statistics from trips data
  const tripsCount = trips?.length || 0;
  
  // Extract unique countries from trips
  const countriesVisited = trips && trips.length > 0
    ? new Set(
        trips
          .map((trip) => {
            // Extract country from destination (format: "City, Country")
            const parts = trip.destination?.split(',');
            return parts?.[1]?.trim() || null;
          })
          .filter(Boolean) // Remove null/undefined
      ).size
    : 0;

  // Open file picker
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle profile photo selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMsg(
        'Invalid file type. Please upload a JPG, PNG, or WEBP image.'
      );

      e.target.value = '';
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      setErrorMsg(
        'Image size exceeds 5MB limit. Please choose a smaller image.'
      );

      e.target.value = '';
      return;
    }

    setErrorMsg('');

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      }
    };

    reader.onerror = () => {
      setErrorMsg('Failed to process selected image.');
    };

    reader.readAsDataURL(file);
  };

  // Save profile
  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg('');
    setSuccess('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    try {
      dispatch(updateProfile(formData));

      setSuccess('Profile updated successfully!');

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrorMsg('Failed to update profile. Please try again.');
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      homeCity: user?.homeCity || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });

    setErrorMsg('');
    setSuccess('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate initials
  const getInitials = (name) => {
    if (!name) return 'U';

    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name[0].toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">

      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white">
          Profile Settings
        </h1>

        <p className="text-xs text-slate-400">
          Manage your travel passport details & account preferences
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <AlertBanner
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}

      {/* Error Message */}
      {errorMsg && (
        <AlertBanner
          type="error"
          message={errorMsg}
          onClose={() => setErrorMsg('')}
        />
      )}

      <Card className="space-y-6">

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 border-b border-slate-800">

          {/* Avatar */}
          <div className="relative group">

            <button
              type="button"
              onClick={handlePhotoClick}
              className="relative block rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Change profile picture"
            >
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={`${formData.name || 'User'} profile`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-brand-500 shadow-xl group-hover:opacity-80 transition"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-500 to-ocean-500 flex items-center justify-center text-2xl font-black text-white border-2 border-brand-500/50 shadow-xl group-hover:opacity-80 transition">
                  {getInitials(formData.name)}
                </div>
              )}
            </button>

            {/* Camera Button */}
            <button
              type="button"
              onClick={handlePhotoClick}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600 hover:scale-110 transition"
              aria-label="Upload new profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>

          </div>

          {/* Profile Information */}
          <div className="space-y-2 text-center sm:text-left flex-1">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div>
                <h3 className="text-xl font-bold text-white">
                  {formData.name || 'Traveler'}
                </h3>

                <p className="text-xs text-slate-400">
                  {formData.email || 'No email available'}
                </p>
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

            {/* Dynamic Stats - Calculated from Trips */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">

              {countriesVisited > 0 && (
                <Badge variant="brand">
                  {countriesVisited} {countriesVisited === 1 ? 'Country' : 'Countries'} Visited
                </Badge>
              )}

              {tripsCount > 0 && (
                <Badge variant="sky">
                  {tripsCount} Total {tripsCount === 1 ? 'Trip' : 'Trips'}
                </Badge>
              )}

              {tripsCount === 0 && countriesVisited === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No trips yet. Start planning!
                </p>
              )}

            </div>

            <button
              type="button"
              onClick={handlePhotoClick}
              className="mt-2 text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              Change photo
            </button>

          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="your@email.com"
              required
            />

          </div>

          {/* Home City */}
          <Input
            label="Home City"
            type="text"
            value={formData.homeCity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                homeCity: e.target.value,
              }))
            }
            placeholder="e.g. Ahmedabad, Gujarat"
          />

          {/* Bio */}
          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-300">
              About / Travel Bio
            </label>

            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              placeholder="Tell other travelers about your favorite destinations and travel goals..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
            />

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancel}
              className="space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="space-x-2"
            >
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