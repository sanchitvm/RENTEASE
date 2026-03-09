import React from 'react';
import { motion } from 'framer-motion';

const MarketTrends = () => {
  const trends = [
    {
      id: 1,
      title: "Rise in Suburban Living",
      description: "As remote work becomes more common, many buyers are looking for homes in suburban areas, which offer more space and affordability compared to urban centers.",
      image: "https://plus.unsplash.com/premium_photo-1730140099691-9a2ce558c68a?q=80&w=1773&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Increased Demand for Sustainable Homes",
      description: "Eco-friendly and energy-efficient homes are in demand as buyers become more environmentally conscious.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Tech-Driven Homebuying",
      description: "Virtual tours, online listings, and AI tools are revolutionizing how people buy and sell homes.",
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "Low Inventory, High Prices",
      description: "The supply of homes remains limited in many areas, driving up prices and creating a competitive market for buyers.",
      image: "https://images.unsplash.com/photo-1634757439914-23b8acb9d411?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Current Real Estate Market Trends</h1>
          <p className="text-xl text-gray-600">Stay informed with the latest insights into the ever-changing real estate market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {trends.map((trend) => (
            <motion.div
              key={trend.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={trend.image}
                alt={trend.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{trend.title}</h2>
                <p className="text-gray-600 mb-4">{trend.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;