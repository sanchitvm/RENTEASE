import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../config';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    userType: '', // No default value
    age: '',
    gender: '',
    maritalStatus: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  // Live validation for UI indicators
  const hasMinLength = (formData.password || '').length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password || '');
  const hasLowercase = /[a-z]/.test(formData.password || '');
  const hasNumber = /\d/.test(formData.password || '');

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType) {
      setFormData({ ...formData, userType });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userType) {
      setMessage('Please select a user type');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setShowValidationPopup(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(API_URLS.REGISTER, formData);
      setMessage(response.data.msg);
      localStorage.setItem('userType', formData.userType);
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: formData.email, userType: formData.userType } });
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          {/* User Type Selection */}
          <div className="mt-4 flex justify-center space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${formData.userType === 'hunter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              onClick={() => setFormData({ ...formData, userType: 'hunter' })}
            >
              Home Hunter
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${formData.userType === 'landlord' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              onClick={() => setFormData({ ...formData, userType: 'landlord' })}
            >
              Landlord
            </button>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 hover:text-blue-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <ul className="text-xs mt-1 list-disc ml-4 space-y-1">
              <li className={hasMinLength ? "text-green-600 font-medium" : "text-gray-500"}>
                At least 8 characters in length.
              </li>
              <li className={hasUppercase ? "text-green-600 font-medium" : "text-gray-500"}>
                At least one uppercase letter (A-Z).
              </li>
              <li className={hasLowercase ? "text-green-600 font-medium" : "text-gray-500"}>
                At least one lowercase letter (a-z).
              </li>
              <li className={hasNumber ? "text-green-600 font-medium" : "text-gray-500"}>
                At least one number (0-9).
              </li>
            </ul>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 hover:text-blue-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <div>
              <input
                type="text"
                name="contact"
                placeholder="Contact (10-digit mobile number)"
                value={formData.contact}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* New Personal Details Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Marital Status</option>
                <option value="Married">Married</option>
                <option value="Unmarried">Unmarried</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register as {formData.userType === 'hunter' ? 'Home Hunter' : 'Landlord'}
            </button>
          </div>
        </form>
        {message && (
          <div className="mt-4">
            <p className="text-center text-sm text-gray-600">{message}</p>
          </div>
        )}
      </div>

      {showValidationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[2000] animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Invalid Password</h3>
            <p className="text-gray-600 text-center mb-8">
              Your password does not satisfy the security requirements. Please check the following:
            </p>
            <ul className="text-sm text-gray-700 space-y-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                At least 8 characters long.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                At least one uppercase letter (A-Z).
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                At least one lowercase letter (a-z).
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                At least one number (0-9).
              </li>
            </ul>
            <button
              onClick={() => setShowValidationPopup(false)}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors duration-200 shadow-lg shadow-red-100"
            >
              Got it, I'll fix it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
