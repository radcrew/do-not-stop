import { useQuery } from '@tanstack/react-query';
import { getAuthApiClient } from '../api';

/**
 * Platform-agnostic hook for fetching nonces
 * Works in both web and mobile environments
 * Uses the shared API client - no need to pass apiClient
 */
export const useNonce = () => {
    const apiClient = getAuthApiClient();

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
