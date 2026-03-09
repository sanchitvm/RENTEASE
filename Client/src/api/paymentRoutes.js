const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();
const { Property } = require('./model/propertymodel');
const { Agreement } = require('./model/agreementmodel');

const razorpay = new Razorpay({
  key_id: "rzp_test_Q6bFNeQnz7fTeh", // Your test API key
  key_secret: "EWsRrkk8nBzw88DdxYAAeF2V", // Your test secret key
});

// Create Order API
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", propertyId } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    console.log(`Creating Razorpay order for Amount: ${amount} INR (${amount * 100} Paise)`);

    console.log(`Creating Razorpay order for Amount: ${amount} INR (${amount * 100} Paise)`);

    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (!property || property.status !== 'available') {
        return res.status(400).json({ message: "Property is no longer available for booking" });
      }
    }

    const options = {
      amount: amount * 100, // Razorpay works with paise (1 INR = 100 paise)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      throw new Error("Order creation failed.");
    }

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

// Verify Payment API
router.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, propertyId } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", "EWsRrkk8nBzw88DdxYAAeF2V") // Use your secret key
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Success - Update property status and record buyer
    if (propertyId) {
      const userEmail = req.user.email;
      Property.findById(propertyId).then(async property => {
        if (property) {
          property.status = property.type === 'rent' ? 'rented' : 'sold';
          property.bookedBy = userEmail;
          await property.save();

          // Automatically update the rental agreement if it exists
          if (property.type === 'rent') {
            const agreement = await Agreement.findOne({ propertyId: property._id, tenantEmail: userEmail });
            if (agreement) {
              agreement.status = agreement.landlordSignature?.signed ? 'completed' : (agreement.tenantSignature?.signed ? 'signed_by_tenant' : 'pending');
              // Optionally add payment confirmation to terms or a new field
              agreement.terms += `\n\n[Payment of ₹${property.price} verified on ${new Date().toLocaleDateString()}]`;
              await agreement.save();
            } else {
              // Fallback if somehow agreement doesn't exist (though it should now)
              const newAgreement = new Agreement({
                propertyId: property._id,
                tenantEmail: userEmail,
                landlordEmail: property.ownerEmail,
                rentAmount: property.price,
                status: 'pending',
                terms: `Standard rental agreement for ${property.title}. payment verified.`
              });
              await newAgreement.save().catch(err => console.error("Error creating fallback agreement:", err));
            }
          }
        }
      }).catch(err => console.error("Error updating property status:", err));
    }

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;
