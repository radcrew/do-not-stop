import React from 'react';
import InteractionStandalonePage from '../components/pet/InteractionStandalonePage';
import BattlePanel from '../components/pet/interactions/BattlePanel';

const BattleRoute: React.FC = () => (
    <InteractionStandalonePage action="battle" minPets={2}>
        <BattlePanel />
    </InteractionStandalonePage>
);

export default BattleRoute;
