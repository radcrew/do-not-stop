import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TransactionStatus from '../ui/TransactionStatus';
import { useZombiesContract, type Zombie } from '../../hooks/useZombiesContract';
import { parseContractError } from '../../utils/errorParser';
import { getLifePercent } from '../../utils/petCard';
import {
    BATTLE_PATH,
    BREED_PATH,
    DASHBOARD_HOME,
    LEVELUP_PATH,
    RENAME_PATH,
} from '../../constants/interactionRoutes';
import './ZombieInteractions.css';

type InteractionAction = 'breed' | 'battle' | 'levelup' | 'changename';

/** Map URL segment (e.g. `rename`) to internal action id. */
function parseActionParam(raw: string | undefined): InteractionAction | null {
    if (!raw) return null;
    if (raw === 'rename') return 'changename';
    if (raw === 'breed' || raw === 'battle' || raw === 'levelup') return raw;
    return null;
}

function parseStandalonePath(pathname: string): InteractionAction | null {
    const p = pathname.replace(/\/$/, '') || '/';
    if (p === BREED_PATH) return 'breed';
    if (p === BATTLE_PATH) return 'battle';
    if (p === LEVELUP_PATH) return 'levelup';
    if (p === RENAME_PATH) return 'changename';
    return null;
}

const STANDALONE_HEADERS: Record<InteractionAction, { title: string; sub: string }> = {
    breed: { title: '🥚 Breeding Lab', sub: 'Breed two pets to create a new one' },
    battle: { title: '⚔️ Battle Arena', sub: 'Pick two pets to fight' },
    levelup: { title: '⬆️ Level Up', sub: 'Pay 0.001 ETH to level up your pet' },
    changename: { title: '✏️ Rename Pet', sub: "Change your pet's name (requires level 2+)" },
};

