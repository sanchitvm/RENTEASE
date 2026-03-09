import { useState } from 'react';
import { API_URLS } from '../../config';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URLS.CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name,
          lastName: '(Footer Form)',
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          subject: 'Contact Submission from Footer'
        }),
      });

      if (response.ok) {
        alert('Message submitted successfully!');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        const data = await response.json();
        alert(data.msg || 'Failed to submit message.');
      }
    } catch (error) {
      console.error('Error submitting footer contact form:', error);
      alert('Error sending message. Please try again.');
    }
  };

  return (
    <footer className="bg-white py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:justify-between">

          <div className="mb-8 lg:mb-0 w-full lg:w-1/3">
            <img src='/Images/Rent-Ease-color-logo-2.png' alt="RentBro Logo" className="w-32 sm:w-44 rounded-full" />

            <address className="not-italic text-base sm:text-lg font-semibold text-gray-700 mt-4">
              25 Hanuman Nagar,<br />
              Sai Infotech Building, <br />
              Mumbai - 400086,<br />
              India
            </address>
            <p className="mt-2 text-gray-700 text-base sm:text-lg font-semibold">unnamee137gmail.com</p>
            <div className="flex space-x-4 mt-4">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between space-y-6 sm:space-y-0 sm:space-x-8 mb-8 lg:mb-0 w-full lg:w-1/3">
            <div className="w-full sm:w-1/2">
              <h3 className="text-lg font-semibold mb-2">Company</h3>
              <ul className="text-gray-700 space-y-2">
                <li><a href="/">Home</a></li>
                <li><a href="#">Why choose us</a></li>
                <li><a href="/contact-us">Contact us</a></li>
                <li><a href="#">How it works</a></li>
              </ul>
            </div>

            <div className="w-full sm:w-1/2">
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="text-gray-700 space-y-2">
                <li><a href="#">Term of use</a></li>
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">Sitemap</a></li>
                <li><a href="#">FAQ&apos;s</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-600 text-white px-6 py-2 rounded w-full sm:w-auto hover:bg-slate-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
