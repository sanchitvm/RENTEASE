import React from 'react';
import { motion } from 'framer-motion';

const HomeDecoration = () => {
  const tips = [
    {
      title: "Freshen Up with Colors",
      image: "https://images.unsplash.com/photo-1535828363065-62fc1406ad63?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Use pastel or neutral colors to create a calm and inviting atmosphere in your home. Try painting an accent wall or incorporating colorful cushions and throws."
    },
    {
      title: "Bring Nature Indoors",
      image: "https://images.unsplash.com/photo-1460533893735-45cea2212645?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Plants and flowers can add a touch of freshness and beauty to any room. Consider low-maintenance plants like succulents or pothos to brighten your space."
    },
    {
      title: "Lighting Matters",
      image: "https://images.unsplash.com/photo-1541701768-a3d67ec0bc0a?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Upgrade your lighting with stylish fixtures or warm-toned LED bulbs. Layer lighting with floor lamps and candles for a cozy ambiance."
    },
    {
      title: "Maximize Small Spaces",
      image: "https://images.unsplash.com/photo-1488901512066-cd403111aeb2?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Use multifunctional furniture like ottomans with storage or foldable tables. Mirrors can make a small room look larger and more open."
    },
    {
      title: "Personalize Your Space",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Display family photos, souvenirs, or artwork that tells your story. A personalized touch makes your house truly feel like home."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 sm:px-8 mt-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Home Decoration Tips</h1>
          <p className="text-lg text-gray-600">Transform your home into a cozy and stylish haven with these decoration ideas.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src={tip.image} alt={tip.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{tip.title}</h2>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Revamp Your Home?</h2>
          <p className="text-lg text-gray-600 mb-6">Start small or go big – every change makes a difference.</p>
          <a
            href="https://en.wikipedia.org/wiki/Home_accessories"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Explore More Ideas
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeDecoration;
