import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionStatus from '../../ui/TransactionStatus';
import { usePetsContract } from '../../../hooks/usePetsContract';
import { DASHBOARD_HOME } from '../../../constants/interactionRoutes';
import { getReadyPets } from '../../../utils/readyPets';
import { useWriteContractErrorState } from '../../../hooks/useWriteContractErrorState';

export type BreedPanelProps = {
    isStandaloneView: boolean;
};

const BreedPanel: React.FC<BreedPanelProps> = ({ isStandaloneView }) => {
    const navigate = useNavigate();
    const { createPetFromDNA, petIds, pets, isReady, hash, isPending, writeError, refetchPetIds } = usePetsContract();
    const readyPets = useMemo(() => getReadyPets(petIds, pets, isReady), [petIds, pets, isReady]);
    const { error, setError, isUserRejection, isContractError, resetError } = useWriteContractErrorState(writeError);

    const [selectedPet1, setSelectedPet1] = useState<bigint | null>(null);
    const [selectedPet2, setSelectedPet2] = useState<bigint | null>(null);
    const [newPetName, setNewPetName] = useState('');
    const [success, setSuccess] = useState<string | null>(null);

    const handleBreed = async () => {
        if (!selectedPet1 || !selectedPet2 || !newPetName.trim()) {
            setError('Please select two pets and enter a name for the offspring');
            return;
        }

        resetError();
        setSuccess(null);

        try {
            await createPetFromDNA(selectedPet1, selectedPet2, newPetName.trim());
        } catch (err) {
            setError('Failed to breed pets. Please try again.');
            console.error('Error breeding pets:', err);
        }
    };

    const handleCancel = () => {
        setSuccess(null);
        navigate(DASHBOARD_HOME);
    };

    const handleTransactionComplete = () => {
        setSuccess(`Pet "${newPetName}" created successfully!`);
        setSelectedPet1(null);
        setSelectedPet2(null);
        setNewPetName('');
        resetError();
        navigate(DASHBOARD_HOME);
        refetchPetIds();
    };

    return (
        <>
            <div className="interface">
                {!isStandaloneView && (
                    <>
                        <h4>🧬 Breed Pets</h4>
                        <p>Select two pets to create a new one</p>
                    </>
                )}

                <div className="picker">
                    <div className="field">
                        <label>First Parent</label>
                        <select
                            value={selectedPet1?.toString() || ''}
                            onChange={(e) => setSelectedPet1(e.target.value ? BigInt(e.target.value) : null)}
                        >
                            <option value="">Select pet...</option>
                            {readyPets.map(({ id, pet }) => (
                                <option key={id.toString()} value={id.toString()}>
                                    {pet.name} (Level {pet.level})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Second Parent</label>
                        <select
                            value={selectedPet2?.toString() || ''}
                            onChange={(e) => setSelectedPet2(e.target.value ? BigInt(e.target.value) : null)}
                        >
                            <option value="">Select pet...</option>
                            {readyPets
                                .filter(({ id }) => id !== selectedPet1)
                                .map(({ id, pet }) => (
                                    <option key={id.toString()} value={id.toString()}>
                                        {pet.name} (Level {pet.level})
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="name-input">
                    <label>Offspring Name</label>
                    <input
                        type="text"
                        value={newPetName}
                        onChange={(e) => setNewPetName(e.target.value)}
                        placeholder="Enter name for the new pet..."
                        maxLength={20}
                    />
                </div>

                <div className="action-controls">
                    <button type="button" onClick={handleBreed} disabled={isPending || !selectedPet1 || !selectedPet2 || !newPetName.trim()}>
                        {isPending ? 'Breeding...' : 'Breed Pets'}
                    </button>
                    <button type="button" onClick={handleCancel} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>

            {error && (
                <div className={`error-message ${isUserRejection ? 'user-rejection' : ''} ${isContractError ? 'contract-error' : ''}`}>
                    {isUserRejection ? '⏸️' : isContractError ? '⚠️' : '❌'} {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    ✅ {success}
                </div>
            )}

            <TransactionStatus hash={hash} onComplete={handleTransactionComplete} onError={(e) => setError(e.message)} />
        </>
    );
};

export default BreedPanel;
