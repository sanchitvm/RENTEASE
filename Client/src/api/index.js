const dns = require('dns');
// Set Google & Cloudflare DNS to bypass local ISP blocks (like Jio/Airtel) for MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require("dotenv").config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Property } = require('./model/propertymodel'); // Ensure correct path to model
const { Agreement } = require('./model/agreementmodel');
const { UserSchema } = require('./model/usermodel');
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const paymentRoutes = require("./paymentRoutes.js")

const app = express();

// Use CORS to allow cross-origin requests
app.use(cors());

// GLOBAL REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware to parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Heartbeat route to verify server is running the latest code
app.get('/ping', (req, res) => res.json({ msg: 'Server is alive! Version 2', timestamp: new Date() }));

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

app.use("/payment", verifyToken, paymentRoutes);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// GET endpoint to fetch properties
app.get('/properties', async (req, res) => {
  const { location, type } = req.query;

  try {
    const filter = { status: 'available' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;

    const properties = await Property.find(filter);

    const propertiesWithImages = properties.map((property) => {
      const imageUrls = property.images.map((imageName) =>
        imageName.startsWith('http') ? imageName : `http://${req.headers.host}/img/${imageName}`
      );
      return { ...property.toObject(), images: imageUrls };
    });

    res.status(200).json(propertiesWithImages);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error });
  }
});

// GET endpoint to fetch properties booked by a specific user
app.get('/my-bookings', verifyToken, async (req, res) => {
  const email = req.user.email;

  if (!email) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    // 1. Find properties explicitly booked by the user (paid)
    const bookedProperties = await Property.find({ bookedBy: email });

    // 2. Find properties where an agreement has been initiated for this user but not yet booked
    const agreements = await Agreement.find({ tenantEmail: email });
    const agreementPropertyIds = agreements.map(a => a.propertyId);

    const pendingProperties = await Property.find({
      _id: { $in: agreementPropertyIds },
      bookedBy: { $ne: email } // Avoid duplicates if already booked
    });

    const allProperties = [...bookedProperties, ...pendingProperties];

    const propertiesWithDetails = allProperties.map((property) => {
      const imageUrls = property.images.map((imageName) =>
        imageName.startsWith('http') ? imageName : `http://${req.headers.host}/img/${imageName}`
      );
      return { ...property.toObject(), images: imageUrls };
    });

    res.status(200).json(propertiesWithDetails);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// GET endpoint to fetch properties added by a specific landlord
app.get('/my-properties', verifyToken, async (req, res) => {
  const email = req.user.email;

  if (!email) {
    return res.status(400).json({ message: 'Owner email is required' });
  }

  try {
    const properties = await Property.find({ ownerEmail: email });

    const propertiesWithImages = properties.map((property) => {
      const imageUrls = property.images.map((imageName) =>
        imageName.startsWith('http') ? imageName : `http://${req.headers.host}/img/${imageName}`
      );
      return { ...property.toObject(), images: imageUrls };
    });

    res.status(200).json(propertiesWithImages);
  } catch (error) {
    console.error('Error fetching landlord properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error });
  }
});

// POST endpoint to add a property
app.post('/add-property', verifyToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'agreementImage', maxCount: 1 }]), async (req, res) => {
  console.log(`\n--- [NEW PROPERTY SUBMISSION] ${new Date().toISOString()} ---`);
  console.log('Body Fields:', Object.keys(req.body));

  try {
    const { title, location, price, beds, baths, type, description, ownerEmail, ownerName, agreementTerms } = req.body;

    if (!price || isNaN(Number(price))) {
      console.log('⚠️ VALIDATION FAILED: Missing or invalid price');
    }

    // Parse amenities correctly from flat multer body
    const amenities = {
      parking: req.body['amenities[parking]'] === 'true',
      furnished: req.body['amenities[furnished]'] === 'true'
    };

    const images = req.files['images'] ? req.files['images'].map((file) => file.filename) : [];
    const agreementImage = req.files['agreementImage'] ? req.files['agreementImage'][0].filename : null;

    const newProperty = new Property({
      title,
      location,
      price: Number(price),
      beds: Number(beds),
      baths: Number(baths),
      type,
      description,
      amenities,
      images,
      ownerEmail,
      ownerName,
      agreementTerms,
      agreementImage
    });

    await newProperty.save();

    res.status(201).json({ message: 'Property added successfully!', data: newProperty });
  } catch (error) {
    console.error('Error adding property:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error adding property', error: error.message });
    }
  }
});

