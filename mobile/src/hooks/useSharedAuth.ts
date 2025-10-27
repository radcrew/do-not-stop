import { createAuthApiClient, createUseNonce, createUseVerifySignature } from '@do-not-stop/shared-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Create API client for mobile
const apiClient = createAuthApiClient(API_URL);

// Create hooks with mobile-specific token storage
const onTokenSuccess = async (data: any) => {
    if (data.success) {
        await AsyncStorage.setItem('authToken', data.token);
    }
};

// Export initialized hooks for mobile
export const useNonce = createUseNonce(apiClient);
export const useVerifySignature = createUseVerifySignature(apiClient, onTokenSuccess);

