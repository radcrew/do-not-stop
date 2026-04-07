import { setTokenSuccessCallback, setStorageAdapter } from '@shared/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL as ENV_API_URL } from '@env';

export const API_URL = ENV_API_URL;

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