// GET endpoint to fetch a single property by ID
app.get('/property/:id', async (req, res) => {
  console.log(`GET /property/${req.params.id} requested at ${new Date().toISOString()}`);
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      console.log(`Property with ID ${req.params.id} NOT FOUND in database`);
      return res.status(404).json({ message: `PROPERTY_NOT_FOUND: The ID ${req.params.id} does not exist in our records.` });
    }

    const imageUrls = property.images.map((imageName) =>
      imageName.startsWith('http') ? imageName : `http://${req.headers.host}/img/${imageName}`
    );

    res.status(200).json({ ...property.toObject(), images: imageUrls });
  } catch (error) {
    console.error('SERVER ERROR fetching property:', error);
    res.status(500).json({ message: 'INTERNAL_SERVER_ERROR', error: error.message });
  }
});

// A catch-all for /property/ if the above doesn't match for some reason
app.get('/property/*', (req, res) => {
  console.log(`UNMATCHED /property/ request: ${req.url}`);
  res.status(404).json({ message: 'ROUTE_NOT_FOUND', detail: `The URL ${req.url} did not match our /property/:id pattern.` });
});

// PUT endpoint to update a property
app.put('/update-property/:id', verifyToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'agreementImage', maxCount: 1 }]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, price, beds, baths, type, description, ownerEmail, ownerName, agreementTerms } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Authorization check
    if (property.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this property' });
    }

    // Parse amenities correctly
    const amenities = {
      parking: req.body['amenities[parking]'] === 'true',
      furnished: req.body['amenities[furnished]'] === 'true'
    };

    const updateData = {
      title,
      location,
      price: Number(price),
      beds: Number(beds),
      baths: Number(baths),
      type,
      description,
      amenities,
      ownerEmail,
      ownerName,
      agreementTerms
    };

    // Update images if new ones are uploaded
    if (req.files['images']) {
      updateData.images = req.files['images'].map((file) => file.filename);
    }

    // Update agreement image if a new one is uploaded
    if (req.files['agreementImage']) {
      updateData.agreementImage = req.files['agreementImage'][0].filename;
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: 'Property updated successfully!', data: updatedProperty });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
});

// PATCH endpoint to update property agreement details
app.patch('/update-property-agreement/:id', verifyToken, upload.single('agreementImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { agreementTerms } = req.body;
    const agreementImage = req.file ? req.file.filename : undefined;

    const updateData = {};
    if (agreementTerms !== undefined) updateData.agreementTerms = agreementTerms;
    if (agreementImage !== undefined) updateData.agreementImage = agreementImage;

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Agreement updated successfully', data: updatedProperty });
  } catch (error) {
    console.error('Error updating property agreement:', error);
    res.status(500).json({ message: 'Error updating agreement', error });
  }
});

// DELETE endpoint to remove a property
app.delete('/delete-property/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized to delete this property' });
    }

    await Property.findByIdAndDelete(id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property', error });
  }
});

// GET endpoint to serve files (Images, PDFs, Docs)
app.get('/img/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      if (!res.headersSent) {
        res.status(404).json({ message: 'File not found' });
      }
    }
  });
});

// --- Agreement Endpoints ---

// GET agreements for a user (either tenant or landlord)
app.get('/agreements', verifyToken, async (req, res) => {
  const email = req.user.email;

  try {
    const agreements = await Agreement.find({
      $or: [{ tenantEmail: email }, { landlordEmail: email }]
    }).populate('propertyId');
    res.status(200).json(agreements);
  } catch (error) {
    console.error('Error fetching agreements:', error);
    res.status(500).json({ message: 'Error fetching agreements', error });
  }
});

// POST endpoint to create an agreement manually (if needed)
app.post('/create-agreement', async (req, res) => {
  try {
    const { propertyId, tenantEmail, landlordEmail, rentAmount, terms } = req.body;

    const newAgreement = new Agreement({
      propertyId,
      tenantEmail,
      landlordEmail,
      rentAmount,
      terms
    });

    await newAgreement.save();
    res.status(201).json({ message: 'Agreement created successfully', data: newAgreement });
  } catch (error) {
    console.error('Error creating agreement:', error);
    res.status(500).json({ message: 'Error creating agreement', error });
  }
});

