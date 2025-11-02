import { createAuthHooks } from '@do-not-stop/shared-auth';
import { API_URL } from '../config';

// Create hooks with web-specific token storage
const onTokenSuccess = (data: any) => {
    if (data.success) {
        localStorage.setItem('authToken', data.token);
    }
};

// Export initialized hooks - apiClient is created internally
export const { useNonce, useVerifySignature } = createAuthHooks(API_URL, onTokenSuccess);

