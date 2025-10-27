import { createAuthProvider } from '@do-not-stop/shared-auth';
import { useAccount, useSignMessage } from 'wagmi';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNonce } from '../hooks/useSharedAuth';
import { useVerifySignature } from '../hooks/useSharedAuth';

// Mobile-specific storage adapter
const storageAdapter = {
    getToken: () => AsyncStorage.getItem('authToken'),
    setToken: (token: string) => AsyncStorage.setItem('authToken', token),
    removeToken: () => AsyncStorage.removeItem('authToken'),
};

// Create the AuthProvider using the shared package
export const AuthProvider = createAuthProvider({
    useAccountHook: useAccount,
    useSignMessageHook: useSignMessage,
    useNonce,
    useVerifySignature,
    storageAdapter,
});
