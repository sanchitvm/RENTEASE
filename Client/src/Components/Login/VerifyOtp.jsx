import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../../config';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all digits');
      return;
    }

    try {
      const response = await axios.post(API_URLS.VERIFY_OTP, {
        email,
        otp: otpString
      });

      setSuccessMessage(response.data.msg);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Invalid OTP');
      } else {
        setError('Unable to connect to the server');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(API_URLS.RESEND_OTP, {
        email
      });
      setSuccessMessage(response.data.msg);
      setOtp(['', '', '', '', '', '']); // Reset OTP input fields
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Failed to resend OTP');
      } else {
        setError('Unable to connect to the server');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the 6-digit code sent to your email
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 md:space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm md:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify OTP
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-sm md:text-base"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
