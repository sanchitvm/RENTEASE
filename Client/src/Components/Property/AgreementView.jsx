import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../config';
import './AgreementView.css';

const AgreementView = ({ agreementId, userEmail, userType, onClose, onRefresh, onSign }) => {
    const navigate = useNavigate();
    const [agreement, setAgreement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Signing States
    const [isSigning, setIsSigning] = useState(false);
    const [signatureName, setSignatureName] = useState('');
    const [isAccepted, setIsAccepted] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isCanvasDirty, setIsCanvasDirty] = useState(false);

    useEffect(() => {
        const fetchAgreement = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(API_URLS.AGREEMENTS(userEmail), config);
                const found = response.data.find(a => a._id === agreementId);
                if (found) {
                    setAgreement(found);
                    const isLandlord = userType.toLowerCase().includes('landlord');
                    const mySig = isLandlord ? found.landlordSignature : found.tenantSignature;

                    // Auto-show signing pad if not signed
                    if (!mySig?.signed) {
                        setIsSigning(true);
                    }

                    if (found.tenantDetails?.name && found.tenantDetails.name !== 'N/A') {
                        setSignatureName(found.tenantDetails.name);
                    }
                } else {
                    setError('Agreement not found');
                }
            } catch (err) {
                setError('Failed to fetch agreement details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgreement();
    }, [agreementId, userEmail, userType]);

    // Canvas Logic
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            // Handle window resizing or initial load for responsive canvas
            const resizeCanvas = () => {
                const container = canvas.parentElement;
                if (container) {
                    // Only resize if width changed to avoid clearing on every render
                    if (canvas.width !== container.clientWidth) {
                        canvas.width = container.clientWidth;
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = 2;
                        ctx.lineCap = 'round';
                    }
                }
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [isSigning, agreement]);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setIsCanvasDirty(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsCanvasDirty(false);
    };

    const handleSign = async () => {
        if (!isAccepted || !signatureName.trim() || !isCanvasDirty) {
            alert('Please accept terms, enter your name, and draw your signature on the pad.');
            return;
        }

        const signatureImage = canvasRef.current.toDataURL('image/png');

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const role = userType.toLowerCase().includes('landlord') ? 'landlord' : 'tenant';
            await axios.patch(API_URLS.SIGN_AGREEMENT(agreementId), {
                email: userEmail,
                role: role,
                signatureName: signatureName,
                signatureImage: signatureImage
            }, config);

            alert('Agreement signed successfully!');
            if (onSign) onSign();

            // Refresh data
            const response = await axios.get(API_URLS.AGREEMENTS(userEmail), config);
            const found = response.data.find(a => a._id === agreementId);
            if (found) setAgreement(found);
            setIsSigning(false);
            onRefresh();
        } catch (err) {
            alert('Failed to sign agreement');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !agreement) return <div className="agreement-modal">Loading Agreement...</div>;
    if (error) return <div className="agreement-modal">{error} <button onClick={onClose}>Close</button></div>;
    if (!agreement) return null;

    const isLandlord = userType.toLowerCase().includes('landlord');
    const mySignature = isLandlord ? agreement.landlordSignature : agreement.tenantSignature;

    return (
        <div className="agreement-overlay">
            <div className="agreement-modal">
                <div className="agreement-header">
                    <h2>Digital Rental Agreement</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="agreement-body">
                    <div className="flex justify-between items-start mb-6" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p className="text-sm font-bold text-gray-400 mb-0 uppercase tracking-wider">Property Details</p>
                            <h3 className="text-xl font-extrabold text-blue-900 mt-1">{agreement.propertyId?.title || 'Property Detail Not Available'}</h3>
                            <p className="text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                {agreement.propertyId?.location || 'N/A'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-400 mb-0 uppercase tracking-wider">Monthly Rent</p>
                            <p className="text-2xl font-black text-blue-600">₹{(agreement.propertyId?.price || agreement.rentAmount).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase">Landlord</p>
                            <p className="text-sm font-bold truncate">{agreement.landlordEmail}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase">Tenant</p>
                            <p className="text-sm font-bold truncate">{agreement.tenantEmail}</p>
                        </div>
                    </div>

                    {agreement.tenantDetails && (
                        <div className="tenant-info-section mb-6" style={{
                            background: '#f8fafc',
                            padding: '15px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div className="flex justify-between items-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>Tenant Verfied Information</h4>
                                {!isLandlord && (!agreement.tenantDetails.age || agreement.tenantDetails.name === 'N/A') && (
                                    <button onClick={() => navigate('/profile')} className="text-blue-600 text-xs underline">Complete Profile</button>
                                )}
                            </div>

                            {(!agreement.tenantDetails.age || agreement.tenantDetails.name === 'N/A') ? (
                                <div className="text-xs text-orange-600 italic bg-orange-50 p-2 rounded">Profiles details not found. System will use email for identification.</div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 text-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                    <p className="m-0"><strong>Name:</strong> {agreement.tenantDetails.name}</p>
                                    <p className="m-0"><strong>Age:</strong> {agreement.tenantDetails.age}</p>
                                    <p className="m-0"><strong>Gender:</strong> {agreement.tenantDetails.gender}</p>
                                    <p className="m-0"><strong>Status:</strong> {agreement.tenantDetails.maritalStatus}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="agreement-content-box mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Agreement Terms</p>
                        {agreement.agreementImage ? (
                            <div className="agreement-image-container border rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                                {agreement.agreementImage.match(/\.(pdf)$/i) ? (
                                    <iframe
                                        src={API_URLS.IMAGE_URL(agreement.agreementImage)}
                                        title="Agreement PDF"
                                        className="w-full h-[400px] border-none"
                                    />
                                ) : agreement.agreementImage.match(/\.(doc|docx)$/i) ? (
                                    <div className="p-10 text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </div>
                                        <h4 className="font-bold text-blue-900">Word Document Ready</h4>
                                        <p className="text-sm text-gray-500 mb-6">Download to read full terms offline</p>
                                        <a href={API_URLS.IMAGE_URL(agreement.agreementImage)} download className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition">Download Document</a>
                                    </div>
                                ) : (
                                    <img src={API_URLS.IMAGE_URL(agreement.agreementImage)} alt="Agreement Document" className="w-full h-auto" />
                                )}
                            </div>
                        ) : (
                            <div className="p-4 bg-blue-50/50 border-l-4 border-blue-500 italic rounded text-gray-700 text-sm">
                                {agreement.terms}
                            </div>
                        )}
                    </div>

                    <div className="signatures-summary grid grid-cols-2 gap-8 my-8 py-8 border-y border-dashed border-gray-200" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-4">Landlord Signature</p>
                            {agreement.landlordSignature?.signed ? (
                                <div>
                                    <div className="signature-seal">
                                        <img src={agreement.landlordSignature.signatureImage} alt="LL Sig" className="seal-image" />
                                        <span className="seal-text">VERIFIED</span>
                                        <span className="seal-date">{new Date(agreement.landlordSignature.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800">{agreement.landlordSignature.signatureName}</p>
                                    <span className="signed-badge">Digitally Signed</span>
                                </div>
                            ) : (
                                <div className="signature-seal pending">
                                    <span className="seal-text" style={{ color: '#ef4444' }}>PENDING</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-4">Tenant Signature</p>
                            {agreement.tenantSignature?.signed ? (
                                <div>
                                    <div className="signature-seal">
                                        <img src={agreement.tenantSignature.signatureImage} alt="Tenant Sig" className="seal-image" />
                                        <span className="seal-text">VERIFIED</span>
                                        <span className="seal-date">{new Date(agreement.tenantSignature.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800">{agreement.tenantSignature.signatureName}</p>
                                    <span className="signed-badge">Digitally Signed</span>
                                </div>
                            ) : (
                                <div className="signature-seal pending">
                                    <span className="seal-text" style={{ color: '#ef4444' }}>PENDING</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {isSigning && (
                        <div className="signing-form animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3>Digitally Sign Agreement</h3>

                            <label>Draw Your Signature Below</label>
                            <div className="signature-pad-container">
                                <canvas
                                    ref={canvasRef}
                                    width={500}
                                    height={150}
                                    className="signature-pad-canvas"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseOut={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />
                            </div>
                            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p className="sig-help-text">Use mouse or touch to draw your signature</p>
                                <button onClick={clearSignature} className="clear-sig-btn">Clear Canvas</button>
                            </div>

                            <label>Enter Full Legal Name</label>
                            <input
                                type="text"
                                value={signatureName}
                                onChange={(e) => setSignatureName(e.target.value)}
                                placeholder="Your full name as it appears on ID"
                            />

                            <div className="terms-checkbox-container">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={isAccepted}
                                    onChange={(e) => setIsAccepted(e.target.checked)}
                                />
                                <label htmlFor="acceptTerms">
                                    I certify that I am {signatureName || 'the resident'} and I agree to the terms and conditions outlined in this digital rental agreement.
                                </label>
                            </div>

                            <div className="flex gap-4 mt-6" style={{ display: 'flex', gap: '15px' }}>
                                <button className="sign-btn flex-1 py-3" onClick={handleSign} disabled={!isAccepted || !signatureName.trim()}>
                                    Confirm Digital Signature
                                </button>
                                <button className="cancel-btn px-6" onClick={() => setIsSigning(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="agreement-footer">
                    {!mySignature?.signed && !isSigning && (
                        <button className="sign-btn" onClick={() => setIsSigning(true)}>Open Signing Pad</button>
                    )}
                    <button className="cancel-btn" onClick={onClose}>Close Overview</button>
                </div>
            </div>
        </div>
    );
};

export default AgreementView;
