import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useNonce } from '../hooks/useNonce';
import { useVerifySignature } from '../hooks/useVerifySignature';
import { getStorageAdapter } from '../api';

interface User {
    address: string;
    createdAt: string;
    lastLogin: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    logout: () => Promise<void> | void;
    signAndLogin: () => Promise<void> | void;
    isSigning: boolean;
    isVerifying: boolean;
    isNonceLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { address, isConnected, chainId } = useAccount();
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [pendingNonce, setPendingNonce] = useState<string | null>(null);

    // React Query hooks
    const { refetch: getNonce, isLoading: isNonceLoading } = useNonce();
    const {
        mutate: verifySignature,
        isPending: isVerifying,
        data: authData,
        error: verifyError
    } = useVerifySignature();

    const {
        signMessage,
        isPending: isSigning,
        data: signature,
        error: signError
    } = useSignMessage();

    useEffect(() => {
        const isWalletConnected = isConnected && !!address;

        // If wallet is disconnected, clear authentication state and token
        if (!isWalletConnected) {
            setAuthenticated(false);
            setUser(null);
            const adapter = getStorageAdapter();
            if (adapter) {
                adapter.removeToken();
            }
            return;
        }
    }, [address, isConnected]);

    // Handle signature completion
    useEffect(() => {
        if (signature && pendingNonce && address && chainId) {
            verifySignature({
                address,
                signature,
                nonce: pendingNonce,
                chainId,
            });
        }
    }, [signature, pendingNonce, address, chainId, verifySignature]);

    // Handle authentication success
    useEffect(() => {
        if (authData?.success) {
            setAuthenticated(true);
            setUser(authData.user);
            setPendingNonce(null);
        }
    }, [authData]);

    // Handle verification errors
    useEffect(() => {
        if (verifyError) {
            setPendingNonce(null);
            console.error('Authentication failed:', verifyError);
        }
    }, [verifyError]);

    // Handle signing errors
    useEffect(() => {
        if (signError) {
            setPendingNonce(null);
            console.error('Signing failed:', signError);
        }
    }, [signError]);

    const logout = async () => {
        const adapter = getStorageAdapter();
        if (adapter) {
            await adapter.removeToken();
        }
        setAuthenticated(false);
        setUser(null);
    };

    const signAndLogin = async () => {
        if (!address) return;

        try {
            // Get nonce from backend
            const { data } = await getNonce();
            const { nonce } = data;

            // Store nonce for later use
            setPendingNonce(nonce);

            // Create message to sign
            const message = `Sign this message to authenticate: ${nonce}`;

            // Trigger the signing process
            signMessage({ message });
        } catch (error) {
            console.error('Error getting nonce:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            logout,
            signAndLogin,
            isSigning,
            isVerifying,
            isNonceLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export type { AuthContextType, User };

