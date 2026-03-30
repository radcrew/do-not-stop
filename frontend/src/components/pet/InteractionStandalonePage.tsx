import React from 'react';
import type { InteractionAction } from '../../constants/interactionRoutes';
import { STANDALONE_INTERACTION_HEADERS } from '../../constants/interactionRoutes';
import { usePetsContract } from '../../hooks/usePetsContract';
import './PetInteractions.css';

export type InteractionStandalonePageProps = {
    action: InteractionAction;
    minPets: number;
    children: React.ReactNode;
};

/** Shell for `/breed`, `/battle`, `/levelup`, `/rename`: auth/loading/empty/min-pets gates, then header + panel. */
const InteractionStandalonePage: React.FC<InteractionStandalonePageProps> = ({ action, minPets, children }) => {
    const { isConnected, pets, isLoading } = usePetsContract();
    const header = STANDALONE_INTERACTION_HEADERS[action];

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
            <div className="pet-interactions interaction-standalone">
                <div className="interactions-card">
                    <div className="card-header">
                        <h3>{header.title}</h3>
                    </div>
                    <p>You don&apos;t have any pets yet.</p>
                    <p className="help-text">Go to the dashboard and create your first pet.</p>
                </div>
            </div>
        );
    }

    if (minPets > 1 && pets.length < minPets) {
        return (
            <div className="pet-interactions interaction-standalone">
                <div className="interactions-card">
                    <div className="card-header interaction-standalone-header">
                        <h3>{header.title}</h3>
                        <p className="sub">{header.sub}</p>
                    </div>
                    <p>You need at least two pets to breed or battle.</p>
                    <p className="help-text">Create another pet from the dashboard, then come back here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pet-interactions interaction-standalone">
            <div className="interactions-card">
                <div className="card-header interaction-standalone-header">
                    <h3>{header.title}</h3>
                    <p className="sub">{header.sub}</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default InteractionStandalonePage;
