import { useMutation } from '@tanstack/react-query';

export interface VerifySignatureParams {
    address: string;
    signature: string;
    nonce: string;
    chainId: number;
}

export interface VerifySignatureResult {
    success: boolean;
    token: string;
    user: {
        address: string;
        createdAt: string;
        lastLogin: string;
    };
}

/**
 * Platform-agnostic hook for verifying signatures
 * Works in both web and mobile environments
 * onSuccess callback allows platform-specific token storage
 */
export const createUseVerifySignature = (
    apiClient: any,
    onSuccess?: (data: VerifySignatureResult) => void
) => {
    return () => {
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
            onSuccess: (data: VerifySignatureResult) => {
                if (data.success && onSuccess) {
                    onSuccess(data);
                }
            },
        });
    };
};

