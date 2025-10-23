import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppKit, useAccount } from '@reown/appkit-react-native';

export default function ConnectButton() {
    const { open, disconnect } = useAppKit();
    const { address, isConnected, chainId } = useAccount();

    if (isConnected) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Connected to: {chainId}</Text>
                <Text style={styles.address}>Address: {address}</Text>
                <TouchableOpacity style={styles.button} onPress={() => disconnect()}>
                    <Text style={styles.buttonText}>Disconnect</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableOpacity style={styles.button} onPress={() => open()}>
            <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
