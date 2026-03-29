import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { http } from 'viem';
import {
  createConfig,
  WagmiProvider,
} from 'wagmi';
import { injected } from 'wagmi/connectors';

import Main from './components/layout/Main';
import PetInteractions from './components/pet/PetInteractions';
import { ApiClientProvider, AuthProvider, queryClient, useAuth } from '@do-not-stop/shared-auth';
import { API_URL } from './config';
import { SolanaWalletProvider } from './contexts';
import { ThemeProvider } from './contexts/theme';
import { DynamicProvider } from './contexts/dynamic';
import { CHAINS } from './constants/chains';
import './App.css';

// All supported chains from centralized configuration
const allChains = CHAINS.map(chainConfig => chainConfig.chain);

const config = createConfig({
  chains: allChains as any,
  connectors: [injected()],
  multiInjectedProviderDiscovery: false,
  transports: Object.fromEntries(
    allChains.map(chain => [
      chain.id,
      http(chain.rpcUrls.default.http[0])
    ])
  ),
});

const WalletAwareRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isLoggedIn = Boolean(isAuthenticated);

  return (
    <Routes>
      <Route
        path="/landing"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Main />}
      />
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}
      >
        <Route index element={<PetInteractions />} />
        <Route path="interactions/breed" element={<Navigate to="/breed" replace />} />
        <Route path="interactions/battle" element={<Navigate to="/battle" replace />} />
        <Route path="interactions/levelup" element={<Navigate to="/levelup" replace />} />
        <Route path="interactions/rename" element={<Navigate to="/rename" replace />} />
        <Route path="interactions/:action?" element={<PetInteractions />} />
      </Route>
      <Route
        path="/breed"
        element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}
      >
        <Route index element={<PetInteractions />} />
      </Route>
      <Route
        path="/battle"
        element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}
      >
        <Route index element={<PetInteractions />} />
      </Route>
      <Route
        path="/levelup"
        element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}
      >
        <Route index element={<PetInteractions />} />
      </Route>
      <Route
        path="/rename"
        element={isLoggedIn ? <Main /> : <Navigate to="/landing" replace />}
      >
        <Route index element={<PetInteractions />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? '/dashboard' : '/landing'} replace />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicProvider>
            <SolanaWalletProvider network="Solana Local">
              <ApiClientProvider baseURL={API_URL}>
                <AuthProvider>
                  <BrowserRouter>
                    <WalletAwareRoutes />
                  </BrowserRouter>
                </AuthProvider>
              </ApiClientProvider>
            </SolanaWalletProvider>
          </DynamicProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};

export default App;

