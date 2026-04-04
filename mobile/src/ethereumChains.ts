import { defineChain } from 'viem';

/** Matches local Hardhat / Anvil default (see frontend `hardhatLocal`). */
export const hardhatLocal = defineChain({
    id: 31337,
    name: 'Hardhat Local',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:8545'],
        },
    },
    testnet: true,
});
