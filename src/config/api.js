// Centralized API configuration
// This ensures we have a fallback and clear error messages if VITE_API_URL is not set

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error(
        '❌ VITE_API_URL environment variable is not set!\n' +
        'Please add VITE_API_URL to your Vercel Environment Variables.\n' +
        'Example: VITE_API_URL=https://your-backend.onrender.com'
    );
}

export const getApiUrl = () => {
    if (!API_URL) {
        throw new Error('API URL is not configured. Please set VITE_API_URL environment variable.');
    }
    return API_URL;
};

// Export for direct use where a fallback empty string is acceptable (like checking)
export const API_BASE_URL = API_URL || '';

export default API_URL;
