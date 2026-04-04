import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, ScrollView, View, Text } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppKit } from '@reown/appkit-react-native';
import { useAuth } from '@do-not-stop/shared-auth';
import { useAccount } from 'wagmi';
import ConnectButton from './components/ConnectButton';
import PetList from './components/PetList';
import { usePetsRead } from './hooks/usePetsRead';

function AppRoot() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppContent />
        </SafeAreaProvider>
    );
}

function AppContent() {
    const { isAuthenticated } = useAuth();
    const { isConnected } = useAccount();
    const petsRead = usePetsRead();
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    const onRefreshPets = useCallback(async () => {
        setRefreshing(true);
        try {
            await petsRead.refetchPetIds();
        } finally {
            setRefreshing(false);
        }
    }, [petsRead.refetchPetIds]);

    return (
        <View style={styles.mainContainer}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
                <Text style={styles.headerTitle}>Do Not Stop</Text>
                {(isAuthenticated || isConnected) && (
                    <View style={styles.walletSection}>
                        <ConnectButton compact={true} />
                    </View>
                )}
            </View>

            {/* Main: avoid nesting ScrollView with PetList’s own scroll + pull-to-refresh */}
            {isAuthenticated || isConnected ? (
                isConnected ? (
                    <View style={styles.authenticatedMain}>
                        <Text style={styles.authenticatedText}>Welcome back!</Text>
                        <PetList
                            pets={petsRead.pets}
                            petIds={petsRead.petIds}
                            isLoading={petsRead.isLoading}
                            contractError={petsRead.contractError}
                            isContractConfigured={petsRead.isContractConfigured}
                            onRefresh={onRefreshPets}
                            refreshing={refreshing}
                            getRarityName={petsRead.getRarityName}
                            getRarityColor={petsRead.getRarityColor}
                        />
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.authenticatedText}>Welcome back!</Text>
                        <Text style={styles.walletHint}>Connect a wallet to load your on-chain pets.</Text>
                    </ScrollView>
                )
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeText}>
                            Connect your wallet to start creating and managing your CryptoPets collection!
                        </Text>
                        <View style={styles.features}>
                            <View style={styles.feature}>
                                <Text style={styles.featureTitle}>🐾 Create pets</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureTitle}>⚔️ Battles</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureTitle}>🧬 Breeding</Text>
                            </View>
                        </View>
                        <View style={styles.connectButtonContainer}>
                            <ConnectButton />
                        </View>
                    </View>
                </ScrollView>
            )}

            {/* AppKit UI component for wallet connection */}
            <AppKit />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingHorizontal: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#667eea',
    },
    walletSection: {
        marginTop: 12,
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
    },
    welcomeSection: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        maxWidth: 600,
        lineHeight: 24,
    },
    features: {
        width: '100%',
        maxWidth: 900,
    },
    feature: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    connectButtonContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    authenticatedMain: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
        width: '100%',
    },
    walletHint: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    authenticatedText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },
});

export default AppRoot;
