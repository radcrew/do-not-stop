import React from 'react';
import { AppKitProvider } from '@reown/appkit-react-native';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { appKit, wagmiConfig, queryClient } from './src/AppKitConfig';
import { AuthProvider } from './src/contexts';
import YourAppRootComponent from './src/YourAppRootComponent.tsx';

export default function App() {
  return (
    <AppKitProvider instance={appKit}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <YourAppRootComponent />
          </AuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AppKitProvider>
  );
}
