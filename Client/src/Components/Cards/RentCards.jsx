import React, { useState } from 'react';
import RentWorks from '../RentWorks/RentWorks'
import { HiSearchCircle } from "react-icons/hi";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { IoLogoWechat } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";


const RentCards = () => {
  const [data] = useState([
    {symbol : <HiSearchCircle/>, description : "Search rooms based on location, price, amenities and more for a hassle-free experience"},
    {symbol : <BsChatLeftDotsFill /> , description : "Read reviews and ratings from previous renters to make informed decisions"},
    {symbol : <BiSupport /> , description : "Our team is available 24/7 to help with any queries or issues"},
    {symbol : <IoLogoWechat />, description : "Direct client-landowner chat for seamless communication."},
    {symbol : <FaCalendarDays />, description : "Choose from short-term or long-term rentals that suit your needs."},
    {symbol : <MdVerified />, description : "All rooms listing are verified to ensure authenticity and safety."}
  ]);

  return (
    <>
    <div className='w-full min-h-screen flex justify-center pt-2 md:pt-4'>
      <div className='flex justify-center gap-4 md:gap-6 flex-wrap w-full'>
        {data.map((item, index) => (
          <div key={index} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4'>
            <div className='h-full rounded-md bg-slate-400 p-6 shadow-xl flex flex-col justify-center'>
              <div className='text-5xl md:text-7xl flex justify-center pb-4 md:pb-5'>{item.symbol}</div>
              <p className='text-center text-base md:text-xl'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <RentWorks></RentWorks>
    </>
  );
}

export default RentCards;
