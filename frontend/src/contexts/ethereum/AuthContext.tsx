import { createAuthProvider } from '@do-not-stop/shared-auth';
import { useAccount, useSignMessage } from 'wagmi';

import { useNonce } from '../../hooks/useNonce';
import { useVerifySignature } from '../../hooks/useVerifySignature';

// Web-specific storage adapter
const storageAdapter = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token: string) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
};

// Create the AuthProvider using the shared package
export const AuthProvider = createAuthProvider({
  useAccountHook: useAccount,
  useSignMessageHook: useSignMessage,
  useNonce,
  useVerifySignature,
  storageAdapter,
});
