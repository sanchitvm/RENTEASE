const AUTH_API_URL = "http://localhost:5000";
const PROPERTY_API_URL = "http://localhost:8080";
const CHAT_SERVER_URL = "http://localhost:7000";



export const API_URLS = {
    // Auth & Profile Routes (Port 5000)
    LOGIN: `${AUTH_API_URL}/login`,
    REGISTER: `${AUTH_API_URL}/register`,
    VERIFY_OTP: `${AUTH_API_URL}/verify-otp`,
    RESEND_OTP: `${AUTH_API_URL}/resend-otp`,
    FORGOT_PASSWORD: `${AUTH_API_URL}/forgot-password`,
    RESET_PASSWORD: `${AUTH_API_URL}/reset-password`,
    PROFILE: `${AUTH_API_URL}/profile`,
    PROFILE_UPDATE: `${AUTH_API_URL}/profile`,
    CONTACT: `${AUTH_API_URL}/api/contact`,
    REVIEWS: `${AUTH_API_URL}/api/reviews`,

    // Property & Agreement Routes (Port 8080)
    PROPERTIES: `${PROPERTY_API_URL}/properties`,
    ADD_PROPERTY: `${PROPERTY_API_URL}/add-property`,
    EDIT_PROPERTY: (id) => `${PROPERTY_API_URL}/property/${id}`,
    UPDATE_PROPERTY: (id) => `${PROPERTY_API_URL}/update-property/${id}`,
    DELETE_PROPERTY: (id) => `${PROPERTY_API_URL}/delete-property/${id}`,
    UPDATE_AGREEMENT: (id) => `${PROPERTY_API_URL}/update-property-agreement/${id}`,
    SIGN_AGREEMENT: (id) => `${PROPERTY_API_URL}/sign-agreement/${id}`,
    MY_BOOKINGS: (email) => `${PROPERTY_API_URL}/my-bookings?email=${email}`,
    MY_PROPERTIES: (email) => `${PROPERTY_API_URL}/my-properties?email=${email}`,
    AGREEMENTS: (email) => `${PROPERTY_API_URL}/agreements?email=${email}`,
    DELETE_AGREEMENT: (id) => `${PROPERTY_API_URL}/agreements/${id}`,
    GET_OR_CREATE_AGREEMENT: `${PROPERTY_API_URL}/get-or-create-agreement`,
    CREATE_PAYMENT_ORDER: `${PROPERTY_API_URL}/payment/create-order`,
    VERIFY_PAYMENT: `${PROPERTY_API_URL}/payment/verify-payment`,
    IMAGE_URL: (filename) => `${PROPERTY_API_URL}/img/${filename}`,
    PING_AUTH: `${AUTH_API_URL}/ping`,
    PING_PROPERTY: `${PROPERTY_API_URL}/ping`,
};

export const CHAT_URLS = {
    SERVER: CHAT_SERVER_URL,
    CHATS_LIST: (email) => `${CHAT_SERVER_URL}/chats/${email}`,
};
