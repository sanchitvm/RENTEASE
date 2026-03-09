import React from 'react'
import { motion } from 'framer-motion'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Tips for First-Time Home Buyers",
      date: "March 15, 2026",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
      excerpt: "Essential advice for navigating your first home purchase, from financing to closing.",
      detailsPage: "/blog/first-time-home-buyers"
    },
    {
      id: 2,
      title: "Current Real Estate Market Trends",
      date: "March 10, 2026",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3",
      excerpt: "Analysis of the latest market trends and what they mean for buyers and sellers.",
      detailsPage: "/blog/market-trends"
    },
    {
      id: 3,
      title: "Investment Property Guide",
      date: "March 5, 2026",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3",
      excerpt: "Everything you need to know about investing in rental properties.",
      detailsPage: "/blog/investment-property"
    },
    {
      id: 4,
      title: "Home Decor Inspiration for Spring",
      date: "February 20, 2026",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3",
      excerpt: "Get ready to refresh your home with these seasonal decor ideas.",
      detailsPage: "/blog/spring-home-decor"
    },
    {
      id: 5,
      title: "The Benefits of Sustainable Living",
      date: "February 15, 2026",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3",
      excerpt: "Discover how making eco-friendly choices can positively impact your lifestyle and the environment.",
      detailsPage: "/blog/sustainable-living"
    },
    {
      id: 6,
      title: "Understanding Home Insurance",
      date: "February 10, 2026",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
      excerpt: "A comprehensive guide to understanding your home insurance options and coverage.",
      detailsPage: "/blog/home-insurance"
    },
    {
      id: 7,
      title: "The Importance of Location in Real Estate",
      date: "February 5, 2026",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
      excerpt: "Learn how to evaluate the location of a property and why it's a key factor in real estate.",
      detailsPage: "/blog/location-importance"
    },
    {
      id: 8,
      title: "The Pros and Cons of Renting vs. Buying",
      date: "January 30, 2026",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
      excerpt: "Explore the advantages and disadvantages of renting and buying a home.",
      detailsPage: "/blog/renting-vs-buying"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Real Estate Insights</h1>
          <p className="text-xl text-gray-600">Stay informed with our latest real estate news and tips</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <a href={post.detailsPage} className="text-green-600 font-semibold hover:text-green-700">
                  Read More →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog