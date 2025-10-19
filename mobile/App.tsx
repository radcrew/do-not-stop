/**
 * CryptoZombies Mobile App
 * React Native app with Ethereum support via Dynamic.xyz
 *
 * @format
 */

// Import polyfills first
import './src/polyfills';

import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import DynamicProvider from './src/providers/DynamicProvider';
import { queryClient } from './src/config/queryClient';
import { wagmiConfig } from './src/config/wagmi';
import WalletConnection from './src/components/WalletConnection';
import TestComponent from './src/components/TestComponent';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <DynamicProvider>
            <AppContent />
          </DynamicProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <WalletConnection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
