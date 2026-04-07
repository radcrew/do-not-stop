import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { Pet } from '@shared/core';

type Props = {
    pets: Pet[];
    petIds: bigint[];
    isLoading: boolean;
    contractError: Error | null | undefined;
    isContractConfigured: boolean;
    onRefresh: () => void;
    refreshing: boolean;
    getRarityName: (rarity: number) => string;
    getRarityColor: (rarity: number) => string;
};

export default function PetList({
    pets,
    petIds,
    isLoading,
    contractError,
    isContractConfigured,
    onRefresh,
    refreshing,
    getRarityName,
    getRarityColor,
}: Props) {
    if (!isContractConfigured) {
        return (
            <View style={styles.centered}>
                <Text style={styles.hintTitle}>Contract not configured</Text>
                <Text style={styles.hintBody}>
                    Set CONTRACT_ADDRESS in your mobile `.env` to match the deployed CryptoPets address (same as
                    frontend `VITE_CONTRACT_ADDRESS`), then restart Metro.
                </Text>
            </View>
        );
    }

    if (contractError) {
        const message =
            contractError instanceof Error ? contractError.message : String(contractError);
        return (
            <View style={styles.centered}>
                <Text style={styles.errorTitle}>Could not load pets</Text>
                <Text style={styles.errorBody}>{message}</Text>
                <Text style={styles.hintBody}>
                    Check that your wallet network matches the contract (e.g. Hardhat Local for local deploy).
                </Text>
            </View>
        );
    }

    if (isLoading && pets.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Loading your pets…</Text>
            </View>
        );
    }

    if (pets.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.centered}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.emptyTitle}>No pets yet</Text>
                <Text style={styles.hintBody}>
                    Tap Create to mint a pet, or use Refresh / pull down to reload from the chain.
                </Text>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            style={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.sectionTitle}>Your pets</Text>
            {pets.map((pet, index) => {
                const id = petIds[index];
                const rarityColor = getRarityColor(pet.rarity);
                return (
                    <View key={id !== undefined ? id.toString() : `pet-${index}`} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.petName}>{pet.name}</Text>
                            <View style={[styles.rarityBadge, { borderColor: rarityColor }]}>
                                <Text style={[styles.rarityText, { color: rarityColor }]}>
                                    {getRarityName(pet.rarity)}
                                </Text>
                            </View>
                        </View>
                        {id !== undefined && <Text style={styles.meta}>ID #{id.toString()}</Text>}
                        <Text style={styles.meta}>Level {pet.level}</Text>
                        <Text style={styles.meta}>
                            W {pet.winCount} · L {pet.lossCount}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        alignSelf: 'stretch',
        width: '100%',
    },
    centered: {
        paddingVertical: 24,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    card: {
        backgroundColor: '#fafafa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    petName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
        flex: 1,
    },
    rarityBadge: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    rarityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    meta: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    hintTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    hintBody: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#c0392b',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorBody: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 8,
    },
});
