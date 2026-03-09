import { useState, useEffect } from 'react'
import Rating from "../Reviews/Rating"
import AOS from 'aos';
import 'aos/dist/aos.css';

const FeatureRoomList = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const [featureData] = useState([
    {
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Dombivli  West, Mumbai",
      description: "Fully furnished, Wifi, AC, close to public transport",
      price: "₹10000 month"
    },
    {
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Thane, Mumbai",
      description: "Pet-friendly, balcony, parking space, gated community",
      price: "₹15,000 month"
    },
    {
      image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Mulund, Mumbai",
      description: "Fully furnished, gym access, 24/7 security, Wifi, AC",
      price: "₹18,000 month"
    },
    {
      image: "https://images.unsplash.com/photo-1553444892-20174939d7bb?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Kalyan, Mumbai",
      description: "High Speed Wifi, modern kitchen, near cafes and nightlife",
      price: "₹20,000 month"
    },
    {
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Bandra, Mumbai",
      description: "24/7 security, fully furnished, gated community, Wifi, AC",
      price: "₹22,000 month"
    },
    {
      image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Juhu, Mumbai",
      description: "24-hour water supply, close to shopping district, Wifi, fully furnished, AC",
      price: "₹30,000 month"
    }
  ])

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
      <h1 className='text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 sm:mb-12 lg:mb-16' data-aos="fade-up">Featured Room Listings</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
        {featureData.map((item, index) => {
          return (
            <div key={index} className='rounded-md overflow-hidden shadow-lg' data-aos="fade-up" data-aos-delay={`${index * 100}`}>
              <div className='w-full h-48 sm:h-52'>
                <img className='w-full h-full object-cover' src={item.image} alt={item.title} />
              </div>
              <div className='p-4'>
                <h2 className='font-semibold text-xl sm:text-2xl'>{item.title}</h2>
                <p className='text-zinc-800 mb-2 text-sm sm:text-base'>{item.description}</p>
                <p className='font-semibold text-lg sm:text-xl'>Price: {item.price}</p>
              </div>
            </div>
          )
        })}
      </div>
      <Rating />
    </div>
  )
}

export default FeatureRoomList
