import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * Shared singleton QueryClient with shared defaults
 * Used by both frontend and mobile apps
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error) => {
                // Don't retry on 401 (unauthorized)
                if (error instanceof AxiosError && error.response?.status === 401) {
                    return false;
                }
                return failureCount < 3;
            },
        },
        mutations: {
            retry: false, // Don't retry mutations by default
        },
    },
});
