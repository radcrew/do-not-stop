import React from 'react';

export type PetInteractionsStateCardProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    helpText?: React.ReactNode;
};

/**
 * Reusable card for simple “state” screens:
 * - not connected
 * - no pets yet
 */
const PetInteractionsStateCard: React.FC<PetInteractionsStateCardProps> = ({ title, description, helpText }) => {
    return (
        <div className="pet-interactions">
            <div className="card">
                <div className="header">
                    <h3>{title}</h3>
                </div>
                {description ? <p>{description}</p> : null}
                {helpText ? <p className="help-text">{helpText}</p> : null}
            </div>
        </div>
    );
};

export default PetInteractionsStateCard;