// POST endpoint to create or get an existing agreement
app.post('/get-or-create-agreement', verifyToken, async (req, res) => {
  try {
    const { propertyId, tenantEmail } = req.body;

    // Security: Use the email from the verified token
    if (tenantEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Check if an agreement already exists for this tenant and property
    let agreement = await Agreement.findOne({ propertyId, tenantEmail });

    if (!agreement) {
      // Find the property to get the LATEST price and terms directly from the DB
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      const customTerms = property.agreementTerms || `Standard rental agreement for property. One month notice required.`;

      // Fetch tenant's personal details
      const tenant = await User.findOne({ email: tenantEmail });

      agreement = new Agreement({
        propertyId,
        tenantEmail,
        landlordEmail: property.ownerEmail, // Use DB value for security
        rentAmount: property.price,         // Use DB value for accuracy
        terms: customTerms,
        agreementImage: property.agreementImage || null,
        tenantDetails: {
          name: tenant?.name || 'N/A',
          age: tenant?.age || null,
          gender: tenant?.gender || 'N/A',
          maritalStatus: tenant?.maritalStatus || 'N/A'
        }
      });
      await agreement.save();
    }

    res.status(200).json({ message: 'Agreement retrieved/created', data: agreement });
  } catch (error) {
    console.error('Error in get-or-create-agreement:', error);
    res.status(500).json({ message: 'Error handling agreement', error });
  }
});

// PATCH endpoint to sign an agreement
app.patch('/sign-agreement/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { email, role, signatureName, signatureImage } = req.body; // role: 'tenant' or 'landlord'

  // Security check: Match token email with body email
  if (email !== req.user.email) {
    return res.status(403).json({ message: 'Unauthorized signing' });
  }

  try {
    const agreement = await Agreement.findById(id);
    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    const signatureData = {
      signed: true,
      signatureName: signatureName || 'N/A',
      signatureImage: signatureImage || null,
      date: new Date()
    };

    if (role === 'tenant') {
      if (agreement.tenantEmail !== email) {
        return res.status(403).json({ message: 'Unauthorized signing as tenant' });
      }
      agreement.tenantSignature = signatureData;
      if (agreement.status === 'pending') agreement.status = 'signed_by_tenant';
      else if (agreement.status === 'signed_by_landlord') agreement.status = 'completed';
    } else if (role === 'landlord') {
      if (agreement.landlordEmail !== email) {
        return res.status(403).json({ message: 'Unauthorized signing as landlord' });
      }
      agreement.landlordSignature = signatureData;
      if (agreement.status === 'pending') agreement.status = 'signed_by_landlord';
      else if (agreement.status === 'signed_by_tenant') agreement.status = 'completed';
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await agreement.save();
    res.status(200).json({ message: 'Agreement signed successfully', data: agreement });
  } catch (error) {
    console.error('Error signing agreement:', error);
    res.status(500).json({ message: 'Error signing agreement', error: error.message });
  }
});

// DELETE endpoint to cancel/remove an agreement
app.delete('/agreements/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const agreement = await Agreement.findById(id);
    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    // Only tenant or landlord can cancel
    if (agreement.tenantEmail !== req.user.email && agreement.landlordEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized to cancel this agreement' });
    }

    await Agreement.findByIdAndDelete(id);
    console.log(`🗑️ Agreement ${id} cancelled/deleted`);
    res.status(200).json({ message: 'Agreement cancelled successfully' });
  } catch (error) {
    console.error('Error deleting agreement:', error);
    res.status(500).json({ message: 'Error deleting agreement', error: error.message });
  }
});

// Start Server & Connect to MongoDB
const PORT = 8080;
const HOST = '0.0.0.0'; // Bind to all interfaces for network visibility
app.listen(PORT, HOST, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`\n🚀 MAIN API SERVER IS RUNNING`);
    console.log(`📡 Local:            http://localhost:${PORT}`);
    console.log(`🌐 Network (Any WiFi): Access via your Computer's IP on port ${PORT}`);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
});
