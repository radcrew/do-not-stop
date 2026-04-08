import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Main from '../components/layout/main/Main';
import Landing from '../components/layout/landing/Landing';
import PetInteractions from '../components/pet/PetInteractions';
import BattleRoute from './BattleRoute';
import BreedRoute from './BreedRoute';
import LevelUpRoute from './LevelUpRoute';
import RenameRoute from './RenameRoute';
import { PrivateRoute, useAppLoggedIn } from './PrivateRoute';

/**
 * Auth-gated route tree: landing vs main app, nested interactions, standalone breed/battle/levelup/rename.
 */
const WalletAwareRoutes: React.FC = () => {
    const isLoggedIn = useAppLoggedIn();

    return (
        <Routes>
            <Route path="/landing" element={isLoggedIn ? <Navigate to="/main" replace /> : <Landing />} />
            <Route element={<PrivateRoute />}>
                <Route path="/main" element={<Main />}>
                    <Route index element={<PetInteractions />} />
                </Route>
                <Route path="/breed" element={<Main />}>
                    <Route index element={<BreedRoute />} />
                </Route>
                <Route path="/battle" element={<Main />}>
                    <Route index element={<BattleRoute />} />
                </Route>
                <Route path="/levelup" element={<Main />}>
                    <Route index element={<LevelUpRoute />} />
                </Route>
                <Route path="/rename" element={<Main />}>
                    <Route index element={<RenameRoute />} />
                </Route>
                <Route path="*" element={<Navigate to="/main" replace />} />
            </Route>
        </Routes>
    );
};

export default WalletAwareRoutes;
