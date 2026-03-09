import React, { useState, useEffect } from 'react';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import { IoMdStarOutline } from "react-icons/io";
import Faq from '../FAQ/Faq';
import axios from 'axios';
import { API_URLS } from '../../config';

const Rating = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(API_URLS.REVIEWS);
      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback or empty state
        setTestimonials([
          {
            name: "Welcome",
            rating: 5,
            review: "Be the first to provide a review!",
            image: '/Images/default-avatar.png'
          }
        ]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const name = isLoggedIn ? localStorage.getItem('userName') : guestName;
      const userEmail = isLoggedIn ? localStorage.getItem('userEmail') : "Guest";
      const image = localStorage.getItem('profilePhoto'); // Sync profile photo

      await axios.post(API_URLS.REVIEWS, {
        name,
        rating,
        review,
        userEmail,
        image: image || null
      });

      alert("Review submitted successfully!");
      setReview('');
      setGuestName('');
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URLS.REVIEWS}/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Review deleted successfully!");
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      alert(err.response?.data?.msg || "Failed to delete review.");
    }
  };

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < rating ? <MdOutlineStar className='text-xl md:text-2xl' /> : <IoMdStarOutline className='text-xl md:text-2xl' />}
          </span>
        ))}
      </div>
    );
  };

  const { name, image, rating: currentRating, review: currentReview } = testimonials[currentIndex] || {};

  if (loading) return <div className="text-center py-20">Loading Reviews...</div>;

  return (
    <div className="px-4 md:px-0">
      <h1 className='text-3xl md:text-6xl text-center font-semibold mt-8 md:mt-16'>What Renters Are Saying</h1>
      <div className="rating-section text-center py-6 md:py-10">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="testimonial-card flex flex-col items-center w-full md:w-4/5 h-[400px] md:h-96 p-4 md:p-6 shadow-lg transition-transform duration-1000 ease-in-out transform">
            <img
              src={image || '/Images/default-avatar.png'}
              alt={name}
              className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover mb-4"
            />

            <h2 className="text-2xl md:text-3xl font-bold">{name}</h2>

            <div className="text-yellow-500 mb-2 md:mb-4">{renderStars(currentRating)}</div>

            <p className="text-gray-700 italic text-base md:text-xl flex-grow">&ldquo;{currentReview}&rdquo;</p>

            {isLoggedIn && localStorage.getItem('userEmail') === testimonials[currentIndex]?.userEmail && (
              <button
                onClick={() => handleDeleteReview(testimonials[currentIndex]._id)}
                className="mt-4 text-red-500 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-4 md:mt-0">
          <button onClick={handlePrev} className="p-2 bg-red-500 rounded-full">
            <FaLongArrowAltLeft className='text-2xl md:text-3xl' />
          </button>
          <button onClick={handleNext} className="p-2 bg-red-500 rounded-full">
            <FaLongArrowAltRight className='text-2xl md:text-3xl' />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center">Leave a Review</h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          {!isLoggedIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              className="w-full p-2 border rounded-md h-32"
              placeholder="Share your experience..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Post Review
          </button>
        </form>
      </div>

      <Faq />
    </div>
  );
};

export default Rating;
