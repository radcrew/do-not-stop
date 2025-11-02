import { createAuthHooks } from '@do-not-stop/shared-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Create hooks with mobile-specific token storage
const onTokenSuccess = async (data: any) => {
    if (data.success) {
        await AsyncStorage.setItem('authToken', data.token);
    }
};

// Export initialized hooks - apiClient is created internally
export const { useNonce, useVerifySignature } = createAuthHooks(API_URL, onTokenSuccess);

