import React from 'react';
import InteractionStandalonePage from '../components/pet/InteractionStandalonePage';
import LevelUpPanel from '../components/pet/interactions/LevelUpPanel';

const LevelUpRoute: React.FC = () => (
    <InteractionStandalonePage action="levelup" minPets={1}>
        <LevelUpPanel />
    </InteractionStandalonePage>
);

export default LevelUpRoute;
