import { createAppKit, solana, type AppKitNetwork } from '@reown/appkit-react-native';
import { WagmiAdapter } from '@reown/appkit-wagmi-react-native';
import { SolanaAdapter } from '@reown/appkit-solana-react-native';
import { http, createConfig as createWagmiCoreConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { storage } from './StorageUtil'; // Import custom storage
import { QueryClient } from '@tanstack/react-query';

const projectId = process.env.REOWN_PROJECT_ID || 'YOUR_PROJECT_ID'; // Obtain from https://dashboard.reown.com/

// Setup queryClient
export const queryClient = new QueryClient();

// Create Wagmi adapter for Ethereum chains
export const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks: [mainnet, sepolia], // Ethereum chains
});

// Export wagmiConfig for App.tsx
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Create Solana adapter
const solanaAdapter = new SolanaAdapter();

// Create AppKit instance with both Ethereum and Solana support
export const appKit = createAppKit({
    projectId,
    networks: [mainnet, sepolia, solana], // Both Ethereum and Solana networks
    defaultNetwork: mainnet, // Optional: set Ethereum as default
    adapters: [wagmiAdapter, solanaAdapter], // Both adapters
    storage, // Add storage for data persistence

    // App metadata
    metadata: {
        name: 'CryptoZombies',
        description: 'CryptoZombies Mobile App',
        url: 'https://cryptozombies.app',
        icons: ['https://avatars.githubusercontent.com/u/179229932'],
        redirect: {
            native: "cryptozombies://",
            universal: "cryptozombies.app",
        },
    }
});
