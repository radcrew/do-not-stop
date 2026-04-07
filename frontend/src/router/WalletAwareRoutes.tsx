import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@do-not-stop/shared-auth';

import { useDynamicContext } from '../contexts/dynamic';
import Main from '../components/layout/main/Main';
import Landing from '../components/layout/landing/Landing';
import PetInteractions from '../components/pet/PetInteractions';
import BattleRoute from './BattleRoute';
import BreedRoute from './BreedRoute';
import LevelUpRoute from './LevelUpRoute';
import RenameRoute from './RenameRoute';

/**
 * Auth-gated route tree: landing vs dashboard, nested interactions, standalone breed/battle/levelup/rename.
 */
const WalletAwareRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { user, primaryWallet } = useDynamicContext();
    const isLoggedIn = Boolean(isAuthenticated || user || primaryWallet);

    return (
        <Routes>
            <Route path="/landing" element={isLoggedIn ? <Navigate to="/main" replace /> : <Landing />} />
            <Route path="/main" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<PetInteractions />} />
            </Route>
            <Route path="/breed" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<BreedRoute />} />
            </Route>
            <Route path="/battle" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<BattleRoute />} />
            </Route>
            <Route path="/levelup" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<LevelUpRoute />} />
            </Route>
            <Route path="/rename" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<RenameRoute />} />
            </Route>
            <Route path="*" element={<Navigate to={isLoggedIn ? '/main' : '/landing'} replace />} />
        </Routes>
    );
};

export default WalletAwareRoutes;
