import "@walletconnect/react-native-compat";

import { createAppKit, solana } from '@reown/appkit-react-native';
import { WagmiAdapter } from '@reown/appkit-wagmi-react-native';
import { SolanaAdapter } from '@reown/appkit-solana-react-native';
import { mainnet, sepolia } from 'wagmi/chains';
import { storage } from './StorageUtil';
import { REOWN_PROJECT_ID } from '@env';
import { hardhatLocal } from './ethereumChains';

const reownProjectId = REOWN_PROJECT_ID;

/** WalletConnect explorer IDs — featured so they still appear when custom chains (e.g. Hardhat) narrow the API wallet list. */
const FEATURED_WALLET_IDS = [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
];

// Create Wagmi adapter for Ethereum chains
const wagmiAdapter = new WagmiAdapter({
    projectId: reownProjectId,
    networks: [hardhatLocal, mainnet, sepolia],
});

// Export wagmiConfig for App.tsx
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Create Solana adapter
const solanaAdapter = new SolanaAdapter();

// Create AppKit instance with both Ethereum and Solana support
export const appKit = createAppKit({
    projectId: reownProjectId,
    networks: [hardhatLocal, mainnet, sepolia, solana],
    defaultNetwork: mainnet,
    adapters: [wagmiAdapter, solanaAdapter],
    featuredWalletIds: FEATURED_WALLET_IDS,
    storage,
    metadata: {
        name: 'CryptoPets',
        description: 'CryptoPets Mobile App',
        /** Relay allowlist must allow this origin (see Reown Dashboard → Allowed domains). */
        url: 'https://cryptopets.app',
        icons: ['https://avatars.githubusercontent.com/u/179229932'],
        redirect: {
            native: "cryptopets://",
            universal: "cryptopets.app",
        },
    },
    features: {
        socials: [],
        showWallets: true,
    },
});
