import React from 'react';
import InteractionStandalonePage from '../components/pet/InteractionStandalonePage';
import BreedPanel from '../components/pet/interactions/BreedPanel';

/** Top-level `/breed` — shell + breed panel (standalone UI). */
const BreedRoute: React.FC = () => (
    <InteractionStandalonePage action="breed" minPets={2}>
        <BreedPanel />
    </InteractionStandalonePage>
);

export default BreedRoute;
