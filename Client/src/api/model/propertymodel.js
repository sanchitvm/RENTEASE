const mongoose = require('mongoose');

// Define property schema
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['rent', 'sale'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amenities: {
      parking: {
        type: Boolean,
        default: false,
      },
      furnished: {
        type: Boolean,
        default: false,
      },
    },
    images: {
      type: [String], // Array of image file paths
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'sold'],
      default: 'available',
    },
    bookedBy: {
      type: String,
      default: null,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    agreementTerms: {
      type: String,
      default: 'Standard rental agreement: One month notice required. Tenant is responsible for minor repairs. No structural changes allowed.',
    },
    agreementImage: {
      type: String, // Filename of the uploaded agreement image
      default: null,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create and export the model
const Property = mongoose.model('Property', propertySchema);
module.exports = { Property };
