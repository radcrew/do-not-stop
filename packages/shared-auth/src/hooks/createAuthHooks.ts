import { createAuthApiClient } from '../api';
import { createUseNonce } from './useNonce';
import { createUseVerifySignature, type VerifySignatureResult } from './useVerifySignature';

/**
 * Creates configured authentication hooks with API client and token storage
 * This consolidates the duplicated apiClient creation from frontend and mobile
 */
export const createAuthHooks = (
    apiUrl: string,
    onTokenSuccess?: (data: VerifySignatureResult) => void | Promise<void>
) => {
    // Create API client once - reused by both hooks
    const apiClient = createAuthApiClient(apiUrl);

    // Create hooks with the shared apiClient
    const useNonce = createUseNonce(apiClient);
    const useVerifySignature = createUseVerifySignature(apiClient, onTokenSuccess);

    return {
        useNonce,
        useVerifySignature,
    };
};

