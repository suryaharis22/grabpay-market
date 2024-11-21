// utils/auth.js

import axios from 'axios';

export async function validateAccessToken(accessToken) {
    try {
        const response = await axios.get(`https://api.bundling.nuncorp.id/api/v1/auth/profile/fetch`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Token validation response:', response.data.body);

        return response.data.body; // Return user profile data
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Token expired or invalid, status 401:', error.response.data);
            throw new Error('TokenExpired'); // Specific error for expired token
        }
        console.error('Token validation error:', error.response?.data || error.message, 'Token:', accessToken);
        throw new Error('Unauthorized'); // General error for other issues
    }
}
