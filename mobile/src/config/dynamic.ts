// Dynamic.xyz configuration for React Native
export const DYNAMIC_CONFIG = {
    environmentId: 'your-dynamic-environment-id', // Replace with your actual Dynamic environment ID

    // EVM Networks configuration
    evmNetworks: [
        {
            chainId: 1,
            chainName: 'Ethereum',
            name: 'Ethereum',
            rpcUrls: ['https://eth.llamarpc.com'],
            blockExplorerUrls: ['https://etherscan.io'],
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
        },
        {
            chainId: 11155111,
            chainName: 'Sepolia',
            name: 'Sepolia',
            rpcUrls: ['https://sepolia.infura.io/v3/YOUR_PROJECT_ID'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
            nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'SepoliaETH',
                decimals: 18,
            },
        },
        {
            chainId: 31337,
            chainName: 'Localhost',
            name: 'Localhost',
            rpcUrls: ['http://localhost:8545'],
            blockExplorerUrls: ['http://localhost:8545'],
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
        },
    ],

    // Wallet connectors
    walletConnectors: ['metamask', 'walletconnect', 'coinbase'],

    // Initial authentication mode
    initialAuthenticationMode: 'connect-only' as const,

    // App information
    appName: 'CryptoZombies Mobile',
    appLogoUrl: 'https://your-app-logo-url.com/logo.png',
} as const;
