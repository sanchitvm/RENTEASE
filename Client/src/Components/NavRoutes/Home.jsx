import React, { useEffect } from 'react'
import RentEase from '../Cards/RentEase';
import { IoSearch } from "react-icons/io5";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const userType = localStorage.getItem('userType');

  const handleSearch = () => {
    if (userType === 'landlord') {
      navigate('/add-property');
    } else {
      navigate('/api/properties/search-rent');
    }
  };

  return (
    <div className='w-full overflow-x-hidden bg-white'>
      {/* Hero Section */}
      <div className='relative w-full h-screen flex flex-col items-center justify-center overflow-hidden'>
        {/* Background Image Container */}
        <div className='absolute inset-0 z-0'>
          <img
            className='w-full h-full object-cover transition-transform duration-10000 scale-105 group-hover:scale-110'
            src="https://images.unsplash.com/photo-1651336259530-362bce65fffe?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero Background"
          />
        </div>

        {/* 
          Aesthetic Overlay Stack:
          1. Darken top for navbar contrast
          2. Maintain clarity in the middle for the photo
          3. Long, smooth fade to white at the bottom for section transition
        */}
        <div className='absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/10 to-white backdrop-blur-[1px]'></div>

        <div className='container mx-auto px-4 z-20'>
          <h1 className='text-4xl md:text-6xl font-extrabold text-white text-center drop-shadow-2xl' data-aos="fade-up">
            {userType === 'landlord' ? "Market Your Property with RentEase" : "Find Your Perfect Room, Anytime, Anywhere"}
          </h1>
          <h4 className='text-center text-xl md:text-3xl text-zinc-100 mt-6 md:mt-12 font-medium drop-shadow-lg' data-aos="fade-up" data-aos-delay="200">
            {userType === 'landlord'
              ? "Reach verified tenants, manage listings, and secure lease terms effortlessly."
              : "Explore verified listings, secure payments, and flexible lease terms at your fingertips."}
          </h4>
          <h5 className='text-center text-lg md:text-xl mt-8 md:mt-12 text-zinc-200 opacity-90' data-aos="fade-up" data-aos-delay="400">
            {userType === 'landlord' ? "Start managing your properties today" : "Search, filter, and rent verified rooms with flexible terms"}
          </h5>

          <div className='flex justify-center items-center w-full mt-10 md:mt-16' data-aos="fade-up" data-aos-delay="600">
            <button
              onClick={handleSearch}
              className='relative group bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white rounded-2xl p-5 w-full md:w-auto flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_rgba(79,70,229,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden border border-white/20'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
              <span className='text-2xl md:text-3xl font-bold px-12 z-10'>{userType === 'landlord' ? "Add Your Property" : "Let's Start Now..."} </span>
              <IoSearch className='text-3xl ml-2 z-10' />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='relative z-20 bg-white -mt-1'>
        <RentEase />
      </div>
    </div>
  )
}

export default Home