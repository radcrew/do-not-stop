import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    isContractConfigured: boolean;
    createRandomPet: (name: string) => void;
    isWritePending: boolean;
    writeError: Error | null | undefined;
    isConfirming: boolean;
    txHash: `0x${string}` | undefined;
};

export default function CreatePetModal({
    visible,
    onClose,
    isContractConfigured,
    createRandomPet,
    isWritePending,
    writeError,
    isConfirming,
    txHash,
}: Props) {
    const [name, setName] = useState('');
    const prevTxHash = useRef<typeof txHash>(undefined);
    const { width } = useWindowDimensions();
    const cardWidth = Math.min(400, width - 48);

    useEffect(() => {
        if (visible) {
            setName('');
        }
    }, [visible]);

    useEffect(() => {
        if (prevTxHash.current && !txHash) {
            setName('');
            onClose();
        }
        prevTxHash.current = txHash;
    }, [txHash, onClose]);

    const busy = isWritePending || isConfirming;
    const canSubmit = isContractConfigured && name.trim().length > 0 && !busy;

    const onSubmit = () => {
        const trimmed = name.trim();
        if (!trimmed) {
            return;
        }
        createRandomPet(trimmed);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                if (!busy) {
                    onClose();
                }
            }}
        >
            <View style={styles.modalRoot}>
                <Pressable
                    style={[StyleSheet.absoluteFillObject, styles.backdrop]}
                    onPress={busy ? undefined : onClose}
                    accessibilityLabel="Close create pet modal"
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.sheetOuter}
                >
                    <View style={[styles.sheet, { width: cardWidth }]}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Create a pet</Text>
                            <Pressable
                                onPress={busy ? undefined : onClose}
                                hitSlop={8}
                                style={styles.closeBtn}
                                disabled={busy}
                            >
                                <Text style={styles.closeBtnText}>×</Text>
                            </Pressable>
                        </View>
                        <Text style={styles.subtitle}>
                            Give your pet a name and mint it on-chain (same as the web app create flow).
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Pet name"
                            placeholderTextColor="#999"
                            maxLength={20}
                            editable={!busy}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={[styles.button, !canSubmit && styles.buttonDisabled]}
                            onPress={onSubmit}
                            disabled={!canSubmit}
                        >
                            {busy ? (
                                <View style={styles.buttonInner}>
                                    <ActivityIndicator color="#fff" size="small" style={styles.spinner} />
                                    <Text style={styles.buttonText}>
                                        {isWritePending ? 'Confirm in wallet…' : 'Confirming…'}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.buttonText}>Create pet</Text>
                            )}
                        </TouchableOpacity>
                        {writeError ? (
                            <Text style={styles.error}>
                                {writeError instanceof Error ? writeError.message : String(writeError)}
                            </Text>
                        ) : null}
                        {txHash && !writeError ? (
                            <Text style={styles.txHint} numberOfLines={1}>
                                {isConfirming ? 'Transaction submitted…' : 'Done — refreshing list…'}
                            </Text>
                        ) : null}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalRoot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheetOuter: {
        zIndex: 2,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    sheet: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 25,
        elevation: 12,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        flex: 1,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        fontSize: 26,
        color: '#666',
        lineHeight: Platform.OS === 'ios' ? 30 : 26,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#222',
        backgroundColor: '#fafafa',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#667eea',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.55,
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spinner: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        marginTop: 10,
        fontSize: 13,
        color: '#c0392b',
    },
    txHint: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
    },
});
