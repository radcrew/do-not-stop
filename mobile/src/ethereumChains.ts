import { Platform } from 'react-native';
import { defineChain } from 'viem';
import { HARDHAT_RPC_URL } from '@env';

/**
 * Resolves the JSON-RPC URL the app advertises for Hardhat Local (31337).
 *
 * - Android emulator: `127.0.0.1` is the emulator itself, not your PC. Use the host alias `10.0.2.2`.
 * - iOS simulator: `127.0.0.1` usually reaches the host machine.
 * - Physical device: set `HARDHAT_RPC_URL` in `.env` to your PC’s LAN IP (e.g. `http://192.168.1.10:8545`).
 */
export function getHardhatRpcHttpUrl(): string {
    const fromEnv = typeof HARDHAT_RPC_URL === 'string' ? HARDHAT_RPC_URL.trim() : '';
    if (fromEnv.length > 0 && /^https?:\/\//i.test(fromEnv)) {
        return fromEnv;
    }
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8545';
    }
    return 'http://127.0.0.1:8545';
}

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
            http: [getHardhatRpcHttpUrl()],
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
