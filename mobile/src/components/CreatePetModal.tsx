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
import { neon, neonGlow } from '../theme/neon';

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

    const handleSubmit = () => {
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
                            placeholderTextColor={neon.textDim}
                            maxLength={20}
                            editable={!busy}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={[styles.button, !canSubmit && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={!canSubmit}
                        >
                            {busy ? (
                                <View style={styles.buttonInner}>
                                    <ActivityIndicator color={neon.cyan} size="small" style={styles.spinner} />
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
        backgroundColor: 'rgba(5, 5, 13, 0.88)',
    },
    sheetOuter: {
        zIndex: 2,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    sheet: {
        backgroundColor: neon.bgPanel,
        borderRadius: 16,
        padding: 20,
        maxWidth: 400,
        borderWidth: 1,
        borderColor: neon.border,
        ...neonGlow(neon.cyan, 16, 0.45),
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: neon.text,
        flex: 1,
        letterSpacing: 0.5,
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
        color: neon.magenta,
        lineHeight: Platform.OS === 'ios' ? 30 : 26,
    },
    subtitle: {
        fontSize: 14,
        color: neon.textMuted,
        marginBottom: 12,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(0, 245, 255, 0.35)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: neon.text,
        backgroundColor: neon.bgInput,
        marginBottom: 12,
    },
    button: {
        backgroundColor: neon.bgCard,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: neon.cyan,
        ...neonGlow(neon.cyan, 10, 0.4),
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
        color: neon.cyan,
        fontSize: 16,
        fontWeight: '800',
    },
    error: {
        marginTop: 10,
        fontSize: 13,
        color: neon.danger,
    },
    txHint: {
        marginTop: 8,
        fontSize: 12,
        color: neon.textMuted,
    },
});
