import React from 'react';
import { motion } from 'framer-motion';

const SustainableLiving = () => {
  const tips = [
    {
      id: 1,
      title: "Reduce Energy Consumption",
      image: "https://plus.unsplash.com/premium_photo-1715573563293-97a67846198a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Switch to energy-efficient appliances and LED lighting. Unplug devices when not in use to save energy.",
    },
    {
      id: 2,
      title: "Install Solar Panels",
      image: "https://plus.unsplash.com/premium_photo-1715573563293-97a67846198a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Utilize renewable energy by installing solar panels, reducing your dependence on non-renewable resources.",
    },
    {
      id: 3,
      title: "Use Eco-Friendly Materials",
      image: "https://plus.unsplash.com/premium_vector-1737362125333-f9b6abcbe7a7?q=80&w=1862&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Opt for sustainable building materials such as bamboo, reclaimed wood, or recycled steel for home renovations.",
    },
    {
      id: 4,
      title: "Compost and Recycle",
      image: "https://plus.unsplash.com/premium_vector-1718966135605-f18c056c5de8?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Start composting food scraps and garden waste. Properly sort and recycle materials to reduce landfill waste.",
    },
    {
      id: 5,
      title: "Harvest Rainwater",
      image: "https://plus.unsplash.com/premium_vector-1711877749578-3d780d9f11ac?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Install a rainwater harvesting system to collect and store water for irrigation and other uses.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sustainable Living</h1>
          <p className="text-xl text-gray-600">
            Transform your home into an eco-friendly haven with these sustainable living tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip) => (
            <motion.div
              key={tip.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={tip.image}
                alt={tip.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{tip.title}</h2>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SustainableLiving;
