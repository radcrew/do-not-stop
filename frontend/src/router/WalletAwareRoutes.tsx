import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@do-not-stop/shared-auth';

import Main from '../components/layout/Main';
import PetInteractions from '../components/pet/PetInteractions';

/**
 * Auth-gated route tree: landing vs dashboard, nested interactions, standalone breed/battle/levelup/rename.
 */
const WalletAwareRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const isLoggedIn = Boolean(isAuthenticated);

    return (
        <Routes>
            <Route path="/landing" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Main />} />
            <Route path="/dashboard" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<PetInteractions />} />
                <Route path="interactions/breed" element={<Navigate to="/breed" replace />} />
                <Route path="interactions/battle" element={<Navigate to="/battle" replace />} />
                <Route path="interactions/levelup" element={<Navigate to="/levelup" replace />} />
                <Route path="interactions/rename" element={<Navigate to="/rename" replace />} />
                <Route path="interactions/:action?" element={<PetInteractions />} />
            </Route>
            <Route path="/breed" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<PetInteractions />} />
            </Route>
            <Route path="/battle" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<PetInteractions />} />
            </Route>
            <Route path="/levelup" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<PetInteractions />} />
            </Route>
            <Route path="/rename" element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}>
                <Route index element={<PetInteractions />} />
            </Route>
            <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/landing'} replace />} />
        </Routes>
    );
};

export default WalletAwareRoutes;
