import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Define chains for mobile
export const chains = [mainnet, sepolia, localhost] as const;

// Create wagmi config for React Native
export const wagmiConfig = createConfig({
    chains,
    connectors: [
        injected({
            target: 'metaMask', // Target MetaMask for mobile
        }),
    ],
    transports: {
        [mainnet.id]: http('https://eth.llamarpc.com'),
        [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_PROJECT_ID'),
        [localhost.id]: http('http://localhost:8545'),
    },
});

export type Chain = typeof chains[number];

