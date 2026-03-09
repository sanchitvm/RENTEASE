import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../../config';
import { Link } from 'react-router-dom';
import AgreementView from './AgreementView';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreementId, setSelectedAgreementId] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editTerms, setEditTerms] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchProperties = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setError("User email not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [propertiesRes, agreementsRes] = await Promise.all([
          axios.get(API_URLS.MY_PROPERTIES(email), config),
          axios.get(API_URLS.AGREEMENTS(email), config)
        ]);
        setProperties(propertiesRes.data);
        setAgreements(agreementsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Failed to load your properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
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

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_URLS.DELETE_PROPERTY(propertyId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.filter((property) => property._id !== propertyId));
      alert('Property deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete property');
    }
  };

  const handleUpdateAgreement = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("agreementTerms", editTerms);
    if (editImage) {
      formData.append("agreementImage", editImage);
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(API_URLS.UPDATE_AGREEMENT(editingPropertyId), formData, config);
      alert("Agreement updated successfully!");
      setEditingPropertyId(null);
      // Refresh properties
      const email = localStorage.getItem('userEmail');
      const propertiesRes = await axios.get(API_URLS.MY_PROPERTIES(email), config);
      setProperties(propertiesRes.data);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update agreement.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-2xl font-semibold text-blue-600">Loading your properties...</div>;
  if (error) return <div className="text-center py-20 text-red-500 text-xl font-medium">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-24 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">My Property Listings</h1>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-xl mb-6">You haven't added any properties yet.</p>
            <a href="/add-property" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition duration-300">
              Add Your First Property
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${property.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {property.status}
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">{property.title}</h2>
                  <div className="flex justify-between items-center text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span className="text-sm">{property.location}</span>
                    </div>
                    {property.ownerName && (
                      <div className="flex items-center text-blue-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span className="text-xs font-semibold">Owner: {property.ownerName}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{property.price.toLocaleString()}
                    </div>
                    <div className="flex gap-4 text-gray-600 text-sm">
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>{property.beds} Bed</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(property._id)}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Delete Property
                  </button>
                  <Link
                    to={`/edit-property/${property._id}`}
                    className="w-full mt-3 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Edit Property
                  </Link>
                  {property.type === 'rent' && (
                    <button
                      onClick={() => {
                        setEditingPropertyId(property._id);
                        setEditTerms(property.agreementTerms || "");
                      }}
                      className="w-full mt-3 py-3 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      Setup/Edit Terms
                    </button>
                  )}
                  {agreements.some(a => a.propertyId?._id === property._id || a.propertyId === property._id) && (
                    <button
                      onClick={() => handleViewAgreement(property._id)}
                      className="w-full mt-3 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      {agreements.find(a => a.propertyId?._id === property._id || a.propertyId === property._id)?.landlordSignature?.signed ? "View Agreement" : "Sign Pending Agreement"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAgreement && (
        <AgreementView
          agreementId={selectedAgreementId}
          userEmail={userEmail}
          userType="landlord"
          onClose={() => setShowAgreement(false)}
          onRefresh={() => {
            const email = localStorage.getItem('userEmail');
            axios.get(API_URLS.AGREEMENTS(email)).then(res => setAgreements(res.data));
          }}
        />
      )}

      {editingPropertyId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Setup Property Agreement</h2>
            <form onSubmit={handleUpdateAgreement}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Agreement Terms</label>
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 transition-all duration-200"
                  value={editTerms}
                  onChange={(e) => setEditTerms(e.target.value)}
                  placeholder="Enter detailed rental terms..."
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Agreement Document (PDF/DOCX) (Optional)</label>
                <div className="relative group">
                  <input
                    type="file"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditingPropertyId(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all duration-200 disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Agreement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
