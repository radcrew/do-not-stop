import { createAuthApiClient, createUseNonce, createUseVerifySignature } from '@do-not-stop/shared-auth';
import { API_URL } from '../config';

// Create API client for web
const apiClient = createAuthApiClient(API_URL);

// Create hooks with web-specific token storage
const onTokenSuccess = (data: any) => {
    if (data.success) {
        localStorage.setItem('authToken', data.token);
    }
};

// Export initialized hooks for web frontend
export const useNonce = createUseNonce(apiClient);
export const useVerifySignature = createUseVerifySignature(apiClient, onTokenSuccess);

