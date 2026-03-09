const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    tenantEmail: {
        type: String,
        required: true
    },
    landlordEmail: {
        type: String,
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'signed_by_tenant', 'signed_by_landlord', 'completed'],
        default: 'pending'
    },
    terms: {
        type: String,
        default: 'Standard rental agreement terms: One month notice, no structural changes, maintenance responsibility of tenant for minor issues.'
    },
    agreementImage: {
        type: String,
        default: null
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => new Date(Date.now() + 31536000000) // Default 1 year
    },
    tenantDetails: {
        name: { type: String },
        age: { type: Number },
        gender: { type: String },
        maritalStatus: { type: String }
    },
    tenantSignature: {
        signed: { type: Boolean, default: false },
        signatureName: { type: String },
        signatureImage: { type: String }, // Base64 data
        date: { type: Date }
    },
    landlordSignature: {
        signed: { type: Boolean, default: false },
        signatureName: { type: String },
        signatureImage: { type: String }, // Base64 data
        date: { type: Date }
    }
}, { timestamps: true });

const Agreement = mongoose.model('Agreement', agreementSchema);

module.exports = { Agreement };
