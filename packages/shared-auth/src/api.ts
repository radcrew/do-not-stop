import axios, { AxiosInstance } from 'axios';

/**
 * Creates a configured API client for authentication endpoints
 * This is platform-agnostic and can be used in both web and mobile
 */
export const createAuthApiClient = (baseURL: string): AxiosInstance => {
    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return client;
};

/**
 * Generic API client type
 */
export interface AuthApiClient {
    get<T>(url: string): Promise<{ data: T }>;
    post<T>(url: string, data?: any): Promise<{ data: T }>;
}


