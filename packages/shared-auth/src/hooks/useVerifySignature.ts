import { useMutation } from '@tanstack/react-query';
import { getAuthApiClient } from '../api';

interface VerifySignatureParams {
    address: string;
    signature: string;
    nonce: string;
    chainId: number;
}

interface VerifySignatureResult {
    success: boolean;
    token: string;
    user: {
        address: string;
        createdAt: string;
        lastLogin: string;
    };
}

// Global callback storage for token success handler
let tokenSuccessCallback: ((data: VerifySignatureResult) => void | Promise<void>) | undefined;

/**
 * Sets the token success callback for platform-specific token storage
 * Called automatically when verify succeeds
 */
export const setTokenSuccessCallback = (callback: (data: VerifySignatureResult) => void | Promise<void>): void => {
    tokenSuccessCallback = callback;
};

/**
 * Platform-agnostic hook for verifying signatures
 * Works in both web and mobile environments
 * Uses the shared API client - no need to pass apiClient
 */
export const useVerifySignature = () => {
    const apiClient = getAuthApiClient();

    return useMutation({
        mutationFn: async (params: VerifySignatureParams) => {
            const { data } = await apiClient.post('/api/auth/verify', {
                address: params.address,
                signature: params.signature,
                nonce: params.nonce,
                chainId: params.chainId,
            });
            return data;
        },
        onSuccess: async (data: VerifySignatureResult) => {
            if (data.success && tokenSuccessCallback) {
                await tokenSuccessCallback(data);
            }
        },
    });
};


