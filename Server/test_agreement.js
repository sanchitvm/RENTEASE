const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
const TEST_PROPERTY_ID = '67bc582d973163be60235ed1'; // Example ID from existing data if possible, or dummy
const TENANT_EMAIL = 'tenant@test.com';
const LANDLORD_EMAIL = 'landlord@test.com';

async function runTests() {
    console.log('--- Starting Agreement System Verification ---');

    try {
        // 1. Get or Create Agreement (Simulating "Rent Now" click)
        console.log('1. Getting or Creating Agreement...');
        const getRes = await axios.post(`${BASE_URL}/get-or-create-agreement`, {
            propertyId: TEST_PROPERTY_ID,
            tenantEmail: TENANT_EMAIL,
            landlordEmail: LANDLORD_EMAIL,
            rentAmount: 15000
        });
        const agreementId = getRes.data.data._id;
        console.log('Agreement Retrieved/Created:', agreementId);

        // 2. Fetch Agreements for Tenant
        console.log('2. Fetching Agreements for Tenant...');
        const tenantAgreements = await axios.get(`${BASE_URL}/agreements?email=${TENANT_EMAIL}`);
        console.log(`Found ${tenantAgreements.data.length} agreements for tenant.`);

        // 3. Sign Agreement as Tenant
        console.log('3. Signing Agreement as Tenant...');
        const signTenantRes = await axios.patch(`${BASE_URL}/sign-agreement/${agreementId}`, {
            email: TENANT_EMAIL,
            role: 'tenant'
        });
        console.log('Status after tenant sign:', signTenantRes.data.data.status);

        // 4. Sign Agreement as Landlord
        console.log('4. Signing Agreement as Landlord...');
        const signLandlordRes = await axios.patch(`${BASE_URL}/sign-agreement/${agreementId}`, {
            email: LANDLORD_EMAIL,
            role: 'landlord'
        });
        console.log('Status after landlord sign:', signLandlordRes.data.data.status);

        console.log('--- Verification Completed Successfully ---');
    } catch (error) {
        console.error('--- Verification Failed ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

runTests();
