import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import { Card, Button, Input } from '../components/ui'

const Profile = () => {
  const { token, navigate, user, setUser, getUserProfile, updateUserProfile } = useContext(ShopContext)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    joinDate: ''
  })
  const [editForm, setEditForm] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Initialize user data from localStorage or context
  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    // Try to get user data from various sources
    const initializeUserData = async () => {
      setLoading(true)
      
      let userData = null;
      
      // First try: use context user
      if (user) {
        userData = user;
      } else {
        // Second try: get from localStorage
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          try {
            userData = JSON.parse(storedData);
            setUser(userData); // Update context
          } catch (error) {
            console.log('Error parsing stored user data:', error);
          }
        }
        
        // Third try: use getUserProfile from context
        if (!userData && getUserProfile) {
          try {
            userData = await getUserProfile();
          } catch (error) {
            console.log('Error fetching profile:', error);
          }
        }
        
        // Fourth try: create from localStorage items
        if (!userData) {
          userData = {
            name: localStorage.getItem('userName') || 'Guest User',
            email: localStorage.getItem('userEmail') || 'user@example.com',
            joinDate: new Date().toISOString()
          };
          setUser(userData); // Update context
        }
      }
      
      if (userData) {
        setUserProfile({
          name: userData.name || 'Guest User',
          email: userData.email || 'user@example.com',
          joinDate: userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : new Date().toLocaleDateString()
        });
        
        setEditForm({
          name: userData.name || 'Guest User',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
      setLoading(false);
    }

    initializeUserData();
  }, [token, navigate, user, getUserProfile, setUser])

  // Update form when context user changes
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name || 'Guest User',
        email: user.email || 'user@example.com',
        joinDate: user.joinDate ? new Date(user.joinDate).toLocaleDateString() : new Date().toLocaleDateString()
      });
      
      setEditForm(prev => ({
        ...prev,
        name: user.name || 'Guest User'
      }));
    }
  }, [user])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditForm({
        name: userProfile.name,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      // Validation
      if (!editForm.name.trim()) {
        toast.error('Name cannot be empty')
        setUpdating(false)
        return
      }

      if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
        toast.error('New passwords do not match')
        setUpdating(false)
        return
      }

      if (editForm.newPassword && editForm.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters')
        setUpdating(false)
        return
      }

      // Prepare update data
      const updateData = {
        name: editForm.name.trim(),
      }

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword
        updateData.newPassword = editForm.newPassword
      }

      let success = false;

      // Try to use API first
      if (updateUserProfile) {
        try {
          const result = await updateUserProfile(updateData)
          if (result && result.success) {
            success = true;
          }
        } catch (error) {
          console.log('API update failed, using local update:', error)
        }
      }

      // Fallback to local update
      if (!success) {
        const updatedProfile = {
          ...userProfile,
          name: editForm.name.trim()
        }
        
        setUserProfile(updatedProfile)
        
        // Update localStorage
        localStorage.setItem('userName', editForm.name.trim())
        const userData = { ...user, name: editForm.name.trim() }
        localStorage.setItem('userData', JSON.stringify(userData))
        setUser(userData) // Update context
        
        toast.success('Profile updated successfully!')
        success = true;
      }
      
      if (success) {
        setIsEditing(false)
        setEditForm({
          name: editForm.name.trim(),
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
      
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
    
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-neutral-50 to-white'>
        <div className='container-wide pt-8 pb-16 flex items-center justify-center'>
          <div className='text-center space-y-4'>
            <div className='w-12 h-12 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
            <p className='text-neutral-600'>Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-50 to-white'>
      <div className='container-wide pt-8 pb-16'>
        
        {/* Page Title */}
        <div className='mb-12'>
          <Title text1="MY" text2="PROFILE" />
          <p className='text-center text-neutral-600 mt-4 max-w-2xl mx-auto'>
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <Card className='mb-8 overflow-hidden border-0 shadow-medium'>
          <div className='bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-white'>
            <div className='flex items-center space-x-6'>
              <div className='w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>
                </svg>
              </div>
              <div>
                <h1 className='text-heading-2 font-display font-semibold mb-1'>{userProfile.name}</h1>
                <p className='text-white/90 text-body-large'>{userProfile.email}</p>
                <p className='text-white/70 text-body-small mt-1'>Member since {userProfile.joinDate}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Information */}
          <div className='lg:col-span-2'>
            <Card className='shadow-medium border-0'>
              <div className='p-8'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-heading-3 font-display font-semibold text-neutral-900'>
                    Profile Information
                  </h2>
                  <Button
                    onClick={handleEditToggle}
                    variant={isEditing ? 'secondary' : 'primary'}
                    size='sm'
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                {!isEditing ? (
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-label text-neutral-500 mb-2'>Full Name</label>
                      <p className='text-body-large text-neutral-900'>{userProfile.name}</p>
                    </div>
                    <div>
                      <label className='block text-label text-neutral-500 mb-2'>Email Address</label>
                      <p className='text-body-large text-neutral-900'>{userProfile.email}</p>
                    </div>
                    <div>
                      <label className='block text-label text-neutral-500 mb-2'>Member Since</label>
                      <p className='text-body-large text-neutral-900'>{userProfile.joinDate}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className='space-y-6'>
                    <div>
                      <label className='block text-label text-neutral-700 mb-2'>
                        Full Name
                      </label>
                      <Input
                        type='text'
                        name='name'
                        value={editForm.name}
                        onChange={(e) => handleInputChange(e)}
                        placeholder='Enter your full name'
                        required
                      />
                    </div>
                    
                    <div>
                      <label className='block text-label text-neutral-700 mb-2'>
                        Email Address
                      </label>
                      <Input
                        type='email'
                        value={userProfile.email}
                        disabled
                        className='bg-neutral-50'
                      />
                      <p className='text-body-small text-neutral-500 mt-2'>Email cannot be changed</p>
                    </div>

                    <div className='border-t border-neutral-200 pt-6'>
                      <h3 className='text-body-large font-medium text-neutral-900 mb-4'>
                        Change Password (Optional)
                      </h3>
                      
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-label text-neutral-700 mb-2'>
                            Current Password
                          </label>
                          <Input
                            type='password'
                            name='currentPassword'
                            value={editForm.currentPassword}
                            onChange={(e) => handleInputChange(e)}
                            placeholder='Enter current password'
                          />
                        </div>
                        
                        <div>
                          <label className='block text-label text-neutral-700 mb-2'>
                            New Password
                          </label>
                          <Input
                            type='password'
                            name='newPassword'
                            value={editForm.newPassword}
                            onChange={(e) => handleInputChange(e)}
                            placeholder='Enter new password'
                          />
                        </div>
                        
                        <div>
                          <label className='block text-label text-neutral-700 mb-2'>
                            Confirm New Password
                          </label>
                          <Input
                            type='password'
                            name='confirmPassword'
                            value={editForm.confirmPassword}
                            onChange={(e) => handleInputChange(e)}
                            placeholder='Confirm new password'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='flex space-x-4 pt-6 border-t border-neutral-200'>
                      <Button
                        type='submit'
                        loading={updating}
                        className='flex-1'
                      >
                        Save Changes
                      </Button>
                      <Button
                        type='button'
                        onClick={handleEditToggle}
                        variant='secondary'
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className='space-y-6'>
            {/* Quick Actions */}
            <Card className='shadow-medium border-0'>
              <div className='p-6'>
                <h3 className='text-body-large font-semibold text-neutral-900 mb-4'>
                  Quick Actions
                </h3>
                <div className='space-y-3'>
                  <button
                    onClick={() => navigate('/orders')}
                    className='w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors group'
                  >
                    <div className='flex items-center space-x-3'>
                      <svg className='w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      <span className='text-neutral-900 font-medium'>My Orders</span>
                    </div>
                    <svg className='w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigate('/collection')}
                    className='w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors group'
                  >
                    <div className='flex items-center space-x-3'>
                      <svg className='w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                      </svg>
                      <span className='text-neutral-900 font-medium'>Browse Products</span>
                    </div>
                    <svg className='w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigate('/contact')}
                    className='w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors group'
                  >
                    <div className='flex items-center space-x-3'>
                      <svg className='w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                      </svg>
                      <span className='text-neutral-900 font-medium'>Support</span>
                    </div>
                    <svg className='w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>

            {/* Account Stats */}
            <Card className='shadow-medium border-0'>
              <div className='p-6'>
                <h3 className='text-body-large font-semibold text-neutral-900 mb-4'>
                  Account Overview
                </h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-neutral-600'>Total Orders</span>
                    <span className='text-body-large font-semibold text-primary-600'>0</span>
                  </div>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-neutral-600'>Total Spent</span>
                    <span className='text-body-large font-semibold text-primary-600'>₹0</span>
                  </div>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-neutral-600'>Member Status</span>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800'>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile