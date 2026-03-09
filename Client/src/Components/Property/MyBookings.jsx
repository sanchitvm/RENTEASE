import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../../config';
import AgreementView from './AgreementView';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agreements, setAgreements] = useState([]);
    const [selectedAgreementId, setSelectedAgreementId] = useState(null);
    const [showAgreement, setShowAgreement] = useState(false);
    const userEmail = localStorage.getItem('userEmail');

    const fetchBookings = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            setError("User email not found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [bookingsRes, agreementsRes] = await Promise.all([
                axios.get(API_URLS.MY_BOOKINGS(email), config),
                axios.get(API_URLS.AGREEMENTS(email), config)
            ]);
            setBookings(bookingsRes.data);
            setAgreements(agreementsRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            const detail = err.response ? ` (Status: ${err.response.status} - ${err.response.data?.message || err.message})` : ` (${err.message})`;
            setError("Failed to load your data." + detail);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleViewAgreement = (propertyId) => {
        const agreement = agreements.find(a => a.propertyId?._id === propertyId || a.propertyId === propertyId);
        if (agreement) {
            setSelectedAgreementId(agreement._id);
            setShowAgreement(true);
        } else {
            alert("No agreement found for this property.");
        }
    };

    const handlePayment = async (amount, propertyId, type) => {
        const isSale = type === 'sale';
        const finalAmount = isSale ? 50000 : amount;
        console.log(`Initiating payment for ${type} property:`, propertyId, "Original Price:", amount, "Payment Amount:", finalAmount);

        try {
            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded. Please wait or refresh the page.");
                return;
            }

            // Convert amount to number if it's a string, and remove symbols if any
            const cleanAmount = Number(String(finalAmount).replace(/[^0-9.]/g, ''));
            if (isNaN(cleanAmount) || cleanAmount <= 0) {
                alert("Invalid payment amount.");
                return;
            }

            if (isSale) {
                alert(`You are paying a token amount of ₹50,000 to book this property for sale. Total price is ₹${amount}.`);
            }

            const token = localStorage.getItem('token');
            const { data } = await axios.post(API_URLS.CREATE_PAYMENT_ORDER, {
                amount: cleanAmount,
                propertyId: propertyId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const options = {
                key: "rzp_test_Q6bFNeQnz7fTeh",
                amount: data.amount,
                currency: data.currency,
                order_id: data.orderId,
                name: "RentEase",
                description: "Digital Rental Payment",
                handler: async function (response) {
                    if (!response.razorpay_payment_id) {
                        alert("Payment failed!");
                        return;
                    }

                    try {
                        const token = localStorage.getItem('token');
                        const verifyRes = await axios.post(API_URLS.VERIFY_PAYMENT, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            propertyId: propertyId,
                            userEmail: localStorage.getItem('userEmail')
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (verifyRes.data.success) {
                            alert("Payment Successful! The property is now booked.");
                            fetchBookings(); // Refresh the list
                        } else {
                            alert("Payment Verification Failed.");
                        }
                    } catch (error) {
                        alert("Payment verification error.");
                        console.error("Verification error:", error);
                    }
                },
                prefill: {
                    name: localStorage.getItem('userName') || "Guest User",
                },
                image: "https://cdn-icons-png.flaticon.com/512/2695/2695971.png",
                config: {
                    display: {
                        blocks: {
                            upi_methods: {
                                name: "UPI (GPay / PhonePe / Paytm)",
                                instruments: [
                                    {
                                        method: "upi",
                                    },
                                ],
                            },
                        },
                        sequence: ["block.upi_methods", "block.card", "block.netbanking"],
                        preferences: {
                            show_default_blocks: true,
                        },
                    },
                },
                theme: { color: "#4f46e5" }, // Matching modern indigo
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Error initiating payment:", error.response?.data || error.message);
            alert(`Failed to initiate payment: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCancelAgreement = async (agreementId) => {
        if (!window.confirm("Are you sure you want to cancel this property request?")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(API_URLS.DELETE_AGREEMENT(agreementId), {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Cancellation response:", res.data);
            alert("Request cancelled successfully.");
            fetchBookings(); // Refresh the list
        } catch (err) {
            console.error("Error cancelling agreement:", err);
            const errorMsg = err.response?.data?.message || err.message;
            alert(`Failed to cancel request: ${errorMsg}`);
        }
    };

    if (loading) return <div className="text-center py-20 text-2xl font-bold text-blue-600">Loading your account...</div>;
    if (error) return <div className="text-center py-20 text-red-500 text-xl font-medium">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-24 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">My Rentals & Agreements</h1>

            {bookings.length === 0 ? (
                <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <p className="text-gray-500 text-xl mb-6 font-medium">You don't have any bookings or active agreements yet.</p>
                    <a href="/api/properties/search-rent" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg inline-block">
                        Browse Properties
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map((property) => {
                        const agreement = agreements.find(a => a.propertyId?._id === property._id || a.propertyId === property._id);
                        const isBooked = property.bookedBy === userEmail;
                        const isSigned = agreement?.tenantSignature?.signed;

                        return (
                            <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="relative h-56">
                                    <img
                                        src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${isBooked ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                                        {isBooked ? 'Booked' : 'Action Required'}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-2 text-gray-800 truncate">{property.title}</h2>
                                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {property.location}
                                    </p>

                                    <div className="flex justify-between items-center py-4 border-t border-gray-50 mb-4">
                                        <div className="text-xl font-bold text-blue-600">
                                            ₹{property.price.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Last Activity: {new Date(property.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {!isBooked && (
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleViewAgreement(property._id)}
                                                className={`w-full py-2.5 rounded-xl font-bold transition-all ${isSigned ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700'}`}
                                            >
                                                {isSigned ? 'Agreement Signed ✓' : 'View & Sign Agreement'}
                                            </button>

                                            {isSigned && (
                                                <button
                                                    onClick={() => handlePayment(property.price, property._id, property.type)}
                                                    className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all font-bold"
                                                >
                                                    Proceed to {property.type === 'sale' ? 'Token Payment ₹50,000' : 'Payment'}
                                                </button>
                                            )}

                                            {agreement && (
                                                <button
                                                    onClick={() => handleCancelAgreement(agreement._id)}
                                                    className="w-full py-2.5 bg-white text-red-600 rounded-xl font-bold border border-red-100 hover:bg-red-50 transition-all text-xs"
                                                >
                                                    Cancel Property Request
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {isBooked && (
                                        <button
                                            onClick={() => handleViewAgreement(property._id)}
                                            className="w-full py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold border border-gray-100 hover:bg-gray-100 transition-all"
                                        >
                                            View Signed Agreement
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
            }

            {
                showAgreement && (
                    <AgreementView
                        agreementId={selectedAgreementId}
                        userEmail={userEmail}
                        userType="tenant"
                        onClose={() => setShowAgreement(false)}
                        onRefresh={fetchBookings}
                    />
                )
            }
        </div >
    );
};

export default MyBookings;