const ZombieInteractions: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { action: actionParam } = useParams<{ action?: string }>();
    const standaloneAction = useMemo(() => parseStandalonePath(location.pathname), [location.pathname]);
    const isStandaloneView = standaloneAction !== null;
    const {
        isConnected,
        zombies,
        zombieIds,
        isLoading,
        createZombieFromDNA,
        battleZombies,
        levelUp,
        changeName,
        hash,
        isPending,
        writeError,
        refetchZombieIds,
        isReady
    } = useZombiesContract();

    const [selectedZombie1, setSelectedZombie1] = useState<bigint | null>(null);
    const [selectedZombie2, setSelectedZombie2] = useState<bigint | null>(null);
    const [newZombieName, setNewZombieName] = useState('');
    const [selectedZombie, setSelectedZombie] = useState<bigint | null>(null);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isUserRejection, setIsUserRejection] = useState(false);
    const [isContractError, setIsContractError] = useState(false);

    const action = useMemo((): InteractionAction | null => {
        if (standaloneAction) return standaloneAction;
        return parseActionParam(actionParam);
    }, [actionParam, standaloneAction]);

    // Unknown interaction path → dashboard hub
    useEffect(() => {
        if (isStandaloneView) return;
        if (actionParam !== undefined && actionParam !== '' && action === null) {
            navigate(DASHBOARD_HOME, { replace: true });
        }
    }, [actionParam, action, navigate, isStandaloneView]);

    // Set loading state
    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const getReadyZombies = (): { id: bigint; zombie: Zombie }[] => {
        return zombieIds
            .map((id, index) => ({ id, zombie: zombies[index] }))
            .filter(({ zombie }) => zombie && isReady(zombie.readyTime));
    };

    const handleBreed = async () => {
        if (!selectedZombie1 || !selectedZombie2 || !newZombieName.trim()) {
            setError('Please select two pets and enter a name for the offspring');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        setIsUserRejection(false);
        setIsContractError(false);

        try {
            await createZombieFromDNA(selectedZombie1, selectedZombie2, newZombieName.trim());
        } catch (err) {
            setError('Failed to breed pets. Please try again.');
            console.error('Error breeding pets:', err);
        }
    };

    const handleBattle = async () => {
        if (!selectedZombie1 || !selectedZombie2) {
            setError('Please select two pets to battle');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        setIsUserRejection(false);
        setIsContractError(false);

        try {
            await battleZombies(selectedZombie1, selectedZombie2);
        } catch (err) {
            setError('Failed to start battle. Please try again.');
            console.error('Error starting battle:', err);
        }
    };

    const handleLevelUp = async () => {
        if (!selectedZombie) {
            setError('Please select a pet to level up');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        setIsUserRejection(false);
        setIsContractError(false);

        try {
            await levelUp(selectedZombie);
        } catch (err) {
            setError('Failed to level up pet. Please try again.');
            console.error('Error leveling up pet:', err);
        }
    };

    const handleChangeName = async () => {
        if (!selectedZombie || !newName.trim()) {
            setError('Please select a pet and enter a new name');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        setIsUserRejection(false);
        setIsContractError(false);

        try {
            await changeName(selectedZombie, newName.trim());
        } catch (err) {
            setError('Failed to change pet name. Please try again.');
            console.error('Error changing pet name:', err);
        }
    };

    const clearFormState = () => {
        setSelectedZombie1(null);
        setSelectedZombie2(null);
        setSelectedZombie(null);
        setNewZombieName('');
        setNewName('');
        setError(null);
        setIsUserRejection(false);
        setIsContractError(false);
    };

    const goToInteractionsHub = () => {
        clearFormState();
        navigate(DASHBOARD_HOME);
    };

    const cancelInteraction = () => {
        setSuccess(null);
        goToInteractionsHub();
    };

    const handleTransactionComplete = () => {
        if (action === 'breed') {
            setSuccess(`Pet "${newZombieName}" created successfully!`);
        } else if (action === 'battle') {
            setSuccess('Battle completed! Check your pets for level ups.');
        } else if (action === 'levelup') {
            setSuccess('Pet leveled up successfully!');
        } else if (action === 'changename') {
            setSuccess(`Pet name changed to "${newName}"!`);
        }
        clearFormState();
        navigate(DASHBOARD_HOME);
        refetchZombieIds();
    };

    useEffect(() => {
        if (writeError) {
            const parsedError = parseContractError(writeError);
            setError(parsedError.message);
            setIsUserRejection(parsedError.isUserRejection);
            setIsContractError(parsedError.isContractError);
        }
    }, [writeError]);

    if (!isConnected) {
        return (
            <div className="zombie-interactions">
                <div className="interactions-card">
                    <div className="card-header">
                        <h3>⚔️ Pet Interactions</h3>
                    </div>
                    <p>Connect your wallet to interact with your pets</p>
                </div>
            </div>
        );
    }

    if (loading && zombies.length === 0) {
        return (
            <div className="zombie-interactions">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your pets...</p>
                </div>
            </div>
        );
    }

    if (zombies.length === 0) {
        return (
            <div className={`zombie-interactions${isStandaloneView ? ' interaction-standalone' : ''}`}>
                <div className="interactions-card">
                    <div className="card-header">
                        <h3>
                            {isStandaloneView && standaloneAction
                                ? STANDALONE_HEADERS[standaloneAction].title
                                : '⚔️ Pet Interactions'}
                        </h3>
                    </div>
                    <p>You don&apos;t have any pets yet.</p>
                    <p className="help-text">Go to the dashboard and create your first pet.</p>
                </div>
            </div>
        );
    }

    const needsTwoPets = standaloneAction === 'breed' || standaloneAction === 'battle';
    if (standaloneAction && needsTwoPets && zombies.length < 2) {
        return (
            <div className="zombie-interactions interaction-standalone">
                <div className="interactions-card">
                    <div className="card-header interaction-standalone-header">
                        <h3>{STANDALONE_HEADERS[standaloneAction].title}</h3>
                        <p className="sub">{STANDALONE_HEADERS[standaloneAction].sub}</p>
                    </div>
                    <p>You need at least two pets to breed or battle.</p>
                    <p className="help-text">Create another pet from the dashboard, then come back here.</p>
                </div>
            </div>
        );
    }

    const readyZombies = getReadyZombies();
    const previewParentA = readyZombies[0]?.zombie;
    const previewParentB = readyZombies[1]?.zombie;
    const availableBattles = Math.min(3, readyZombies.length > 1 ? 3 : 0);

    return (
        <div className={`zombie-interactions${isStandaloneView ? ' interaction-standalone' : ''}`}>
            <div className="interactions-card">
                {!isStandaloneView && (
                    <div className="card-header">
                        <h3>⚔️ Pet Interactions</h3>
                    </div>
                )}

                {isStandaloneView && standaloneAction && (
                    <div className="card-header interaction-standalone-header">
                        <h3>{STANDALONE_HEADERS[standaloneAction].title}</h3>
                        <p className="sub">{STANDALONE_HEADERS[standaloneAction].sub}</p>
                    </div>
                )}

                {!action && (
                    <div className="action-buttons">
                        <div className="breeding-lab-card">
                            <div className="header">🥚 Breeding Lab</div>
                            <div className="hub-divider" />
                            <div className="content">
                                <div className="parent-item">
                                    <span className="parent-name">{previewParentA?.name ?? 'Parent A'}</span>
                                    <span className="parent-meta">{previewParentA ? `Lv.${previewParentA.level}` : 'Select'}</span>
                                </div>
                                <div className="egg">🥚</div>
                                <div className="parent-item">
                                    <span className="parent-name">{previewParentB?.name ?? 'Parent B'}</span>
                                    <span className="parent-meta">{previewParentB ? `Lv.${previewParentB.level}` : 'Select'}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(BREED_PATH)}
                                className="lab-breed-button"
                                disabled={readyZombies.length < 2}
                            >
                                Start breeding
                            </button>
                        </div>
                        <div className="battle-arena-card">
                            <div className="header">
                                <span>⚔️ Battle Arena</span>
                                <span className="left-badge">{availableBattles} left</span>
                            </div>
                            <div className="hub-divider" />
                            <div className="content">
                                <div className="pet-item">
                                    <span className="pet-name">{previewParentA?.name ?? 'Fighter A'}</span>
                                    <div className="life-track">
                                        <div className="life-fill" style={{ width: `${getLifePercent(previewParentA)}%` }} />
                                    </div>
                                </div>
                                <div className="center">
                                    <div className="icon">⚔️</div>
                                    <div className="vs">VS</div>
                                </div>
                                <div className="pet-item">
                                    <span className="pet-name">{previewParentB?.name ?? 'Fighter B'}</span>
                                    <div className="life-track">
                                        <div className="life-fill" style={{ width: `${getLifePercent(previewParentB)}%` }} />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(BATTLE_PATH)}
                                className="lab-breed-button start-button"
                                disabled={readyZombies.length < 2}
                            >
                                Start battle
                            </button>
                        </div>
                        <div className="feature-action-card">
                            <div className="header">⬆️ Level Up</div>
                            <div className="hub-divider" />
                            <div className="content">
                                Boost your pet stats by leveling up.
                                <br />
                                Cost: 0.001 ETH per level.
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(LEVELUP_PATH)}
                                className="lab-breed-button levelup-button"
                                disabled={readyZombies.length < 1}
                            >
                                Open level up
                            </button>
                        </div>
                        <div className="feature-action-card">
                            <div className="header">✏️ Change Name</div>
                            <div className="hub-divider" />
                            <div className="content">
                                Rename your pet once it reaches level 2.
                                <br />
                                Pick a new identity for your companion.
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(RENAME_PATH)}
                                className="lab-breed-button changename-button"
                                disabled={readyZombies.length < 1}
                            >
                                Open rename
                            </button>
                        </div>
                    </div>
                )}

                {action === 'breed' && (
                    <div className="breed-interface">
                        {!isStandaloneView && (
                            <>
                                <h4>🧬 Breed Pets</h4>
                                <p>Select two pets to create a new one</p>
                            </>
                        )}

                        <div className="zombie-selection">
                            <div className="selection-group">
                                <label>First Parent</label>
                                <select
                                    value={selectedZombie1?.toString() || ''}
                                    onChange={(e) => setSelectedZombie1(e.target.value ? BigInt(e.target.value) : null)}
                                >
                                    <option value="">Select pet...</option>
                                    {readyZombies.map(({ id, zombie }) => (
                                        <option key={id.toString()} value={id.toString()}>
                                            {zombie.name} (Level {zombie.level})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="selection-group">
                                <label>Second Parent</label>
                                <select
                                    value={selectedZombie2?.toString() || ''}
                                    onChange={(e) => setSelectedZombie2(e.target.value ? BigInt(e.target.value) : null)}
                                >
                                    <option value="">Select pet...</option>
                                    {readyZombies
                                        .filter(({ id }) => id !== selectedZombie1)
                                        .map(({ id, zombie }) => (
                                            <option key={id.toString()} value={id.toString()}>
                                                {zombie.name} (Level {zombie.level})
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="name-input">
                            <label>Offspring Name</label>
                            <input
                                type="text"
                                value={newZombieName}
                                onChange={(e) => setNewZombieName(e.target.value)}
                                placeholder="Enter name for the new pet..."
                                maxLength={20}
                            />
                        </div>

                        <div className="action-controls">
                            <button onClick={handleBreed} disabled={isPending || !selectedZombie1 || !selectedZombie2 || !newZombieName.trim()}>
                                {isPending ? 'Breeding...' : 'Breed Pets'}
                            </button>
                            <button type="button" onClick={cancelInteraction} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {action === 'battle' && (
                    <div className="battle-interface">
                        {!isStandaloneView && (
                            <>
                                <h4>⚔️ Battle Pets</h4>
                                <p>Select two pets to battle</p>
                            </>
                        )}

                        <div className="zombie-selection">
                            <div className="selection-group">
                                <label>First Fighter</label>
                                <select
                                    value={selectedZombie1?.toString() || ''}
                                    onChange={(e) => setSelectedZombie1(e.target.value ? BigInt(e.target.value) : null)}
                                >
                                    <option value="">Select pet...</option>
                                    {readyZombies.map(({ id, zombie }) => (
                                        <option key={id.toString()} value={id.toString()}>
                                            {zombie.name} (Level {zombie.level})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="selection-group">
                                <label>Second Fighter</label>
                                <select
                                    value={selectedZombie2?.toString() || ''}
                                    onChange={(e) => setSelectedZombie2(e.target.value ? BigInt(e.target.value) : null)}
                                >
                                    <option value="">Select pet...</option>
                                    {readyZombies
                                        .filter(({ id }) => id !== selectedZombie1)
                                        .map(({ id, zombie }) => (
                                            <option key={id.toString()} value={id.toString()}>
                                                {zombie.name} (Level {zombie.level})
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="action-controls">
                            <button onClick={handleBattle} disabled={isPending || !selectedZombie1 || !selectedZombie2}>
                                {isPending ? 'Starting Battle...' : 'Start Battle'}
                            </button>
                            <button type="button" onClick={cancelInteraction} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {action === 'levelup' && (
                    <div className="levelup-interface">
                        {!isStandaloneView && (
                            <>
                                <h4>⬆️ Level Up Pet</h4>
                                <p>Pay 0.001 ETH to level up your pet</p>
                            </>
                        )}

                        <div className="zombie-selection">
                            <div className="selection-group">
                                <label>Select Pet</label>
                                <select
                                    value={selectedZombie?.toString() || ''}
                                    onChange={(e) => setSelectedZombie(e.target.value ? BigInt(e.target.value) : null)}
                                >
                                    <option value="">Select pet...</option>
                                    {readyZombies.map(({ id, zombie }) => (
                                        <option key={id.toString()} value={id.toString()}>
                                            {zombie.name} (Level {zombie.level})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="action-controls">
                            <button onClick={handleLevelUp} disabled={isPending || !selectedZombie}>
                                {isPending ? 'Leveling Up...' : 'Level Up (0.001 ETH)'}
                            </button>
                            <button type="button" onClick={cancelInteraction} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {action === 'changename' && (
                    <div className="changename-interface">
                        {!isStandaloneView && (
                            <>
                                <h4>✏️ Change Pet Name</h4>
                                <p>Change your pet&apos;s name (requires level 2+)</p>
                            </>
                        )}

                        <div className="zombie-selection">
                            <div className="selection-group">
                                <label>Select Pet</label>
                                <select
                                    value={selectedZombie?.toString() || ''}
                                    onChange={(e) => setSelectedZombie(e.target.value ? BigInt(e.target.value) : null)}
                                >
                                    <option value="">Select pet...</option>
                                    {readyZombies
                                        .filter(({ zombie }) => zombie.level >= 2)
                                        .map(({ id, zombie }) => (
                                            <option key={id.toString()} value={id.toString()}>
                                                {zombie.name} (Level {zombie.level})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="selection-group">
                                <label>New Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter new name..."
                                    maxLength={20}
                                />
                            </div>
                        </div>

                        <div className="action-controls">
                            <button onClick={handleChangeName} disabled={isPending || !selectedZombie || !newName.trim()}>
                                {isPending ? 'Changing Name...' : 'Change Name'}
                            </button>
                            <button type="button" onClick={cancelInteraction} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

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

                <TransactionStatus
                    hash={hash}
                    onComplete={handleTransactionComplete}
                    onError={(error) => setError(error.message)}
                />
            </div>
        </div>
    );
};

export default ZombieInteractions;
