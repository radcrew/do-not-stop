import React from 'react';
import InteractionStandalonePage from '../components/pet/InteractionStandalonePage';
import RenamePanel from '../components/pet/interactions/RenamePanel';

const RenameRoute: React.FC = () => (
    <InteractionStandalonePage action="changename" minPets={1}>
        <RenamePanel />
    </InteractionStandalonePage>
);

export default RenameRoute;
