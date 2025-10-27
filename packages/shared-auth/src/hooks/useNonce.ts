import { useQuery } from '@tanstack/react-query';

/**
 * Platform-agnostic hook for fetching nonces
 * Works in both web and mobile environments
 */
export const createUseNonce = (apiClient: any) => {
    return () => {
        return useQuery({
            queryKey: ['nonce'],
            queryFn: async () => {
                const { data } = await apiClient.get('/api/auth/nonce');
                return data;
            },
            enabled: false, // Only run when manually triggered
            staleTime: 0, // Always fetch fresh nonce
        });
    };
};

