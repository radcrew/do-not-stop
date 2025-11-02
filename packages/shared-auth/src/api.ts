import axios, { type AxiosInstance } from 'axios';

/**
 * Shared singleton API client for authentication endpoints
 * Created once and reused by all hooks
 */
const apiClient: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

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


