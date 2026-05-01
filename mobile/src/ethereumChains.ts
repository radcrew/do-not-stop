import { defineChain } from 'viem';
import { HARDHAT_RPC_URL } from '@env';

/** Matches local Hardhat / Anvil default (see frontend `hardhatLocal`); RPC host differs on mobile (see above). */
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
            http: [HARDHAT_RPC_URL || 'http://127.0.0.1:8545'],
        },
    },
    /** Local Hardhat has no canonical explorer; wallets often require this field for add/switch network. */
    blockExplorers: {
        default: {
            name: 'Hardhat',
            url: 'https://hardhat.org/hardhat-network',
        },
    },
    testnet: true,
});
