import React, { useEffect } from 'react'
import RentCards from './RentCards'
import AOS from 'aos';
import 'aos/dist/aos.css';

const RentEase = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className='text-black mt-4 text-center text-3xl md:text-5xl font-semibold' data-aos="fade-up">Why Rent with Rent Ease?</h1>
      <div className="mt-8 md:mt-12" data-aos="fade-up">
        <RentCards />
      </div>
    </div>
  )
}

export default RentEase