import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePetsContract } from '../../hooks/usePetsContract';
import { getLifePercent } from '../../utils/petCard';
import {
    BATTLE_PATH,
    BREED_PATH,
    DASHBOARD_HOME,
    LEVELUP_PATH,
    RENAME_PATH,
} from '../../constants/interactionRoutes';
import BattlePanel from './interactions/BattlePanel';
import BreedPanel from './interactions/BreedPanel';
import LevelUpPanel from './interactions/LevelUpPanel';
import RenamePanel from './interactions/RenamePanel';
import { getReadyPets } from '../../utils/readyPets';
import './PetInteractions.css';

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

const PetInteractions: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { action: actionParam } = useParams<{ action?: string }>();
    const standaloneAction = useMemo(() => parseStandalonePath(location.pathname), [location.pathname]);
    const isStandaloneView = standaloneAction !== null;
    const { isConnected, pets, petIds, isLoading, isReady } = usePetsContract();

    const action = useMemo((): InteractionAction | null => {
        if (standaloneAction) return standaloneAction;
        return parseActionParam(actionParam);
    }, [actionParam, standaloneAction]);

    const readyPets = useMemo(() => getReadyPets(petIds, pets, isReady), [petIds, pets, isReady]);

    // Unknown interaction path → dashboard hub
    useEffect(() => {
        if (isStandaloneView) return;
        if (actionParam !== undefined && actionParam !== '' && action === null) {
            navigate(DASHBOARD_HOME, { replace: true });
        }
    }, [actionParam, action, navigate, isStandaloneView]);

    if (!isConnected) {
        return (
            <div className="pet-interactions">
                <div className="interactions-card">
                    <div className="card-header">
                        <h3>⚔️ Pet Interactions</h3>
                    </div>
                    <p>Connect your wallet to interact with your pets</p>
                </div>
            </div>
        );
    }

    if (isLoading && pets.length === 0) {
        return (
            <div className="pet-interactions">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your pets...</p>
                </div>
            </div>
        );
    }

    if (pets.length === 0) {
        return (
            <div className={`pet-interactions${isStandaloneView ? ' interaction-standalone' : ''}`}>
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
    if (standaloneAction && needsTwoPets && pets.length < 2) {
        return (
            <div className="pet-interactions interaction-standalone">
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

    const previewParentA = readyPets[0]?.pet;
    const previewParentB = readyPets[1]?.pet;
    const availableBattles = Math.min(3, readyPets.length > 1 ? 3 : 0);

    return (
        <div className={`pet-interactions${isStandaloneView ? ' interaction-standalone' : ''}`}>
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
                                disabled={readyPets.length < 2}
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
                                disabled={readyPets.length < 2}
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
                                disabled={readyPets.length < 1}
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
                                disabled={readyPets.length < 1}
                            >
                                Open rename
                            </button>
                        </div>
                    </div>
                )}

                {action === 'breed' && <BreedPanel isStandaloneView={isStandaloneView} />}

                {action === 'battle' && <BattlePanel isStandaloneView={isStandaloneView} />}

                {action === 'levelup' && <LevelUpPanel isStandaloneView={isStandaloneView} />}

                {action === 'changename' && <RenamePanel isStandaloneView={isStandaloneView} />}
            </div>
        </div>
    );
};

export default PetInteractions;
