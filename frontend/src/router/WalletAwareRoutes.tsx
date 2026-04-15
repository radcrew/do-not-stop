import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import MainPage from '../pages/main/MainPage';
import LandingPage from '../pages/landing/LandingPage';
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
            <Route path="/landing" element={isLoggedIn ? <Navigate to="/main" replace /> : <LandingPage />} />
            <Route element={<PrivateRoute />}>
                <Route path="/main" element={<MainPage />}>
                    <Route index element={<PetInteractions />} />
                </Route>
                <Route path="/breed" element={<MainPage />}>
                    <Route index element={<BreedRoute />} />
                </Route>
                <Route path="/battle" element={<MainPage />}>
                    <Route index element={<BattleRoute />} />
                </Route>
                <Route path="/levelup" element={<MainPage />}>
                    <Route index element={<LevelUpRoute />} />
                </Route>
                <Route path="/rename" element={<MainPage />}>
                    <Route index element={<RenameRoute />} />
                </Route>
                <Route path="*" element={<Navigate to="/main" replace />} />
            </Route>
        </Routes>
    );
};

export default WalletAwareRoutes;
