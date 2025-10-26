import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';

// Verify signature and get JWT token
export const useVerifySignature = () => {
  return useMutation({
    mutationFn: async ({ address, signature, nonce, chainId }: {
      address: string;
      signature: string;
      nonce: string;
      chainId: number;
    }) => {
      const { data } = await apiClient.post('/api/auth/verify', {
        address,
        signature,
        nonce,
        chainId,
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem('authToken', data.token);
      }
    },
  });
};

