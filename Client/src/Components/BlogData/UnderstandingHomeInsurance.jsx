import React from "react";
import { motion } from "framer-motion";

const UnderstandingHomeInsurance = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 mt-10" // Added margin top
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Understanding Home Insurance
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive guide to protecting your most valuable asset.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <img
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGhvbWV8ZW58MHx8fHwxNjgzMzI4MTMz&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Home Insurance"
            className="w-full rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800">
            Why is Home Insurance Important?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Home insurance provides financial protection against unforeseen events
            such as natural disasters, theft, or accidents. It ensures that your
            home and belongings are covered, giving you peace of mind in times of
            crisis. Whether you own or rent, having insurance is a critical step
            in safeguarding your future.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Types of Home Insurance Coverage
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Dwelling Coverage:</strong> Protects the structure of your
              home, including walls, roof, and built-in appliances.
            </li>
            <li>
              <strong>Personal Property Coverage:</strong> Covers your belongings
              such as furniture, electronics, and clothing.
            </li>
            <li>
              <strong>Liability Protection:</strong> Provides coverage if someone
              is injured on your property and you are held responsible.
            </li>
            <li>
              <strong>Additional Living Expenses (ALE):</strong> Covers costs if
              you need to live elsewhere while your home is being repaired.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800">
            Tips for Choosing the Right Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Selecting the right home insurance policy can be overwhelming. Here
            are some tips to help you make an informed decision:
          </p>
          <ol className="list-decimal pl-5 text-gray-700 space-y-2">
            <li>
              Compare multiple insurance providers to find the best coverage and
              rates.
            </li>
            <li>
              Understand the terms and exclusions of the policy to avoid
              surprises.
            </li>
            <li>
              Consider bundling home and auto insurance for discounts.
            </li>
            <li>
              Review the deductible amount and choose one that fits your budget.
            </li>
            <li>
              Regularly update your policy to reflect major home improvements or
              purchases.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold text-gray-800">
            Common Misconceptions
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Many people believe that home insurance covers all damages, but
            policies often exclude certain events like floods or earthquakes. Be
            sure to add supplemental coverage if you live in high-risk areas.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Final Thoughts
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Home insurance is an investment in your peace of mind and financial
            security. By understanding your coverage options and choosing the
            right policy, you can protect your home and family from unexpected
            challenges. Start by researching providers and getting quotes to find
            the best fit for your needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderstandingHomeInsurance;
