import React from "react";
import { motion } from "framer-motion";

const FirstTimeHomeBuyers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            alt="Home buying"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold text-white text-center px-4"
            >
              Tips for First-Time Home Buyers
            </motion.h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-gray-700 text-lg leading-8 mb-6">
              Buying your first home can be an exciting yet daunting experience. It's a significant milestone that requires careful planning and informed decisions. To make this journey smoother, here are some essential tips for first-time home buyers.
            </p>

            {/* Tips Section */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Determine Your Budget</h2>
            <p className="text-gray-700 mb-6">
              Start by evaluating your financial situation. Understand how much you can afford by considering your income, savings, and monthly expenses. Use mortgage calculators to estimate your payments and avoid overstretching your budget.
            </p>
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              alt="Budget Planning"
              className="w-full h-56 object-cover rounded-lg mb-6"
            />

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Research the Market</h2>
            <p className="text-gray-700 mb-6">
              Familiarize yourself with the real estate market in your preferred area. Research property prices, neighborhood amenities, and future growth prospects to make an informed decision.
            </p>
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              alt="Real Estate Market"
              className="w-full h-56 object-cover rounded-lg mb-6"
            />

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Get Pre-Approved for a Loan</h2>
            <p className="text-gray-700 mb-6">
              A pre-approval letter from a lender shows sellers that you're a serious buyer. It also helps you understand how much financing you qualify for, simplifying the home-buying process.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Work with a Real Estate Agent</h2>
            <p className="text-gray-700 mb-6">
              A trusted real estate agent can guide you through the home-buying process. They have valuable market knowledge, negotiation skills, and access to listings that fit your criteria.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Inspect the Property</h2>
            <p className="text-gray-700 mb-6">
              Before finalizing the purchase, conduct a thorough inspection of the property. Identify potential issues and discuss repairs with the seller if necessary.
            </p>
          </motion.div>

          {/* Closing Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="bg-green-50 p-6 rounded-lg mt-8"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-700">
              Buying your first home is a significant achievement. By following these tips, you can make the process smoother and more enjoyable. Remember to stay patient and informed throughout the journey. Good luck!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeHomeBuyers;
