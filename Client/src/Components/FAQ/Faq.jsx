import { useState } from 'react';
import Footer from '../Footer/Footer';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "What lease terms does Rent Ease offer?",
    answer: "RentBro offers flexible lease terms, including both short-term and long-term options. You can choose the duration that best fits your needs during the booking process.",
  },
  {
    question: "Can I extend or shorten my lease after moving in?",
    answer: "Yes, depending on availability, you may be able to extend or shorten your lease. Contact our support team to learn more about your specific case.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit cards, debit cards, and online payment gateways for your convenience.",
  },
  {
    question: "Is there a security deposit required?",
    answer: "Yes, a security deposit is required for all rentals. The amount varies depending on the property and lease terms.",
  },
  {
    question: "Can I sublet the property?",
    answer: "Subletting is allowed for some properties but requires prior approval from the property owner.",
  },
  {
    question: "Are utilities included in the rent?",
    answer: "Some properties include utilities, while others do not. Please check the property listing for specific details.",
  },
  {
    question: "Can I terminate my lease early?",
    answer: "Early termination is possible, but it may be subject to penalties or fees based on the terms of your lease agreement.",
  },
  
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="faq-container w-full mx-auto p-4 sm:p-6 md:max-w-4xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 md:mb-16">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item border-b-2 py-3 sm:py-4">
            <div 
              className="faq-question flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold ${openIndex === index ? 'text-red-600' : 'text-black'}`}>
                {item.question}
              </h2>
              {openIndex === index ? <FaChevronUp className="text-red-600 text-lg sm:text-xl" /> : <FaChevronDown className="text-red-600 text-lg sm:text-xl" />}
            </div>
            {openIndex === index && (
              <div className="faq-answer mt-2 text-gray-600 text-base sm:text-lg md:text-xl">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
