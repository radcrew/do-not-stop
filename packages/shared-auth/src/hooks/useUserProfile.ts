import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { getAuthApiClient, getStorageAdapter } from '../api';

/**
 * Gets the user profile from the backend
 * Uses the shared API client and storage adapter
 */
export const useUserProfile = () => {
    const apiClient = getAuthApiClient();
    const [hasToken, setHasToken] = useState(false);

    // Check if token exists (handles both sync and async storage adapters)
    useEffect(() => {
        const checkToken = async () => {
            const storageAdapter = getStorageAdapter();
            if (!storageAdapter) {
                setHasToken(false);
                return;
            }

            try {
                const tokenResult = storageAdapter.getToken();
                const token = tokenResult instanceof Promise ? await tokenResult : tokenResult;
                setHasToken(!!token);
            } catch {
                setHasToken(false);
            }
        };

        checkToken();
    }, []);

    return useQuery({
        queryKey: ['user', 'profile'],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/protected/profile');
            return data;
        },
        enabled: hasToken,
        retry: (failureCount, error) => {
            // Don't retry on 401 (unauthorized)
            if (error instanceof AxiosError && error.response?.status === 401) {
                const adapter = getStorageAdapter();
                if (adapter) {
                    // Fire and forget token removal
                    const removeResult = adapter.removeToken();
                    if (removeResult instanceof Promise) {
                        removeResult.catch(() => { });
                    }
                }
                return false;
            }
            return failureCount < 3;
        },
    });
};

