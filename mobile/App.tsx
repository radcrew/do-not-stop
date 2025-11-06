import React from 'react';
import { AppKitProvider } from '@reown/appkit-react-native';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, AuthProvider } from '@do-not-stop/shared-auth';

import { appKit, wagmiConfig } from './src/AppKitConfig';
import AppRoot from './src/AppContent.tsx';
import './config';

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider instance={appKit}>
          <AuthProvider>
            <AppRoot />
          </AuthProvider>
        </AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
