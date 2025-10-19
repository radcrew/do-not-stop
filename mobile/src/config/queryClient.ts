import { QueryClient } from '@tanstack/react-query';

// Create query client for mobile with optimized settings
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error) => {
                // Don't retry on 401 (unauthorized) errors
                if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
                    return false;
                }
                return failureCount < 3;
            },
            // Reduce network requests on mobile
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: false, // Don't retry mutations by default
        },
    },
});

