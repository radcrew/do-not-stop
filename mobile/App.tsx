import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppKit } from '@reown/appkit-react-native';
import { wagmiConfig, queryClient } from './src/AppKitConfig';
import YourAppRootComponent from './src/YourAppRootComponent.tsx';

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <YourAppRootComponent />
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
