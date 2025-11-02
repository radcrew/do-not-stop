import { setApiBaseUrl, setTokenSuccessCallback, setStorageAdapter } from '@do-not-stop/shared-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:3001'; // Backend API URL

// Configure the shared auth API client
setApiBaseUrl(API_URL);

// Configure token storage callback
setTokenSuccessCallback(async (data) => {
    if (data.success) {
        await AsyncStorage.setItem('authToken', data.token);
    }
});

// Configure storage adapter
setStorageAdapter({
    getToken: () => AsyncStorage.getItem('authToken'),
    setToken: (token: string) => AsyncStorage.setItem('authToken', token),
    removeToken: () => AsyncStorage.removeItem('authToken'),
});

