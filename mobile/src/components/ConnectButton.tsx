import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppKit } from '@reown/appkit-react-native';
import { useAccount } from 'wagmi';
import { useAuth } from '@do-not-stop/shared-auth';

interface ConnectButtonProps {
    compact?: boolean;
}

export default function ConnectButton({ compact = false }: ConnectButtonProps = {}) {
    const { open, disconnect } = useAppKit();
    const { address, isConnected, chainId } = useAccount();
    const {
        isAuthenticated,
        user,
        signAndLogin,
        logout,
        isSigning,
        isVerifying,
        isNonceLoading
    } = useAuth();

    if (!isConnected) {
        return (
            <TouchableOpacity style={styles.connectButton} onPress={() => open()}>
                <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </TouchableOpacity>
        );
    }

    const isLoading = isSigning || isVerifying || isNonceLoading;

    if (compact) {
        return (
            <TouchableOpacity style={styles.compactButton} onPress={() => open()}>
                <Text style={styles.compactButtonText} numberOfLines={1} ellipsizeMode="middle">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Connected to Chain: {chainId}</Text>
            <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
                Address: {address}
            </Text>

            {isAuthenticated ? (
                <View style={styles.authSection}>
                    <View style={styles.authStatus}>
                        <View style={styles.authenticatedBadge} />
                        <Text style={styles.authText}>Authenticated</Text>
                    </View>
                    {user && (
                        <Text style={styles.userInfo}>
                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => logout()}
                    >
                        <Text style={styles.secondaryButtonText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.disconnectButton]}
                        onPress={() => disconnect()}
                    >
                        <Text style={styles.buttonText}>Disconnect Wallet</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.authSection}>
                    <View style={styles.authStatus}>
                        <View style={styles.unauthenticatedBadge} />
                        <Text style={styles.authText}>Not Authenticated</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={() => signAndLogin()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>
                                    {isSigning ? 'Signing...' : isVerifying ? 'Verifying...' : 'Loading...'}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>Sign & Login</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => disconnect()}
                    >
                        <Text style={styles.secondaryButtonText}>Disconnect Wallet</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    connectButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#667eea',
        borderRadius: 12,
        minWidth: 140,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    connectButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    compactButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#667eea',
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    compactButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    container: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        margin: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    address: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    authSection: {
        marginTop: 8,
    },
    authStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    authenticatedBadge: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#34C759',
        marginRight: 8,
    },
    unauthenticatedBadge: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF9500',
        marginRight: 8,
    },
    authText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    userInfo: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#999',
        opacity: 0.6,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disconnectButton: {
        backgroundColor: '#FF3B30',
        marginTop: 8,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
