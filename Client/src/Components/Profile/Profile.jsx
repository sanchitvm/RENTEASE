import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../../config';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    photo: '',
    age: '',
    gender: '',
    maritalStatus: '',
    mobile: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userType, setUserType] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(API_URLS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { name, age, gender, maritalStatus, contact } = response.data;
      const storedPhoto = localStorage.getItem('profilePhoto');
      const storedUserType = localStorage.getItem('userType');

      setProfileData({
        name: name || '',
        photo: storedPhoto || '',
        age: age || '',
        gender: gender || '',
        maritalStatus: maritalStatus || '',
        mobile: contact || ''
      });
      setUserType(storedUserType || response.data.userType);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          photo: reader.result
        }));
        localStorage.setItem('profilePhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_URLS.PROFILE_UPDATE, {
        name: profileData.name,
        age: profileData.age,
        gender: profileData.gender,
        maritalStatus: profileData.maritalStatus,
        contact: profileData.mobile
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('userName', profileData.name);
      setIsEditing(false);
      setShowSuccessModal(true);
      // Wait for user to see the modal before reloading or just close editing
    } catch (error) {
      console.error('Error updating profile:', error);
      const data = error.response?.data;
      const serverMsg = data?.msg || error.message;
      const detail = data?.error ? ` (${data.error})` : '';
      alert(`Failed to update profile: ${serverMsg}${detail}`);
    }
  };

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={profileData.photo || '/Images/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Age:</label>
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gender:</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Marital Status:</label>
            <select
              name="maritalStatus"
              value={profileData.maritalStatus}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Status</option>
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mobile Number:</label>
            <input
              type="tel"
              name="mobile"
              value={profileData.mobile}
              onChange={handleInputChange}
              pattern="[+]?[0-9]{10,13}"
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
        {userType === 'landlord' && (
          <button
            type="button"
            onClick={handleAddProperty}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Property
          </button>
        )}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[3000] animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Profile Updated!</h3>
            <p className="text-gray-600 text-center mb-8">
              Your profile information has been successfully saved.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-100"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
