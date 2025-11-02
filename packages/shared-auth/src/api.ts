import axios, { type AxiosInstance, type AxiosError } from 'axios';

/**
 * Storage adapter interface for platform-specific token storage
 */
export interface StorageAdapter {
    getToken: () => Promise<string | null> | string | null;
    setToken: (token: string) => Promise<void> | void;
    removeToken: () => Promise<void> | void;
}

// Global storage adapter (shared between API client and AuthContext)
let storageAdapter: StorageAdapter | undefined;

/**
 * Sets the storage adapter for platform-specific token storage
 * Used by both API client interceptors and AuthContext
 */
export const setStorageAdapter = (adapter: StorageAdapter): void => {
    storageAdapter = adapter;
};

/**
 * Gets the storage adapter (for use by AuthContext and other hooks)
 */
export const getStorageAdapter = (): StorageAdapter | undefined => {
    return storageAdapter;
};

/**
 * Shared singleton API client for authentication endpoints
 * Created once and reused by all hooks
 */
const apiClient: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token interceptor
apiClient.interceptors.request.use(async (config) => {
    if (storageAdapter) {
        const token = await storageAdapter.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle unauthorized responses
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401 && storageAdapter) {
            await storageAdapter.removeToken();
        }
        return Promise.reject(error);
    }
);

/**
 * Sets the base URL for the shared API client
 * This allows frontend and mobile to configure the client dynamically
 */
export const setApiBaseUrl = (baseURL: string): void => {
    apiClient.defaults.baseURL = baseURL;
};

/**
 * Gets the shared API client instance
 * Hooks use this internally - no need to pass it around
 */
export const getAuthApiClient = (): AxiosInstance => {
    if (!apiClient.defaults.baseURL) {
        throw new Error('API base URL not set. Call setApiBaseUrl() before using auth hooks.');
    }
    return apiClient;
};

/**
 * Generic API client type
 */
export interface AuthApiClient {
    get<T>(url: string): Promise<{ data: T }>;
    post<T>(url: string, data?: any): Promise<{ data: T }>;
}


