import React from "react";
import { motion } from "framer-motion";

const InvestmentProperty = () => {
  const trends = [
    {
      title: "Why Invest in Real Estate?",
      description:
        "Real estate investment offers steady cash flow, long-term appreciation, and tax benefits. It's a tangible asset with potential for significant returns.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
    },
    {
      title: "Types of Investment Properties",
      description:
        "From residential properties to commercial spaces and vacation rentals, explore diverse investment opportunities to suit your goals.",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3",
    },
    {
      title: "Location is Key",
      description:
        "Choosing the right location is critical. Proximity to schools, transport, and amenities can significantly impact your investment's value.",
      image:
        "https://images.unsplash.com/photo-1549549649-910ebed6890d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Rental Income Potential",
      description:
        "Evaluate rental demand and average rental income in the area to ensure consistent cash flow from your investment property.",
      image:
        "https://plus.unsplash.com/premium_photo-1716603741742-db515ca0a8e6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Financing Options",
      description:
        "Explore financing options such as mortgages, partnerships, or leveraging existing assets to fund your property investment.",
      image:
        "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investment Property Guide
          </h1>
          <p className="text-xl text-gray-600">
            Unlock the potential of real estate investment with our expert tips.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trends.map((trend, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={trend.image}
                alt={trend.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  {trend.title}
                </h2>
                <p className="text-gray-600 mb-4">{trend.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-green-100 p-8 rounded-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Getting Started with Investment Properties
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Investing in real estate can be highly rewarding, but it requires
            careful planning. Start by determining your budget, researching
            locations, and understanding the market dynamics. Consider working
            with a real estate professional to navigate the process and make
            informed decisions.
          </p>
          <p className="text-lg text-gray-700">
            Remember, patience is key in property investment. With the right
            strategy and a bit of perseverance, you can build a strong portfolio
            that secures your financial future.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestmentProperty;
