import "@walletconnect/react-native-compat";

import { createAppKit, solana, type AppKitNetwork } from '@reown/appkit-react-native';
import { WagmiAdapter } from '@reown/appkit-wagmi-react-native';
import { SolanaAdapter } from '@reown/appkit-solana-react-native';
import { mainnet, sepolia } from 'wagmi/chains';
import { storage } from './StorageUtil';
import { REOWN_PROJECT_ID } from '@env';

const reownProjectId = REOWN_PROJECT_ID;

// Create Wagmi adapter for Ethereum chains
const wagmiAdapter = new WagmiAdapter({
    projectId: reownProjectId,
    networks: [mainnet, sepolia],
});

// Export wagmiConfig for App.tsx
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Create Solana adapter
const solanaAdapter = new SolanaAdapter();

// Create AppKit instance with both Ethereum and Solana support
export const appKit = createAppKit({
    reownProjectId,
    networks: [mainnet, sepolia, solana],
    defaultNetwork: mainnet,
    adapters: [wagmiAdapter, solanaAdapter],
    storage,
    metadata: {
        name: 'CryptoZombies',
        description: 'CryptoZombies Mobile App',
        url: 'https://cryptozombies.app',
        icons: ['https://avatars.githubusercontent.com/u/179229932'],
        redirect: {
            native: "cryptozombies://",
            universal: "cryptozombies.app",
        },
    },
    features: {
        email: false,
        socials: [],
        showWallets: true,
    }
});
