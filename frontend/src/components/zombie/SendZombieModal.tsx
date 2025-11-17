import React, { useState } from 'react';
import { useZombiesContract } from '../../hooks/useZombiesContract';
import TransactionStatus from '../ui/TransactionStatus';
import './SendZombieModal.css';

interface SendZombieModalProps {
    isOpen: boolean;
    onClose: () => void;
    zombie: {
        name: string;
        dna: bigint;
        level: number;
        rarity: number;
    };
    zombieId: bigint;
}

const SendZombieModal: React.FC<SendZombieModalProps> = ({
    isOpen,
    onClose,
    zombie,
    zombieId,
}) => {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | undefined>(undefined);
    const { transferZombie, isPending, writeError, refetchZombieIds, hash } = useZombiesContract();

    const validateAddress = (address: string): boolean => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const handleSend = async () => {
        setError(null);

        if (!recipientAddress) {
            setError('Please enter a recipient address');
            return;
        }

        if (!validateAddress(recipientAddress)) {
            setError('Please enter a valid Ethereum address');
            return;
        }

        if (recipientAddress.toLowerCase() === window.ethereum?.selectedAddress?.toLowerCase()) {
            setError('You cannot send a zombie to yourself');
            return;
        }

        try {
            setIsConfirming(true);
            await transferZombie(recipientAddress, zombieId);
        } catch (err) {
            setError('Failed to send zombie. Please try again.');
            setIsConfirming(false);
        }
    };

    const handleClose = () => {
        if (!isConfirming && !isPending) {
            setRecipientAddress('');
            setError(null);
            setTxHash(undefined);
            onClose();
        }
    };

    React.useEffect(() => {
        if (hash) {
            setTxHash(hash);
        }
    }, [hash]);

    const handleTransactionComplete = async () => {
        await refetchZombieIds();
        setRecipientAddress('');
        setIsConfirming(false);
        setError(null);
        setTxHash(undefined);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Send Zombie</h2>
                    <button
                        className="close-button"
                        onClick={handleClose}
                        disabled={isConfirming || isPending}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="zombie-preview">
                        <h3>{zombie.name}</h3>
                        <div className="zombie-details">
                            <p><strong>Level:</strong> {zombie.level}</p>
                            <p><strong>DNA:</strong> {zombie.dna.toString()}</p>
                            <p><strong>Rarity:</strong> {zombie.rarity}</p>
                        </div>
                    </div>

                    <div className="recipient-input">
                        <label htmlFor="recipient">Recipient Address:</label>
                        <input
                            id="recipient"
                            type="text"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            placeholder="0x..."
                            disabled={isConfirming || isPending}
                            className={error ? 'error' : ''}
                        />
                        {error && <p className="error-message">{error}</p>}
                    </div>

                    {writeError && (
                        <div className="error-container">
                            <p>❌ Transaction failed: {writeError.message}</p>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            className="cancel-button"
                            onClick={handleClose}
                            disabled={isConfirming || isPending}
                        >
                            Cancel
                        </button>
                        <button
                            className="send-button"
                            onClick={handleSend}
                            disabled={!recipientAddress || isConfirming || isPending}
                        >
                            {isConfirming || isPending ? 'Sending...' : 'Send Zombie'}
                        </button>
                    </div>
                </div>

                <TransactionStatus
                    hash={txHash}
                    onComplete={handleTransactionComplete}
                    onError={(err) => {
                        setError(err.message);
                        setIsConfirming(false);
                        setTxHash(undefined);
                    }}
                />
            </div>
        </div>
    );
};

export default SendZombieModal;
