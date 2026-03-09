import React from 'react';
import { motion } from 'framer-motion';

const LocationImportance = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">The Importance of Location in Real Estate</h1>
          <p className="text-xl text-gray-600">
            Why location is a crucial factor in determining the value and desirability of a property.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div>
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3"
              alt="City view"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Location Matters</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The location of a property determines its accessibility, safety, convenience, and potential for future appreciation. 
              Proximity to schools, workplaces, public transportation, and amenities like parks or shopping centers makes a home more desirable.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Factors to Evaluate</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Neighborhood safety and security.</li>
              <li>Proximity to schools, healthcare, and public services.</li>
              <li>Transportation options and commute times.</li>
              <li>Local market trends and property value history.</li>
              <li>Future development plans in the area.</li>
            </ul>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Impact on Property Value</h2>
            <p className="text-gray-700 leading-relaxed">
              Location directly impacts the value of a home. Properties in prime locations often have higher resale values and greater demand, 
              making them a valuable investment. On the other hand, homes in less desirable areas may face challenges in appreciation.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Takeaway</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            When choosing a property, always prioritize location. A great home in a poor location can be a less favorable investment 
            than a modest home in an excellent area. Think long-term and evaluate how the location meets your needs and aspirations.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationImportance;
