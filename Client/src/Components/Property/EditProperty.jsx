import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URLS } from "../../config";

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        beds: "",
        baths: "",
        type: "rent",
        amenities: {
            parking: false,
            furnished: false,
        },
        description: "",
        images: [],
        ownerName: "",
        agreementTerms: "Standard rental agreement: One month notice required. Tenant is responsible for minor repairs. No structural changes allowed.",
        agreementImage: null,
    });

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            console.log("Fetching property with ID:", id);
            try {
                // First, check if server is reachable
                await axios.get(API_URLS.PING_PROPERTY).then(r => console.log("Ping success:", r.data)).catch(e => console.error("Ping failed:", e.message));

                const response = await axios.get(API_URLS.EDIT_PROPERTY(id));
                console.log("Response from server:", response.data);
                const property = response.data;

                // Map backend data to frontend form state
                setFormData({
                    title: property.title,
                    location: property.location,
                    price: property.price,
                    beds: property.beds,
                    baths: property.baths,
                    type: property.type,
                    amenities: {
                        parking: property.amenities?.parking || false,
                        furnished: property.amenities?.furnished || false,
                    },
                    description: property.description,
                    images: [], // Keep empty to track new uploads
                    ownerName: property.ownerName || "",
                    agreementTerms: property.agreementTerms || "Standard rental agreement...",
                    agreementImage: null,
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching property details:", error.response?.data || error.message);
                const errorMsg = error.response?.data?.message || error.message;
                alert(`Error Loading Property: ${errorMsg}\n\nThis happened while trying to fetch ID: ${id}`);
                navigate("/view-properties");
            }
        };

        fetchProperty();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            amenities: { ...formData.amenities, [name]: checked },
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, images: files });
    };

    const handleAgreementImageChange = (e) => {
        setFormData({ ...formData, agreementImage: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "images") {
                if (formData.images.length > 0) {
                    formData.images.forEach((file) => formDataObj.append("images", file));
                }
            } else if (key === "agreementImage") {
                if (formData.agreementImage) {
                    formDataObj.append("agreementImage", formData.agreementImage);
                }
            } else if (key === "amenities") {
                formDataObj.append("amenities[parking]", formData.amenities.parking);
                formDataObj.append("amenities[furnished]", formData.amenities.furnished);
            } else {
                formDataObj.append(key, formData[key]);
            }
        });

        const ownerEmail = localStorage.getItem('userEmail');
        if (!ownerEmail) {
            alert("Please login as a landlord first!");
            navigate('/login');
            return;
        }
        formDataObj.append('ownerEmail', ownerEmail);

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                API_URLS.UPDATE_PROPERTY(id),
                formDataObj,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("Property updated successfully!");
            navigate('/view-properties');
        } catch (error) {
            console.error("Update error details:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message;
            alert(`Failed to update property: ${errorMsg}`);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-2xl font-semibold text-blue-600">Loading property details...</div>;
    }

    return (
        <div className="p-8 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-xl shadow-lg mt-4" style={{ marginTop: '64px' }}>
            <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
                Edit Property
            </h1>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                        <label className="block mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg"
                        />
                        <label className="block mt-4 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <label className="block mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg"
                        />
                        <label className="block mt-4 mb-2">Beds</label>
                        <input
                            type="number"
                            name="beds"
                            value={formData.beds}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg"
                        />
                        <label className="block mt-4 mb-2">Baths</label>
                        <input
                            type="number"
                            name="baths"
                            value={formData.baths}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg"
                        />
                        <label className="block mt-4 mb-2">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="rent">Rent</option>
                            <option value="sale">Sale</option>
                        </select>
                        <label className="block mt-4 mb-2">Owner Name</label>
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-1/2 mt-4 py-3 bg-gray-500 text-white rounded-lg"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="w-1/2 mt-4 py-3 bg-blue-600 text-white rounded-lg"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <label className="block mb-2">Upload New Images (Leave blank to keep existing)</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full p-3 border rounded-lg"
                        />
                        <label className="block mt-4 mb-2">Amenities</label>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="parking"
                                    checked={formData.amenities.parking}
                                    onChange={handleCheckboxChange}
                                    className="form-checkbox"
                                />
                                <span className="ml-2 text-gray-700">Parking</span>
                            </label>
                            <label className="inline-flex items-center ml-4">
                                <input
                                    type="checkbox"
                                    name="furnished"
                                    checked={formData.amenities.furnished}
                                    onChange={handleCheckboxChange}
                                    className="form-checkbox"
                                />
                                <span className="ml-2 text-gray-700">Furnished</span>
                            </label>
                        </div>
                        <label className="block mt-4 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Full property description..."
                            className="w-full p-3 border rounded-lg"
                        />
                        {formData.type === 'rent' && (
                            <>
                                <label className="block mt-4 mb-2">Agreement Terms</label>
                                <textarea
                                    name="agreementTerms"
                                    value={formData.agreementTerms}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Define your rental agreement terms..."
                                    className="w-full p-3 border rounded-lg h-32"
                                />
                                <label className="block mt-4 mb-2">Or Upload New Agreement Document (Optional)</label>
                                <input
                                    type="file"
                                    onChange={handleAgreementImageChange}
                                    accept="image/*,.pdf,.doc,.docx"
                                    className="w-full p-3 border rounded-lg"
                                />
                            </>
                        )}
                        <div className="flex gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-1/2 py-3 bg-gray-500 text-white rounded-lg font-bold"
                            >
                                Previous
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 transition-colors"
                            >
                                Update Property
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditProperty;
