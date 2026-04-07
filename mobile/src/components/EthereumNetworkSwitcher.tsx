import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    Switch,
    useWindowDimensions,
    Platform,
} from 'react-native';
import { useAccount, useSwitchChain } from 'wagmi';
import { getEvmNetworkMeta, getEvmSwitcherChains, EVM_SWITCHER_CHAINS } from '../constants/ethereumNetworks';

/**
 * Mirrors the web `EthereumNetworkSwitcher` (compact trigger + “Select Network” modal,
 * testnet toggle, chain rows with active checkmark).
 */
export default function EthereumNetworkSwitcher() {
    const { chain } = useAccount();
    const { switchChain, isPending, error: switchError } = useSwitchChain();
    const [isOpen, setIsOpen] = useState(false);
    const [showTestnets, setShowTestnets] = useState(() => {
        if (!chain) {
            return false;
        }
        return EVM_SWITCHER_CHAINS.some((c) => c.chain.id === chain.id && c.isTestnet);
    });

    const { width } = useWindowDimensions();
    const modalWidth = Math.min(400, width - 40);

    if (!chain) {
        return null;
    }

    const visibleChains = getEvmSwitcherChains(showTestnets);
    const currentMeta = getEvmNetworkMeta(chain.id);

    const handleNetworkSelect = (chainId: number) => {
        switchChain({ chainId });
        setIsOpen(false);
    };

    return (
        <View style={styles.wrap}>
            {switchError ? (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText} numberOfLines={3}>
                        Error: {switchError.message}
                    </Text>
                </View>
            ) : null}

            <Pressable
                style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed, isPending && styles.triggerDisabled]}
                onPress={() => setIsOpen(true)}
                disabled={isPending}
            >
                <View style={styles.triggerInfo}>
                    <Text style={styles.triggerName} numberOfLines={1}>
                        {isPending ? 'Switching...' : currentMeta?.name ?? 'Unknown'}
                    </Text>
                </View>
                <Text style={styles.triggerArrow}>▼</Text>
            </Pressable>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.modalRoot}>
                    <Pressable
                        style={[StyleSheet.absoluteFillObject, styles.modalBackdrop]}
                        onPress={() => setIsOpen(false)}
                        accessibilityLabel="Close network modal"
                    />
                    <View style={[styles.modalCard, { width: modalWidth }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Network</Text>
                            <View style={styles.modalHeaderRight}>
                                <View style={styles.testnetRow}>
                                    <Switch
                                        value={showTestnets}
                                        onValueChange={setShowTestnets}
                                        disabled={isPending}
                                        trackColor={{ false: '#e0e0e0', true: '#ffb74d' }}
                                        thumbColor={Platform.OS === 'android' ? (showTestnets ? '#e65100' : '#f4f3f4') : undefined}
                                    />
                                    <Text style={styles.testnetLabel}>Testnets</Text>
                                </View>
                                <Pressable
                                    style={styles.closeBtn}
                                    onPress={() => setIsOpen(false)}
                                    hitSlop={8}
                                >
                                    <Text style={styles.closeBtnText}>×</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.modalBody}>
                            {visibleChains.map(({ chain: ch, name, symbol, isTestnet }) => {
                                const active = chain.id === ch.id;
                                return (
                                    <Pressable
                                        key={ch.id}
                                        style={({ pressed }) => [
                                            styles.option,
                                            isTestnet ? styles.optionTestnet : null,
                                            active && styles.optionActive,
                                            active && isTestnet && styles.optionTestnetActive,
                                            pressed && styles.optionPressed,
                                        ]}
                                        onPress={() => handleNetworkSelect(ch.id)}
                                        disabled={isPending}
                                    >
                                        <View style={styles.optionInfo}>
                                            <Text
                                                style={[
                                                    styles.optionName,
                                                    active && styles.optionNameActive,
                                                    isTestnet && styles.optionNameTestnet,
                                                ]}
                                            >
                                                {name}
                                            </Text>
                                            <Text style={styles.optionSymbol}>{symbol}</Text>
                                        </View>
                                        {active ? <Text style={styles.check}>✓</Text> : null}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        position: 'relative',
        alignSelf: 'center',
        marginRight: 8,
    },
    errorBanner: {
        alignSelf: 'stretch',
        maxWidth: 280,
        marginBottom: 8,
        backgroundColor: '#fee',
        borderWidth: 1,
        borderColor: '#fcc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    errorText: {
        fontSize: 11,
        color: '#c33',
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 120,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    triggerPressed: {
        borderColor: '#007bff',
        backgroundColor: '#f8f9ff',
    },
    triggerDisabled: {
        opacity: 0.6,
        backgroundColor: '#f5f5f5',
    },
    triggerInfo: {
        flexShrink: 1,
    },
    triggerName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    triggerArrow: {
        fontSize: 10,
        color: '#666',
        marginLeft: 8,
    },
    modalRoot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
        zIndex: 2,
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 25,
        elevation: 12,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f8f9fa',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    modalHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    testnetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    testnetLabel: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        fontSize: 24,
        color: '#666',
        lineHeight: Platform.OS === 'ios' ? 28 : 24,
    },
    modalBody: {
        padding: 16,
        maxHeight: 360,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    optionTestnet: {
        borderColor: '#ff9800',
    },
    optionActive: {
        borderColor: '#9945ff',
        backgroundColor: '#e3f2fd',
    },
    optionTestnetActive: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
    },
    optionPressed: {
        opacity: 0.9,
        transform: [{ translateY: -1 }],
    },
    optionInfo: {
        flex: 1,
    },
    optionName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    optionNameActive: {
        color: '#1976d2',
    },
    optionNameTestnet: {
        color: '#e65100',
    },
    optionSymbol: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
        marginTop: 4,
    },
    check: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4caf50',
        marginLeft: 8,
    },
});
