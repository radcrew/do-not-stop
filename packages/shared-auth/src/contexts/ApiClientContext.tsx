import React, {
    createContext,
    useContext,
    useMemo,
    type ReactNode,
} from 'react';
import type { AxiosInstance } from 'axios';
import { createAuthApiClient } from '../api';

const ApiClientContext = createContext<AxiosInstance | undefined>(undefined);

export const useApiClient = (): AxiosInstance => {
    const client = useContext(ApiClientContext);
    if (!client) {
        throw new Error('useApiClient must be used within an ApiClientProvider');
    }
    return client;
};

export const ApiClientProvider = ({
    baseURL,
    children,
}: {
    baseURL: string;
    children: ReactNode;
}) => {
    const apiClient = useMemo(() => createAuthApiClient(baseURL), [baseURL]);

    return (
        <ApiClientContext.Provider value={apiClient}>
            {children}
        </ApiClientContext.Provider>
    );
};
