// Ethereum configuration for React Native
export const ETHEREUM_CONFIG = {
    // Mainnet
    mainnet: {
        chainId: 1,
        name: 'Ethereum',
        rpcUrl: 'https://eth.llamarpc.com',
        blockExplorer: 'https://etherscan.io',
    },
    // Sepolia Testnet
    sepolia: {
        chainId: 11155111,
        name: 'Sepolia',
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
        blockExplorer: 'https://sepolia.etherscan.io',
    },
    // Local development (if needed)
    localhost: {
        chainId: 31337,
        name: 'Localhost',
        rpcUrl: 'http://localhost:8545',
        blockExplorer: 'http://localhost:8545',
    },
} as const;

export type EthereumNetwork = keyof typeof ETHEREUM_CONFIG;
