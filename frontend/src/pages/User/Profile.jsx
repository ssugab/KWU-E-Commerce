import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaArrowLeft, FaEdit, FaLock, FaSignOutAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout, changePassword, loading } = useAuth();
  const { navigate } = useContext(ShopContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    npm: '',
    email: '',
    phone: ''
  });

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        npm: user.npm || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && user) {
      setFormData({
        name: user.name || '',
        npm: user.npm || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveProfile = () => {
    // TODO: Implement save profile functionality
    toast.success('Profil berhasil diperbarui!');
    setIsEditMode(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout berhasil!');
    navigate('/');
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long!');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from the old password!');
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      toast.success('Password changed successfully!');
      setShowChangePasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.message || error || 'Error occurred while changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No user data found</p>
          <Button 
            text="Go to Login" 
            onClick={() => navigate('/login')}
            className="bg-accent text-matteblack"
          />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      {/* Header & Breadcrumb */}
      <div className='bg-offwhite2 border-b-3 mb-9'>
        <div className='container mx-auto px-4 py-4'>
          {/* Mobile Breadcrumb */}
          <div className='flex items-center gap-2 mb-4 md:hidden'>
            <Link to='/' className='flex items-center gap-2 text-accent hover:underline text-sm transition-colors'>
              <FaArrowLeft className="w-3 h-3" />
              <span>Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">Profile</span>
          </div>

          <h1 className='text-2xl md:text-3xl font-atemica text-matteblack mb-3 mt-5'>My Profile</h1>
        </div>
      </div>

      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

          {/* Profile Details */}
          <div className='lg:col-span-2 space-y-6'>
            
            {/* Personal Information Card */}
            <div className='bg-white border-3 border-matteblack rounded-lg p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-300'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='font-bricolage text-xl font-bold'>Personal Information</h3>
                {!isEditMode && (
                  <button 
                    onClick={handleEditToggle}
                    className='text-accent hover:text-amber-600 p-2 border-2 hover:bg-matteblack transition-colors'
                  >
                    <FaEdit className='w-4 h-4' />
                  </button>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Name Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FaUser className='inline w-4 h-4 mr-2' />
                    Full Name
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors'
                    />
                  ) : (
                    <p className='py-2 px-3 bg-gray-50 border-2 border-gray-200 rounded-lg'>{user.name}</p>
                  )}
                </div>

                {/* NPM Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FaIdCard className='inline w-4 h-4 mr-2' />
                    NPM
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="npm"
                      value={formData.npm}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors'
                    />
                  ) : (
                    <p className='py-2 px-3 bg-gray-50 border-2 border-gray-200 rounded-lg'>{user.npm}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FaEnvelope className='inline w-4 h-4 mr-2' />
                    Email Address
                  </label>
                  {isEditMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors'
                    />
                  ) : (
                    <p className='py-2 px-3 bg-gray-50 border-2 border-gray-200 rounded-lg'>{user.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FaPhone className='inline w-4 h-4 mr-2' />
                    Phone Number
                  </label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors'
                    />
                  ) : (
                    <p className='py-2 px-3 bg-gray-50 border-2 border-gray-200 rounded-lg'>{user.phone}</p>
                  )}
                </div>
              </div>

              {/* Edit Mode Actions */}
              {isEditMode && (
                <div className='flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t-2 border-gray-200'>
                  <Button 
                    text="Save Changes" 
                    className="flex-1 bg-green-500 hover:bg-green-600 border-green-600 text-white"
                    onClick={handleSaveProfile}
                  />
                  <Button 
                    text="Cancel" 
                    className="flex-1 bg-gray-500 hover:bg-gray-600 border-gray-600 text-white"
                    onClick={handleEditToggle}
                  />
                </div>
              )}
            </div>

            {/* Account Settings Card */}
            <div className='bg-white border-3 border-matteblack rounded-lg p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-300'>
              <h3 className='font-bricolage text-xl font-bold mb-6'>Account Settings</h3>
              
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-blue-100 rounded-full'>
                      <FaLock className='w-4 h-4 text-blue-600' />
                    </div>
                    
                    <div>
                      <p className='font-medium text-gray-800'>Password</p>
                    </div>
                  </div>
                  <Button 
                    text="Change Password"
                    onClick={() => setShowChangePasswordModal(true)}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 py-2"
                  />
                </div>
                <div className='flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:border-red-300 transition-colors'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-red-100 rounded-full'>
                      <FaSignOutAlt className='w-4 h-4 text-red-600' />
                    </div>
                    <div>
                      <h4 className='font-medium text-red-700'>Logout</h4>
                      <p className='text-sm text-red-600'>Sign out from your account</p>
                    </div>
                  </div>
                  <Button 
                    text="Logout" 
                    className="bg-red-500 hover:bg-red-600 border-red-600 text-white text-sm py-1 px-4"
                    onClick={() => setShowLogoutModal(true)}
                  />
                </div>
              </div>
            </div>

            {/* Account Actions Card */}
            <div className='bg-white border-3 border-matteblack rounded-lg p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-300'>
              <h3 className='font-bricolage text-xl font-bold mb-6'>Account Actions</h3>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Link 
                  to="/orders" 
                  className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-accent hover:bg-accent/10 transition-all group'
                >
                  <div className='p-2 bg-accent rounded-full group-hover:scale-110 transition-transform'>
                    <FaIdCard className='w-4 h-4 text-matteblack' />
                  </div>
                  <div>
                    <h4 className='font-medium'>My Orders</h4>
                    <p className='text-sm text-gray-600'>View order history</p>
                  </div>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-3 border-matteblack rounded-lg p-6 w-full max-w-md">
            <h3 className="font-bricolage text-xl font-bold mb-4">Change Password</h3>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-3 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPasswords.current ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-3 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPasswords.new ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-3 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPasswords.confirm ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                text={isChangingPassword ? "Changing..." : "Change Password"}
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="bg-blue-600 text-white hover:bg-blue-700 flex-1"
              />
              <Button
                text="Cancel"
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="bg-gray-500 text-white hover:bg-gray-600 flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-3 border-matteblack rounded-lg p-6 w-full max-w-sm">
            <h3 className="font-bricolage text-xl font-bold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            
            <div className="flex gap-3">
              <Button
                text="Yes, Logout"
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 flex-1"
              />
              <Button
                text="Cancel"
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-500 text-white hover:bg-gray-600 flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile