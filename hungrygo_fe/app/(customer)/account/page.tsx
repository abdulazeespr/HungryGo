'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUserProfile, updateUserProfile } from '@/store/slices/userSlice';
import { gsap } from 'gsap';
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  dietaryPreferences: string[];
  allergies: string[];
}

export default function AccountSettingsPage() {
  const dispatch = useAppDispatch();
  const { profile, loading, error, updateSuccess } = useAppSelector((state) => state.user);
  
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && profile) {
      // Animate profile summary
      gsap.fromTo(
        '.profile-summary',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // Animate settings categories with staggered timing
      gsap.fromTo(
        '.settings-category',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, ease: 'power1.out' }
      );
    }
  }, [loading, profile]);

  useEffect(() => {
    if (updateSuccess) {
      // Show success animation
      const timeline = gsap.timeline();
      
      timeline.to('.success-indicator', {
        scale: 1.2,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      }).to('.success-indicator', {
        scale: 1,
        duration: 0.2,
        delay: 0.1
      }).to('.success-indicator', {
        opacity: 0,
        duration: 0.3,
        delay: 1
      });
      
      // Reset editing state
      setIsEditing(false);
    }
  }, [updateSuccess]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData));
  };

  // Toggle editing mode
  const toggleEditing = () => {
    if (isEditing) {
      // If currently editing, show confirmation before canceling
      setConfirmationAction('cancel');
      setShowConfirmation(true);
    } else {
      setIsEditing(true);
      
      // Animate form fields when entering edit mode
      setTimeout(() => {
        gsap.fromTo(
          '.form-field',
          { borderColor: 'rgba(209, 213, 219, 1)' },
          { 
            borderColor: 'rgba(20, 184, 166, 1)', 
            duration: 0.3, 
            stagger: 0.1,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 1
          }
        );
      }, 100);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setConfirmationAction('logout');
    setShowConfirmation(true);
  };

  // Confirm action (logout or cancel editing)
  const confirmAction = () => {
    if (confirmationAction === 'logout') {
      // In a real app, this would dispatch a logout action
      console.log('Logging out...');
    } else if (confirmationAction === 'cancel') {
      // Reset form data and exit editing mode
      setFormData(profile || {});
      setIsEditing(false);
    }
    
    setShowConfirmation(false);
  };

  // Cancel confirmation
  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Animate confirmation dialog
  useEffect(() => {
    if (showConfirmation && confirmationRef.current) {
      gsap.fromTo(
        confirmationRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [showConfirmation]);

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Account Settings</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Error loading profile. Please try again later.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Settings categories sidebar */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="profile-summary p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={profile?.avatar || 'https://via.placeholder.com/100'} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-1 shadow-md hover:bg-teal-600 transition-colors duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{profile?.name}</h3>
                      <p className="text-gray-600">{profile?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <button 
                    className={`settings-category w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors duration-300 ${activeSection === 'profile' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSection('profile')}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </div>
                  </button>
                  
                  <button 
                    className={`settings-category w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors duration-300 ${activeSection === 'preferences' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSection('preferences')}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Dietary Preferences
                    </div>
                  </button>
                  
                  <button 
                    className={`settings-category w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors duration-300 ${activeSection === 'security' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSection('security')}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Security
                    </div>
                  </button>
                  
                  <button 
                    className="settings-category w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-300"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Settings content */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {activeSection === 'profile' && 'Personal Information'}
                    {activeSection === 'preferences' && 'Dietary Preferences'}
                    {activeSection === 'security' && 'Security Settings'}
                  </h2>
                  {activeSection === 'profile' && (
                    <button 
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isEditing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
                      onClick={toggleEditing}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  {activeSection === 'profile' && (
                    <form ref={formRef} onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`form-field w-full px-4 py-2 border rounded-lg ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`form-field w-full px-4 py-2 border rounded-lg ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`form-field w-full px-4 py-2 border rounded-lg ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <textarea
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows={3}
                            className={`form-field w-full px-4 py-2 border rounded-lg ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'}`}
                          />
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex justify-end">
                          <button 
                            type="submit" 
                            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </>
                            ) : 'Save Changes'}
                          </button>
                          <div className="success-indicator fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg opacity-0">
                            Changes saved successfully!
                          </div>
                        </div>
                      )}
                    </form>
                  )}
                  
                  {activeSection === 'preferences' && (
                    <div>
                      <p className="text-gray-600 mb-6">Manage your dietary preferences and allergies.</p>
                      {/* Preferences content would go here */}
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p>Dietary preferences feature coming soon!</p>
                      </div>
                    </div>
                  )}
                  
                  {activeSection === 'security' && (
                    <div>
                      <p className="text-gray-600 mb-6">Manage your account security settings.</p>
                      {/* Security content would go here */}
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p>Security settings feature coming soon!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Confirmation dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              ref={confirmationRef}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">
                {confirmationAction === 'logout' ? 'Confirm Logout' : 'Discard Changes'}
              </h3>
              <p className="text-gray-600 mb-6">
                {confirmationAction === 'logout' 
                  ? 'Are you sure you want to log out of your account?' 
                  : 'You have unsaved changes. Are you sure you want to discard them?'}
              </p>
              <div className="flex justify-end space-x-4">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  onClick={cancelConfirmation}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg text-white transition-colors duration-300 ${confirmationAction === 'logout' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                  onClick={confirmAction}
                >
                  {confirmationAction === 'logout' ? 'Logout' : 'Discard'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}