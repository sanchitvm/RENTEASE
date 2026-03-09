import { useState } from 'react';
import { motion } from 'framer-motion';
import { API_URLS } from '../../config';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    subject: ''
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          subject: ''
        });
      } else {
        const data = await response.json();
        alert(data.msg || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 mt-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-green-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <motion.div
        className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Section */}
          <div className="w-full md:w-5/12 bg-gradient-to-br from-[#10b981] to-[#059669] text-white p-10 md:p-14 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Contact Us</h2>
              <div className="w-20 h-1.5 bg-white/30 rounded-full mb-8"></div>
              <p className="text-zinc-100 text-lg leading-relaxed mb-10">
                Have questions about a listing or our verified process? Reach out and our dedicated concierge team will assist you.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-200 mb-1">Email Us</p>
                    <p className="text-lg font-semibold">unnamee137gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1.72c-4.447 0-8.05-3.513-8.494-7.855s1.332-8.303 5.48-9.043"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-zinc-200 mb-1">Call Us</p>
                    <p className="text-lg font-semibold">+91 9326897837</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/20">
              <div className="flex flex-col gap-6">
                <div className="group transition-all">
                  <h3 className="text-xl font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Concierge Support <span className="opacity-0 group-hover:opacity-100">→</span>
                  </h3>
                  <p className="text-zinc-200 text-sm mt-1">Available 24/7 for priority members.</p>
                </div>
                <div className="group transition-all">
                  <h3 className="text-xl font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Corporate Inquiries <span className="opacity-0 group-hover:opacity-100">→</span>
                  </h3>
                  <p className="text-zinc-200 text-sm mt-1">Scale your listings across cities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-7/12 p-10 md:p-14 bg-white/40">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Send a Message</h2>
            <p className="text-slate-500 mb-8">We usually respond within a few hours.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Sanchit"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f1f5f9] rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 px-5 py-3.5 text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Manjarekar"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f1f5f9] rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 px-5 py-3.5 text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f1f5f9] rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 px-5 py-3.5 text-slate-900 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your-email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f1f5f9] rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 px-5 py-3.5 text-slate-900 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 ..."
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f1f5f9] rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 px-5 py-3.5 text-slate-900 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-[#f1f5f9] rounded-xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 px-5 py-3.5 text-slate-900 transition-all outline-none resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl text-lg font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                Send Message
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;