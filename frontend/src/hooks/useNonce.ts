import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

// Get nonce for signing
export const useNonce = () => {
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

