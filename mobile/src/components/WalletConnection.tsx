import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useDynamicContext } from '@dynamic-labs/sdk-react-native';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const WalletConnection: React.FC = () => {
    const { isLoggedIn, handleLogOut, setShowAuthFlow } = useDynamicContext();
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    const handleConnect = async () => {
        try {
            if (connectors.length > 0) {
                await connect({ connector: connectors[0] });
            } else {
                setShowAuthFlow(true);
            }
        } catch (error) {
            Alert.alert('Connection Error', 'Failed to connect wallet');
            console.error('Wallet connection error:', error);
        }
    };

    const handleDisconnect = async () => {
        try {
            if (isLoggedIn) {
                handleLogOut();
            }
            if (isConnected) {
                disconnect();
            }
        } catch (error) {
            Alert.alert('Disconnect Error', 'Failed to disconnect wallet');
            console.error('Wallet disconnect error:', error);
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CryptoZombies Mobile</Text>

            {isConnected || isLoggedIn ? (
                <View style={styles.connectedContainer}>
                    <Text style={styles.statusText}>✅ Wallet Connected</Text>
                    {address && (
                        <Text style={styles.addressText}>
                            Address: {formatAddress(address)}
                        </Text>
                    )}
                    {chain && (
                        <Text style={styles.chainText}>
                            Network: {chain.name}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={styles.disconnectButton}
                        onPress={handleDisconnect}
                    >
                        <Text style={styles.buttonText}>Disconnect</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.disconnectedContainer}>
                    <Text style={styles.statusText}>❌ Wallet Not Connected</Text>
                    <TouchableOpacity
                        style={styles.connectButton}
                        onPress={handleConnect}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Connect Wallet</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    connectedContainer: {
        alignItems: 'center',
        backgroundColor: '#e8f5e8',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    disconnectedContainer: {
        alignItems: 'center',
        backgroundColor: '#ffe8e8',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#f44336',
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    addressText: {
        fontSize: 16,
        fontFamily: 'monospace',
        marginBottom: 5,
        color: '#666',
    },
    chainText: {
        fontSize: 16,
        marginBottom: 15,
        color: '#666',
    },
    connectButton: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 150,
        alignItems: 'center',
    },
    disconnectButton: {
        backgroundColor: '#f44336',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default WalletConnection;

